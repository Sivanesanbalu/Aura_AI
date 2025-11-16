"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/app/components/firebaseClient"; // make sure firebase is initialized
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidaList from './_components/CandidaList';

function InterviewDetail() {
  const { interview_id } = useParams();
  const [userEmail, setUserEmail] = useState(null);
  const [interviewDetail, setInterviewDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        setUserEmail(user.email);

        try {
          // Fetch the main interview document
          const interviewRef = doc(db, "interview", interview_id);
          const interviewSnap = await getDoc(interviewRef);

          if (!interviewSnap.exists()) {
            setError("No interview data found.");
            setInterviewDetail(null);
            return;
          }

          const interviewData = interviewSnap.data();

          // Optionally, fetch the feedback subcollection
          const feedbackRef = collection(interviewRef, "interview-feedback");
          const feedbackSnapshot = await getDocs(feedbackRef);
          const feedbackList = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setInterviewDetail({
            ...interviewData,
            "interview-feedback": feedbackList
          });
        } catch (err) {
          console.error("❌ Firebase fetch error:", err);
          setError("Failed to fetch interview data.");
          setInterviewDetail(null);
        } finally {
          setLoading(false);
        }

      } else {
        setUserEmail(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [interview_id]);

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
      <CandidaList candidateList={interviewDetail?.['interview-feedback']} />
    </div>
  );
}

export default InterviewDetail;
