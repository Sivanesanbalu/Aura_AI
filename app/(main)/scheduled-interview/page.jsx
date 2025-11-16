"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import InterviewCard from "../dashboard/_components/InterviewCard";
 // Make sure your Firebase is initialized
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebaseClient";

function ScheduledInterview() {
  const [userEmail, setUserEmail] = useState(null);
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetInterviewList = async (email) => {
    setLoading(true);
    try {
      const interviewsRef = collection(db, "interview");
      const q = query(
        interviewsRef,
        where("email", "==", email),
        orderBy("created_at", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInterviewList(data);
    } catch (error) {
      console.error("❌ Firebase fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
        GetInterviewList(user.email);
      } else {
        setUserEmail(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl mb-4">Interview List With Candidate Feedback</h2>

      {loading && (
        <p className="text-center text-gray-500 mt-4">Loading interviews...</p>
      )}

      {!loading && !interviewList?.length && (
        <div className="p-5 mt-6 flex flex-col items-center gap-4 border rounded-md bg-white">
          <Video className="h-10 w-10 text-primary" />
          <p className="text-gray-700">No interviews scheduled yet.</p>
          <Button onClick={() => window.location.assign("/interview/create")}>
            Create New Interview
          </Button>
        </div>
      )}

      {!loading && interviewList?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {interviewList.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
