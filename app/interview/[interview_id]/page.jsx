"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { InterviewDataContex } from "@/context/InterviewDataContext";
import { Clock, Info, Loader2Icon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

function Interview() {
  const { interview_id } = useParams();
  const router = useRouter();
  const { setInterviewInfo } = useContext(InterviewDataContex);

  const [interviewData, setInterviewData] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (interview_id) fetchInterview();
  }, [interview_id]);

  const fetchInterview = async () => {
    setLoading(true);
    try {
      const interviewRef = doc(db, "interviews", interview_id);
      const interviewSnap = await getDoc(interviewRef);

      if (!interviewSnap.exists()) {
        toast.error("Invalid or expired interview link.");
        router.push("/");
        return;
      }

      setInterviewData(interviewSnap.data());
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch interview data.");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onJoinInterview = () => {
    if (!userName.trim() || !isValidEmail(userEmail)) {
      toast.error("Please enter a valid name and email.");
      return;
    }

    setInterviewInfo({
      userName,
      userEmail,
      interviewData,
    });

    router.push(`/interview/${interview_id}/start`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-500 p-4">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center bg-white border border-gray-600 rounded-2xl shadow-xl p-8">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          AI Interview Platform
        </h2>

        <Image src="/interview.png" alt="interview icon" width={500} height={500} className="w-32 my-6" />

        <div className="text-center h-20">
          {!interviewData ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2Icon className="animate-spin text-blue-500 h-8 w-8" />
              <p className="text-gray-500">Connecting to interview...</p>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-3xl text-gray-800">{interviewData.jobPosition}</h2>
              <div className="flex gap-2 items-center justify-center text-gray-500 mt-3">
                <Clock className="h-5 w-5" />
                <span>{interviewData.duration} Session</span>
              </div>
            </>
          )}
        </div>

        <div className="w-full mt-6 space-y-4">
          <div>
            <label className="text-gray-700 font-medium mb-2 block">Your Full Name</label>
            <Input placeholder="Enter your name..." value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <label className="text-gray-700 font-medium mb-2 block">Your Email Address</label>
            <Input type="email" placeholder="Enter your email..." value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
          </div>
        </div>

        <Button
          className="mt-8 w-full font-bold text-lg py-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading || !userName || !isValidEmail(userEmail)}
          onClick={onJoinInterview}
        >
          {loading ? <Loader2Icon className="animate-spin mr-2 h-6 w-6" /> : <Video className="mr-2 h-6 w-6" />}
          Join Secure Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
