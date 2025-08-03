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

      if (!Interviews || Interviews.length === 0) {
        toast('Incorrect Interview Link');
        setLoading(false);
        return;
      }

      setInterviewData(Interviews[0]);
    } catch (e) {
      toast('Something went wrong while fetching interview data');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onJoinInterview = async () => {
    if (!userName || !isValidEmail(userEmail)) {
      toast('Please enter valid name and email');
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
        toast('Invalid Interview ID');
      }
    } catch (e) {
      toast('Failed to join interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center border rounded-lg bg-white-200 p-7 lg:px-33 xl:px-52 mb-1'>

      

     <div className="flex flex-col items-center justify-center border rounded-lg bg-gray-100 p-7 lg:px-33 xl:px-52 mb-1">
        <h2 className="mt-1 text-center text-xl font-bold text-gray-800">
            AI-Powered Interview Platform
        </h2>

        {/* Only one image inside box */}
        <Image
          src='/interview.png'
          alt='interview'
          width={500}
          height={500}
          className='w-[150px] my-6'
        />

        {!interviewData ? (
          <p className='text-gray-500'>Loading interview details...</p>
        ) : (
          <>
            <h2 className='font-bold text-xl mt-3'>{interviewData.jobPosition}</h2>
            <h2 className='flex gap-2 items-center text-gray-500 mt-2'>
              <Clock className='h-4 w-4' /> {interviewData.duration}
            </h2>
          </>
        )}

        {/* Form Fields */}
        <div className='w-full mt-5'>
          <h2>Enter your full name</h2>
          <Input
            placeholder='e.g. Sivanesan'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className='w-full mt-3'>
          <h2>Enter your Email</h2>
          <Input
            placeholder='e.g. sivanesan@gmail.com'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>

        {/* Tips Section */}
        <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-4'>
          <Info className='text-primary' />
          <div>
            <h2 className='font-bold'>Before you begin</h2>
            <ul className='text-sm text-primary list-disc ml-5 mt-1'>
              <li>Test your camera and microphone</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet place for the interview</li>
            </ul>
          </div>
        </div>

        {/* Join Button */}
        <Button
          className='mt-5 w-full font-bold'
          disabled={loading || !userName || !userEmail}
          onClick={onJoinInterview}
        >
          <Video className='mr-2' />
          {loading && <Loader2Icon className='animate-spin mr-2' />}
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
