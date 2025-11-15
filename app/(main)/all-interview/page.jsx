"use client";

import React, { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import InterviewCard from "@/components/InterviewCard"; // Make sure this exists

function AllInterview() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch interviews from Firestore
  const fetchInterviews = useCallback(async () => {
    if (!firebaseUser?.email) return;

    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "interview"),
        where("email", "==", firebaseUser.email),
        orderBy("created_at", "desc") // Ensure index exists
      );

      const querySnapshot = await getDocs(q);
      const interviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInterviewList(interviews);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError("Failed to load interviews. Please try again.");
      setInterviewList([]);
    }

    setLoading(false);
  }, [firebaseUser]);

  // Automatically fetch interviews when user logs in
  useEffect(() => {
    if (firebaseUser?.email) {
      fetchInterviews();
    }
  }, [firebaseUser, fetchInterviews]);

  return (
    <div className="my-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">All Interviews</h2>
        {!loading && (
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={fetchInterviews}
          >
            Refresh
          </Button>
        )}
      </div>

      {loading ? (
        <p className="mt-6 text-center text-gray-500 animate-pulse">
          Loading interviews...
        </p>
      ) : error ? (
        <p className="mt-6 text-center text-red-500">{error}</p>
      ) : interviewList.length === 0 ? (
        <div className="p-5 mt-6 flex flex-col items-center gap-4 border rounded-md bg-white">
          <Video className="h-10 w-10 text-primary" />
          <p className="text-gray-700">No interviews scheduled yet.</p>
          <Button onClick={() => (window.location.href = "/interview/create")}>
            Create New Interview
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {interviewList.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllInterview;
