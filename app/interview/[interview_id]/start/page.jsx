'use client';

import { InterviewDataContex } from '@/context/InterviewDataContext';
import { Loader2Icon, Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import { supabase } from '@/app/components/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContex);
  const vapiRef = useRef(null); // Persistent Vapi instance

  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [loading, setLoading] = useState(false);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [faceWarning, setFaceWarning] = useState('');
  const [detectionReady, setDetectionReady] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const { interview_id } = useParams();
  const router = useRouter();

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // === Start Voice Call ===
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    }
    if (interviewInfo) startCall();
    return () => {
      cleanupVapi();
    };
  }, [interviewInfo]);

  const startCall = () => {
    const questionList = interviewInfo?.interviewData?.questionList
      ?.map((q) => q.question)
      .join(', ');

    const assistantOptions = {
      name: 'AI Recruiter',
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
      voice: { provider: 'playht', voiceId: 'jennifer' },
      model: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `
              You are an AI voice assistant conducting interviews.
              Begin with a friendly introduction like:
              "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let’s get started with a few questions!"
              Ask the following questions one by one, listening after each:
              Questions: ${questionList}
              Give hints if needed, respond naturally, and offer feedback.
              After 5-7 questions, summarize their performance positively.
              End by thanking them and wishing good luck.
              Stay engaging, friendly, and focused on React.
            `.trim(),
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
  };

  // === Stop Interview ===
  const stopInterview = async () => {
    setLoading(true);
    try {
      cleanupVapi();
      if (timerRef.current) clearInterval(timerRef.current);
      await GenerateFeedback();
    } catch (err) {
      console.error('Error stopping interview:', err);
      toast.error('Failed to stop interview');
    } finally {
      setLoading(false);
    }
  };

  // === Full Cleanup for Vapi & Streams ===
  const cleanupVapi = () => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
        vapiRef.current.disconnect();
      } catch (err) {
        console.error('Error cleaning Vapi:', err);
      }
      vapiRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  // === Generate Feedback ===
  const GenerateFeedback = async () => {
    if (feedbackGenerated || !conversation) return;
    setFeedbackGenerated(true);
    try {
      const result = await axios.post('/api/ai-feedback', { conversation });
      const feedback = result.data;

      const { error } = await supabase.from('interview-feedback').insert([
        {
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id,
          feedback,
          recommended: false,
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to save feedback');
      } else {
        toast.success('Feedback saved');
        router.replace(`/interview/${interview_id}/completed`);
      }
    } catch (err) {
      console.error('Feedback generation error:', err);
      toast.error('Failed to generate feedback');
    }
  };

  // === Handle Vapi Events ===
  useEffect(() => {
    if (!vapiRef.current) return;

    const handleMessage = (message) => {
      if (message?.conversation) {
        const convoString = JSON.stringify(message.conversation);
        setConversation(convoString);
      }
    };

    const handleCallStart = () => {
      toast('Call Connected...');
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    };

    const handleSpeechStart = () => setActiveUser(false);
    const handleSpeechEnd = () => setActiveUser(true);

    const handleCallEnd = () => {
      toast('Interview ended');
      cleanupVapi();
      GenerateFeedback();
    };

    vapiRef.current.on('message', handleMessage);
    vapiRef.current.on('call-start', handleCallStart);
    vapiRef.current.on('Speech-Start', handleSpeechStart);
    vapiRef.current.on('Speech-end', handleSpeechEnd);
    vapiRef.current.on('call-end', handleCallEnd);

    return () => {
      if (vapiRef.current) {
        vapiRef.current.off('message', handleMessage);
        vapiRef.current.off('call-start', handleCallStart);
        vapiRef.current.off('Speech-Start', handleSpeechStart);
        vapiRef.current.off('Speech-end', handleSpeechEnd);
        vapiRef.current.off('call-end', handleCallEnd);
      }
    };
  }, []);

  // === Face Detection Logic ===
  useEffect(() => {
    let model;

    const loadModelAndDetect = async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        const blazeface = await import('@tensorflow-models/blazeface');
        await tf.ready();
        model = await blazeface.load();

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setDetectionReady(true);

        const ctx = canvasRef.current.getContext('2d');

        const detect = async () => {
          if (videoRef.current.readyState === 4) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;

            const predictions = await model.estimateFaces(videoRef.current, false);
            setFacesDetected(predictions.length);

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'red';

            if (predictions.length === 1) {
              const pred = predictions[0];
              const [x, y] = pred.topLeft;
              const [x2, y2] = pred.bottomRight;
              ctx.strokeRect(x, y, x2 - x, y2 - y);

              const [rightEye, leftEye, nose] = pred.landmarks;
              const eyeSlope = Math.abs(rightEye[1] - leftEye[1]);
              const noseCenter = (rightEye[0] + leftEye[0]) / 2;
              const headTurn = Math.abs(nose[0] - noseCenter);

              if (eyeSlope > 10 || headTurn > 20) {
                setFaceWarning('⚠ Please look straight at the camera.');
              } else {
                setFaceWarning('✅ Face aligned properly.');
              }
            } else if (predictions.length === 0) {
              setFaceWarning('❌ No face detected. Please sit in front of the camera.');
            } else {
              setFaceWarning('⚠ Multiple faces detected. Only one person allowed.');
            }
          }

          animationRef.current = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error('Face detection error:', err);
        toast.error('Failed to initialize camera');
      }
    };

    loadModelAndDetect();

    return () => {
      cleanupVapi();
    };
  }, []);

  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>
        AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          {formatTime(elapsedTime)}
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center mt-5'>
          <div className='relative'>
            {!activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'></span>}
            <Image src='/OIP.png' alt='AI' width={60} height={60} className='w-[60px] h-[60px] rounded-full object-cover' />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center mt-5 relative overflow-hidden'>
          <h2>{interviewInfo?.userName}</h2>
          <div className='relative w-full flex justify-center mt-2' style={{ height: 250 }}>
            <video ref={videoRef} muted playsInline className='absolute top-0 left-0 w-full h-full object-cover rounded-md' />
            <canvas ref={canvasRef} className='absolute top-0 left-0 w-full h-full rounded-md pointer-events-none' />
          </div>
          <p className='text-sm mt-2 text-gray-500'>Faces detected: {facesDetected}</p>
          <p className='text-sm text-center font-medium'>{faceWarning}</p>
        </div>
      </div>

      <div className='flex items-center gap-5 justify-center mt-3'>
        <Mic className='h-12 w-12 bg-gray-700 text-white rounded-full cursor-pointer' />
        <AlertConfirmation stopInterview={stopInterview}>
          {!loading ? (
            <Phone className='h-12 w-12 bg-red-700 text-white rounded-full cursor-pointer' onClick={stopInterview} />
          ) : (
            <Loader2Icon className='h-12 w-12 animate-spin text-gray-500' />
          )}
        </AlertConfirmation>
      </div>

      <h2 className='text-sm text-gray-400 text-center mt-5'>
        {detectionReady ? 'Interview in Progress...' : 'Initializing camera...'}
      </h2>
    </div>
  );
}

export default StartInterview;
