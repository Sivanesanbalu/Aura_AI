"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { supabase } from "@/app/components/supabaseClient";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidaList from './_components/CandidaList'
function InterviewDetail() {
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !interview_id) return;

        const userEmail = user?.primaryEmailAddress?.emailAddress;

        const result = await supabase
          .from("interview")
          .select(
            `
              jobPosition,
              jobDescription,
              type,
              questionList,
              duration,
              interview_id,
              created_at,
              interview-feedback (
                userEmail,
                userName,
                feedback,
                created_at
              )
            `
          )
          .eq("email", userEmail)
          .eq("interview_id", interview_id);

        if (result.error) {
          console.error("❌ Supabase fetch error:", result.error);
          setError("Failed to fetch interview data.");
          setInterviewDetail(null);
        } else {
          setInterviewDetail(result.data?.[0] || null);
        }
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, interview_id]);

  
  if (loading) {
    return <p className="text-gray-500 text-center mt-5">Loading interview details...</p>;
  }

  if (error || !interviewDetail) {
    return (
      <div className="text-red-600 text-center mt-5">
        {error || "No interview data found."}
      </div>
    );
  }

  
  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl mb-4">Interview Detail</h2>
      <InterviewDetailContainer interviewDetail={interviewDetail} />
      <CandidaList candidateList={interviewDetail?.['interview-feedback']}/>
    </div>
  );
}

export default InterviewDetail;