"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "@/firebase"; // ✅ Firebase import
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidaList from "./_components/CandidaList";

function InterviewDetail() {
  const { interview_id } = useParams();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [interviewDetail, setInterviewDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 Fetch interview details
  useEffect(() => {
    const fetchData = async () => {
      if (!firebaseUser || !interview_id) return;

      setLoading(true);
      setError(null);

      try {
        const userEmail = firebaseUser.email;

        // Firestore query
        const interviewRef = collection(db, "interview");
        const q = query(
          interviewRef,
          where("email", "==", userEmail),
          where("interview_id", "==", interview_id)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No interview data found.");
          setInterviewDetail(null);
        } else {
          const docData = querySnapshot.docs[0].data();
          setInterviewDetail(docData);
        }
      } catch (err) {
        console.error("❌ Firestore fetch error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firebaseUser, interview_id]);

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
      <CandidaList candidateList={interviewDetail?.["interview-feedback"]} />
    </div>
  );
}

export default InterviewDetail;
