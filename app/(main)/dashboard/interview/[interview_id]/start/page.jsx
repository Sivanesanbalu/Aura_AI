'use client';

import { InterviewDataContex } from '@/context/InterviewDataContext';
import { Loader2Icon, Phone, Timer, Star, Smile, Meh, Frown, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

// --- Import MediaPipe and other necessary libraries ---
import { FaceLandmarker, FilesetResolver, Pose, HandLandmarker } from "@mediapipe/tasks-vision";

// --- MOCK ANALYSIS DATA ---
// In a real application, this data would come from a backend via WebSocket.
const MOCK_SENTIMENTS = ['Confident', 'Neutral', 'Slightly Hesitant', 'Confident'];
const MOCK_EMOTIONS = ['Calm', 'Focused', 'Engaged', 'Excited'];

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContex);
  const vapiRef = useRef(null);

  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [loading, setLoading] = useState(false);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [faceWarning, setFaceWarning] = useState('');
  const [detectionReady, setDetectionReady] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  
  // --- NEW STATES FOR ADVANCED ANALYSIS ---
  const [currentSentiment, setCurrentSentiment] = useState('Neutral');
  const [currentEmotion, setCurrentEmotion] = useState('Calm');
  const [answerQuality, setAnswerQuality] = useState({ score: 0, feedback: 'Awaiting answer...' });
  const [microExpression, setMicroExpression] = useState('Neutral');
  const [posture, setPosture] = useState('Upright');
  const [eyeContact, setEyeContact] = useState(true);
  const [gestures, setGestures] = useState([]);
  const [focusScore, setFocusScore] = useState(100);
  // --- END NEW STATES ---

  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const streamRef = useRef(null);
  
  // Refs for MediaPipe models
  const faceLandmarker = useRef();
  const poseEstimator = useRef();
  const handLandmarker = useRef();
  const lastVideoTime = useRef(-1);

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

    // --- MOCK DATA SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      // This simulates receiving real-time updates from a backend.
      setCurrentSentiment(MOCK_SENTIMENTS[Math.floor(Math.random() * MOCK_SENTIMENTS.length)]);
      setCurrentEmotion(MOCK_EMOTIONS[Math.floor(Math.random() * MOCK_EMOTIONS.length)]);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);


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
              You are an expert Senior Technical Interviewer. Your purpose is to conduct a professional, time-efficient evaluation. Your standards are high and your tone is objective and courteous. You are interviewing for the **${interviewInfo?.interviewData?.jobPosition}** role.

              **Core Questions to Ask:**
              ${questionList}

              ---

              **Your Interview Protocol (MANDATORY AND STRICT):**

              1.  **The Introduction (Time-boxed to 1 Minute):**
                  *   Your first and only opening phrase is: "Before we begin, please tell me about yourself. **Your intro should be no more than one minute.**"
                  *   While they speak, you will listen silently. **Do not ask follow-up questions about their introduction.**
                  *   If their introduction goes significantly over one minute, you must politely interrupt with: "Thank you for the overview. For the sake of time, let's start with the first technical question."

              2.  **The Core Questioning (Probing Phase):**
                  *   Proceed through the **Core Questions** list one by one.
                  *   After each answer from the candidate, you **must** ask one or two deep follow-up questions to understand their reasoning. Examples: "Why did you choose that specific approach?", "What are the trade-offs of that solution?", "How does that scale?".
                  *   For behavioral questions, probe for specifics on the **Situation, Task, Action, and Result (STAR method)** if the candidate is vague.

              3.  **Strict No-Explanation Policy:**
                  *   This is the most critical rule. Your goal is to **identify if the candidate knows the answer or not.** You are not here to teach.
                  *   You **must not**, under any circumstances, explain the correct answer to a question.
                  *   If a candidate says they don't know the answer, or is silent for too long, you have only **one** allowed response: **"Okay, let's move on."**
                  *   Do not offer hints, do not rephrase the question in a simpler way, and do not provide the solution after they fail to answer. Just move to the next question.

              4.  **Candidate's Questions:**
                  *   After you have asked all your questions, say: "That's all the questions I have. Do you have any questions for me about the role?"
                  *   Briefly answer 1-2 questions from them, then conclude.

              5.  **Professional Closing:**
                  *   End the interview by saying: "Thank you for your time today. Our recruiting team will be in touch regarding the next steps."
                  *   **Do not** give any feedback on their performance. Then, you must end the call.
            `.trim(),
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
  };


  const stopInterview = async () => {

    if (isStopping) return;

    setIsStopping(true);
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
      setIsStopping(false);
    }
  };


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
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  const GenerateFeedback = async () => {
    if (feedbackGenerated || !conversation) {
      router.replace(`/interview/${interview_id}/completed`);
      return;
    };
    setFeedbackGenerated(true);
    try {
      const result = await axios.post('/api/ai-feedback', { conversation });
      const feedback = result.data;

      try {
      await addDoc(collection(db, 'interview-feedback'), {
        userName: interviewInfo?.userName,
        userEmail: interviewInfo?.userEmail,
        interview_id,
        feedback,
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


        const lastUtterance = message?.conversation?.at(-1)?.content?.toLowerCase() || "";
        const endKeywords = ["end interview", "stop interview", "finish interview", "wrap up", "quit interview"];

        if (endKeywords.some(keyword => lastUtterance.includes(keyword))) {
          toast.warning("Candidate requested to end interview.");
          stopInterview();
        }
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
    const createHolisticModels = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      faceLandmarker.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });
      poseEstimator.current = await Pose.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

      setDetectionReady(true);
      startDetection();
    };

    const startDetection = () => {
      if (videoRef.current && videoRef.current.readyState >= 3) {
        predictWebcam();
      } else {
        setTimeout(startDetection, 100);
      }
    };
    
    createHolisticModels();

    const predictWebcam = () => {
      const video = videoRef.current;
      if (video.currentTime !== lastVideoTime.current) {
        lastVideoTime.current = video.currentTime;
        const startTimeMs = performance.now();
        
        if (faceLandmarker.current) {
          const faceLandmarkerResult = faceLandmarker.current.detectForVideo(video, startTimeMs);
          // Process face results (micro-expressions, eye contact)
        }
        if (poseEstimator.current) {
          const poseResult = poseEstimator.current.detectForVideo(video, startTimeMs);
          // Process pose results (posture)
        }
        if (handLandmarker.current) {
            const handLandmarkerResult = handLandmarker.current.detectForVideo(video, startTimeMs);
            // Process hand results (gestures)
        }
      }
      animationFrameId.current = requestAnimationFrame(predictWebcam);
    };

    return () => {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const getWarningTextColor = () => {
    if (faceWarning.includes('✅')) return 'text-green-600';
    if (faceWarning.includes('⚠')) return 'text-yellow-500';
    if (faceWarning.includes('❌')) return 'text-red-500';
    return 'text-gray-500';
  };

  const getSentimentIcon = () => {
      switch(currentSentiment.toLowerCase()){
          case 'confident': return <Smile className="h-5 w-5 text-green-500"/>;
          case 'slightly hesitant': return <Meh className="h-5 w-5 text-yellow-500"/>;
          default: return <Frown className="h-5 w-5 text-gray-500"/>
      }
  }

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
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between p-8 aspect-video'>
              <div className="text-center">
                <div className={`relative inline-block rounded-full p-2 transition-all duration-300 ${!activeUser ? 'ring-4 ring-blue-500 ring-opacity-75' : 'ring-4 ring-transparent'}`}>
                    <Image src='/OIP.png' alt='AI Recruiter' width={100} height={100} className='w-24 h-24 rounded-full object-cover shadow-md' />
                    {!activeUser && (
                        <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'></span>
                    )}
                </div>
                <h2 className='text-2xl font-semibold text-gray-800 mt-5'>AI Recruiter</h2>
                <p className='text-gray-500 mt-1 h-6'>{activeUser ? 'Listening for your response...' : 'Speaking...'}</p>
              </div>
              
              {/* --- NEW: Advanced Analysis Display --- */}
              <div className='mt-6 border-t pt-4 space-y-3 text-sm'>
                  <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">Real-Time Analysis</h3>
                  <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-600 flex items-center gap-2'><Smile className="h-5 w-5"/>Sentiment Analysis:</span>
                      <span className='font-mono px-2 py-1 bg-gray-100 rounded-md flex items-center gap-2'>{getSentimentIcon()} {currentSentiment}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-600 flex items-center gap-2'><BrainCircuit className="h-5 w-5"/>Vocal Emotion:</span>
                      <span className='font-mono px-2 py-1 bg-gray-100 rounded-md'>{currentEmotion}</span>
                  </div>
                   <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-600 flex items-center gap-2'><Star className="h-5 w-5"/>Answer Quality:</span>
                      <span className='font-mono px-2 py-1 bg-gray-100 rounded-md'>Awaiting...</span>
                  </div>
              </div>
              {/* --- END: Advanced Analysis Display --- */}

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