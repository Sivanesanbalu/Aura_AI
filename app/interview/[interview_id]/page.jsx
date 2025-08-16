"use client";

import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/components/supabaseClient';
import { toast } from 'sonner';
import { InterviewDataContex } from '@/context/InterviewDataContext';
import { Clock, Info, Loader2Icon, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Interview() {
  const { interview_id } = useParams();
  const router = useRouter();
  const { setInterviewInfo } = useContext(InterviewDataContex);

  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (interview_id) {
      GetInterviewDetails();
    }
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: Interviews, error } = await supabase
        .from('interview')
        .select('jobPosition, jobDescription, duration, type')
        .eq('interview_id', interview_id);

      if (error || !Interviews || Interviews.length === 0) {
        toast.error('Invalid or expired interview link.');
        router.push('/');
        setLoading(false);
        return;
      }
      setInterviewData(Interviews[0]);
    } catch (e) {
      toast.error('Something went wrong while fetching interview data');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onJoinInterview = async () => {
    if (!userName.trim() || !isValidEmail(userEmail)) {
      toast.error('Please enter a valid name and email address.');
      return;
    }
    setLoading(true);
    try {
      let { data: Interviews, error } = await supabase
        .from('interview')
        .select('*')
        .eq('interview_id', interview_id);

      if (Interviews && Interviews[0]) {
        setInterviewInfo({
          userName,
          userEmail,
          interviewData: Interviews[0]
        });
        router.push(`/interview/${interview_id}/start`);
      } else {
        toast.error('Invalid Interview ID');
      }
    } catch (e) {
      toast.error('Failed to join the interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4 overflow-hidden'>
      {/* Animated Aurora Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/50 rounded-full filter blur-3xl opacity-40 animate-[blob-spin_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/50 rounded-full filter blur-3xl opacity-40 animate-[blob-spin_15s_ease-in-out_infinite_reverse]"></div>
      </div>
      
      {/* The Main "Glass" Card */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center 
        bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8">
        
        <h2 className="text-center text-2xl font-bold text-gray-100 tracking-wide">
          AI Interview Platform
        </h2>

        <Image
          src='/interview.png'
          alt='interview'
          width={500}
          height={500}
          className='w-[140px] my-6 drop-shadow-lg'
        />

        <div className="text-center h-20"> {/* Fixed height to prevent layout shift */}
          {!interviewData ? (
            <div className='flex flex-col items-center justify-center gap-4'>
              <Loader2Icon className='animate-spin text-cyan-300 h-8 w-8'/>
              <p className='text-gray-300'>Connecting to interview...</p>
            </div>
          ) : (
            <>
              <h2 className='font-bold text-3xl text-white drop-shadow-md'>{interviewData.jobPosition}</h2>
              <div className='flex gap-2 items-center justify-center text-gray-300 mt-3'>
                <Clock className='h-5 w-5' /> 
                <span>{interviewData.duration} Session</span>
              </div>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className='w-full mt-6 space-y-4'>
          <div>
            <label className='text-gray-200 font-medium mb-2 block'>Your Full Name</label>
            <Input
              placeholder='Enter your name...'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
            />
          </div>
          <div>
            <label className='text-gray-200 font-medium mb-2 block'>Your Email Address</label>
            <Input
              type="email"
              placeholder='Enter your email...'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className='p-4 bg-black/10 border border-cyan-400/20 flex gap-4 rounded-lg mt-8 w-full'>
          <Info className='text-cyan-300 h-6 w-6 flex-shrink-0 mt-1' />
          <div>
            <h2 className='font-bold text-cyan-200'>Quick Checklist</h2>
            <ul className='text-sm text-gray-300 list-disc ml-5 mt-2 space-y-1'>
              <li>Check that your camera and microphone are enabled.</li>
              <li>Ensure you have a stable internet connection.</li>
              <li>Find a quiet, distraction-free environment.</li>
            </ul>
          </div>
        </div>

        {/* Join Button */}
        <Button
          className='mt-8 w-full font-bold text-lg py-6 rounded-lg 
            bg-gradient-to-r from-cyan-500 to-purple-600 text-white
            hover:shadow-lg hover:shadow-cyan-500/40 
            transform hover:-translate-y-1 transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loading || !userName || !isValidEmail(userEmail)}
          onClick={onJoinInterview}
        >
          {loading ? (
            <Loader2Icon className='animate-spin mr-2 h-6 w-6' />
          ) : (
            <Video className='mr-2 h-6 w-6' />
          )}
          Join Secure Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;