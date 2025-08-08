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
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [loading, setLoading] = useState(false);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [faceWarning, setFaceWarning] = useState('');
  const [detectionReady, setDetectionReady] = useState(false);

  const { interview_id } = useParams();
  const router = useRouter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  // === Start Voice Call ===
  useEffect(() => {
    if (interviewInfo) startCall();
  }, [interviewInfo]);

  const startCall = () => {
    const questionList = interviewInfo?.interviewData?.questionList?.map(q => q.question).join(', ');

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
          You are an AI voice assistant conducting technical interviews for a React developer position.

          Start with a friendly introduction like:
          "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let’s get started with a few questions!"

          Ask the following questions one at a time, listening carefully after each response:
          Questions: ${questionList}

          For each answer Give a short, friendly response Provide one of the following types of feedback based on their answer quality:
             **Positive** – if the answer is technically correct and confident  
            **Medium/Neutral** – if the answer is partially correct or lacks clarity  
            **Negative** – if the answer is incorrect, vague, or completely off-topic  
          - Offer a hint or guidance if the answer is weak or stuck

          After 1-10 questions:
          - Summarize the candidate’s overall performance using the same categories (positive, neutral, or negative)
          - Be constructive: encourage improvement even for weak performance
          - End politely: "Thanks for your time and effort today! Best of luck moving forward."

          Maintain a friendly, supportive tone throughout.
          Focus on evaluating their **React knowledge** clearly and fairly.
          `.trim(),

          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const stopInterview = async () => {
    setLoading(true);
    try {
      await vapi.stop();
      await GenerateFeedback();
    } catch (err) {
      console.error('Error stopping interview:', err);
      toast.error('Failed to stop interview');
    } finally {
      setLoading(false);
    }
  };

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
      console.error('Feedback error:', err);
      toast.error('Failed to generate feedback');
    }
  };

  // === Handle Vapi Events ===
  useEffect(() => {
    const handleMessage = (message) => {
      if (message?.conversation) {
        setConversation(JSON.stringify(message.conversation));
      }
    };

    const handleCallStart = () => toast('Call Connected...');
    const handleSpeechStart = () => setActiveUser(false);
    const handleSpeechEnd = () => setActiveUser(true);
    const handleCallEnd = () => {
      toast('Interview ended');
      GenerateFeedback();
    };

    vapi.on('message', handleMessage);
    vapi.on('call-start', handleCallStart);
    vapi.on('Speech-Start', handleSpeechStart);
    vapi.on('Speech-end', handleSpeechEnd);
    vapi.on('call-end', handleCallEnd);

    return () => {
      vapi.off('message', handleMessage);
      vapi.off('call-start', handleCallStart);
      vapi.off('Speech-Start', handleSpeechStart);
      vapi.off('Speech-end', handleSpeechEnd);
      vapi.off('call-end', handleCallEnd);
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

            if (predictions.length === 1) {
              const pred = predictions[0];
              const [x, y] = pred.topLeft;
              const [x2, y2] = pred.bottomRight;
              ctx.strokeStyle = 'green';
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>
        AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
        {/* AI Recruiter */}
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center mt-5'>
          <div className='relative'>
            {!activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'></span>}
            <Image src='/OIP.png' alt='AI' width={60} height={60} className='w-[60px] h-[60px] rounded-full object-cover' />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        {/* Candidate Face Detection */}
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center mt-5 relative overflow-hidden'>
          <h2>{interviewInfo?.userName}</h2>
          <div className='relative w-full flex justify-center mt-2' style={{ height: 250 }}>
            <video ref={videoRef} muted playsInline className='absolute top-0 left-0 w-full h-full object-cover rounded-md' />
            <canvas ref={canvasRef} className='absolute top-0 left-0 w-full h-full rounded-md pointer-events-none' />
          </div>
          <p className={`text-sm text-center font-medium ${faceWarning.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {faceWarning}
          </p>
          <p className='text-sm mt-2 text-gray-500'>Faces detected: {facesDetected}</p>
        </div>
      </div>

      {/* Controls */}
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
