'use client';

import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';

import { useAuth } from '@/context/AuthContext'; // ✅ Firebase Auth Context

function CreateInterview() {
  const router = useRouter();
  const { user } = useAuth(); // get the current Firebase user from your context

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId] = useState();
  const [questionList, setQuestionList] = useState([]);

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log("FormData", formData);
  };

  const onGoToNext = () => {
    if (!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData?.type) {
      toast('Please enter all details!');
      return;
    }
    setStep(step + 1);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="text-lg font-medium">Please sign in to create an interview.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-5 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className='flex gap-5 items-center mb-5'>
        <ArrowLeft onClick={() => router.back()} className="text-black" />
        <h2 className='font-bold text-2xl text-black'>Create New Interview</h2>
      </div>

      <Progress value={step * 33.33} className='my-5' />

      {step === 1 ? (
        <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGoToNext} />
      ) : step === 2 ? (
        <QuestionList
          formData={formData}
          onCreateLink={onCreateLink}
          questionList={questionList}
          setQuestionList={setQuestionList}
          interview_id={interviewId}
        />
      ) : step === 3 ? (
        <InterviewLink
          interview_id={interviewId}
          formData={formData}
          questionList={questionList}
        />
      ) : null}
    </div>
  );
}

export default CreateInterview;
