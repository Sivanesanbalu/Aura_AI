'use client';

import { InterviewDataContex } from '@/context/InterviewDataContext';
import { Loader2Icon, Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';

import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebaseClient';
function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContex);
  const vapiRef = useRef(null); 
  const db = getFirestore(app);

  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [loading, setLoading] = useState(false);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [faceWarning, setFaceWarning] = useState('');
  const [detectionReady, setDetectionReady] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // --- MODIFICATION START ---
  // Added a state to act as a lock, preventing the stopInterview function from running multiple times.
  const [isStopping, setIsStopping] = useState(false);
  // --- MODIFICATION END ---

  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const { interview_id } = useParams();
  const router = useRouter();
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;

          if (newCount < 4) {
            toast.warning(` You switched tabs (${newCount}/3). Please stay focused.`);
          } else {
            toast.error(' You have switched tabs too many times. Interview will now end.');
            stopInterview(); 
          }

          return newCount;
        });
      } else {
        toast('✅ Welcome back to the interview tab.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


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
      firstMessage: `Hi ${interviewInfo?.userName}. My name is Jennifer, and I'll be conducting your technical interview today for the ${interviewInfo?.interviewData?.jobPosition} position. Are you ready to begin?`,
      transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
      voice: { provider: 'playht', voiceId: 'jennifer' },
      model: {
        provider: 'openai',
        model: 'gpt-4', 
        messages: [
          {
            role: 'system',
            content: `
              You are a Senior Technical Interviewer and Hiring Manager at a top-tier tech company like Google or Amazon. Your standards are extremely high. Your primary goal is not just to ask questions, but to deeply evaluate the candidate's problem-solving skills, technical depth, and communication abilities for the **${interviewInfo?.interviewData?.jobPosition}** role.

              **Core Task:**
              You will conduct this interview by asking the following questions from the provided list, one by one. **Do not move to the next question until you have thoroughly probed the candidate's response.**

              **Core Questions to Ask:**
              ${questionList}

              ---

              **Your Rules of Engagement (CRITICAL):**

              1.  **Probe with Follow-Up Questions:** For EVERY answer, you **must** ask one or two deep follow-up questions. Your goal is to uncover their reasoning. Never just accept a surface-level answer.
                  *   Use questions like: "Can you elaborate on why you chose that specific approach?", "What were the trade-offs you considered?", "How would that solution perform at scale?", "What alternatives did you think about and why did you discard them?".

              2.  **Enforce the STAR Method for Behavioral Questions:** For any question that starts with "Describe a time..." or "Tell me about a project...", you must listen for the STAR method (Situation, Task, Action, Result). If the candidate is vague, probe for specifics.
                  *   If they don't describe the situation, ask: "What was the context for this project?"
                  *   If they are unclear on their role, ask: "What were you specifically responsible for?"
                  *   If they don't mention the outcome, ask: "What was the measurable outcome or impact of your work?"

              3.  **Maintain a Professional Tone:** You are an expert, not just a friendly assistant. Be courteous, focused, and objective. Your tone should be that of a senior engineer evaluating a potential colleague.

              4.  **Do Not Give Hints or Answers:** Unlike a casual chat, you must not provide solutions. If a candidate is stuck, you can ask a guiding question like, "What's the first thing you might consider here?" or "Can you break the problem down into smaller pieces?", but never give away the answer.

              5.  **Professional Closing:** When the questions are complete, do not give an immediate performance summary. End the interview professionally. Say something like: "Alright, that's all the questions I have for you. Thank you for your time today. Our recruiting team will be in touch with you regarding the next steps." Then, end the call.
            `.trim(),
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
  };

  // --- MODIFICATION START ---
  // The stopInterview function is now guarded by the `isStopping` state.
  const stopInterview = async () => {
    // If the stopping process has already begun, exit immediately to prevent a race condition.
    if (isStopping) return; 
    
    setIsStopping(true); // Set the lock
    setLoading(true);
    toast('Ending interview...');

    try {
      cleanupVapi();
      if (timerRef.current) clearInterval(timerRef.current);
      await GenerateFeedback();
    } catch (err) {
      console.error('Error stopping interview:', err);
      toast.error('Failed to stop interview');
      setLoading(false);
      setIsStopping(false); // Release the lock if an error occurs to allow a retry.
    }
  };
  // --- MODIFICATION END ---

  // --- MODIFICATION START ---
  // The cleanup function is simplified. `vapi.stop()` is the correct method to end
  // the session. `disconnect()` is often redundant and can cause issues if called immediately after.
  const cleanupVapi = () => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
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
  // --- MODIFICATION END ---

  const GenerateFeedback = async () => {
  if (feedbackGenerated || !conversation?.length) {
    router.replace(`/interview/${interview_id}/completed`);
    return;
  }

  setFeedbackGenerated(true);

  try {
    const result = await axios.post('/api/ai-feedback', { conversation });
    const feedbackData = result.data; // <-- store the API response

    try {
      await addDoc(collection(db, 'interview-feedback'), {
        userName: interviewInfo?.userName,
        userEmail: interviewInfo?.userEmail,
        interview_id,
        feedback: feedbackData, // <-- use this
        recommended: false,
        createdAt: new Date()
      });
      toast.success('Feedback saved');
    } catch (err) {
      console.error('Firebase error:', err);
      toast.error('Failed to save feedback');
    }
 
    } catch (err) {
      console.error('Feedback generation error:', err);
      toast.error('Failed to generate feedback');
    } finally {
      router.replace(`/interview/${interview_id}/completed`);
    }
  };


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
    
    // This handler will now call the guarded `stopInterview` function.
    const handleCallEnd = () => {
      toast('Interview has ended.');
      stopInterview(); 
    };

    vapiRef.current.on('message', handleMessage);
    vapiRef.current.on('call-start', handleCallStart);
    vapiRef.current.on('speech-start', handleSpeechStart);
    vapiRef.current.on('speech-end', handleSpeechEnd);
    vapiRef.current.on('call-end', handleCallEnd);

    return () => {
      if (vapiRef.current) {
        vapiRef.current.off('message', handleMessage);
        vapiRef.current.off('call-start', handleCallStart);
        vapiRef.current.off('speech-start', handleSpeechStart);
        vapiRef.current.off('speech-end', handleSpeechEnd);
        vapiRef.current.off('call-end', handleCallEnd);
      }
    };
  }, []);

  useEffect(() => {
    let model;

    const loadModelAndDetect = async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        const blazeface = await import('@tensorflow-models/blazeface');
        await tf.ready();
        model = await blazeface.load();

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            await videoRef.current.play();
            setDetectionReady(true);
        }

        const ctx = canvasRef.current.getContext('2d');

        const detect = async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;

            const predictions = await model.estimateFaces(videoRef.current, false);
            setFacesDetected(predictions.length);

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.8)';

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
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'; 
                ctx.strokeRect(x, y, x2 - x, y2 - y);
              } else {
                setFaceWarning('✅ Face aligned properly.');
              }
            } else if (predictions.length === 0) {
              setFaceWarning('❌ No face detected. Please position yourself in front of the camera.');
            } else {
              setFaceWarning('⚠ Multiple faces detected. Please ensure only you are visible.');
            }
          }

          animationRef.current = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error('Face detection error:', err);
        toast.error('Could not initialize camera. Please check permissions.');
        setDetectionReady(true);
      }
    };

    loadModelAndDetect();

    return () => {
      cleanupVapi();
    };
  }, []);

  const getWarningTextColor = () => {
    if (faceWarning.includes('✅')) return 'text-green-600';
    if (faceWarning.includes('⚠')) return 'text-yellow-500';
    if (faceWarning.includes('❌')) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='p-4 sm:p-6 w-full shadow-sm bg-white border-b'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>AI Interview Session</h1>
          <div className='flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-mono'>
            <Timer className='h-6 w-6' />
            <span className='text-xl tracking-wider'>{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className='flex-grow flex flex-col items-center justify-center p-4 sm:p-8'>
        <div className='w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8'>

          {/* AI Recruiter Panel */}
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-8 aspect-video'>
            <div className={`relative rounded-full p-2 transition-all duration-300 ${!activeUser ? 'ring-4 ring-blue-500 ring-opacity-75' : 'ring-4 ring-transparent'}`}>
              <Image src='/OIP.png' alt='AI Recruiter' width={100} height={100} className='w-24 h-24 rounded-full object-cover shadow-md' />
              {!activeUser && (
                <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'></span>
              )}
            </div>
            <h2 className='text-2xl font-semibold text-gray-800 mt-5'>AI Recruiter</h2>
            <p className='text-gray-500 mt-1 h-6'>{activeUser ? 'Listening for your response...' : 'Speaking...'}</p>
          </div>
          
          {/* User Video Panel */}
          <div className='bg-black rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-1 relative overflow-hidden aspect-video'>
            {!detectionReady && (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20'>
                <Loader2Icon className='h-12 w-12 animate-spin text-white mb-4'/>
                <p className='text-white font-medium'>Initializing Camera...</p>
              </div>
            )}
            <div className='relative w-full h-full'>
              <video ref={videoRef} muted playsInline className='absolute top-0 left-0 w-full h-full object-cover rounded-lg' />
              <canvas ref={canvasRef} className='absolute top-0 left-0 w-full h-full pointer-events-none' />

               <div className='absolute top-3 left-3 p-2 px-4 rounded-lg text-sm font-semibold bg-gray-900 bg-opacity-50 text-white z-10'>
                  {interviewInfo?.userName || 'Candidate'}
                </div>
            </div>
          </div>
        </div>

        {/* Status & Warning Area */}
        <div className='w-full max-w-7xl mt-4 text-center'>
            <p className={`text-md font-medium ${getWarningTextColor()}`}>
                {faceWarning || 'Camera check complete.'}
            </p>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className='w-full bg-white bg-opacity-75 backdrop-blur-sm p-4 sticky bottom-0 border-t'>
        <div className='max-w-md mx-auto flex items-center justify-center gap-6'>
          <button className='p-4 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-not-allowed' disabled>
            <Mic className='h-6 w-6' />
          </button>
          
          {!loading ? (
            <button 
              className='p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg transform hover:scale-105' 
              onClick={stopInterview}
              aria-label="End Interview"
            >
              <Phone className='h-7 w-7' />
            </button>
          ) : (
            <button className='p-5 rounded-full bg-gray-200 text-gray-500' disabled>
               <Loader2Icon className='h-7 w-7 animate-spin' />
            </button>
          )}

        </div>
      </footer>
    </div>
  );
}

export default StartInterview;