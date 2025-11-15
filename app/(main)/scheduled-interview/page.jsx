"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

// Single Interview Card
function InterviewCard({ interview, onSaveFeedback }) {
  const [localFeedback, setLocalFeedback] = useState(interview.feedback || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!localFeedback.trim()) {
      alert("Feedback cannot be empty!");
      return;
    }
    setSaving(true);
    await onSaveFeedback(interview.id, localFeedback);
    setSaving(false);
  };

  return (
    <div className="p-5 border rounded-md bg-white flex flex-col gap-3">
      <h3 className="font-semibold text-lg">{interview.title || "Interview"}</h3>
      <p className="text-gray-600">{interview.description || "No description"}</p>
      
      <p className="text-gray-500 text-sm">
        Scheduled on: {interview.created_at?.toDate().toLocaleString() || "N/A"}
      </p>

      <textarea
        className="border rounded-md p-2 w-full"
        rows={3}
        placeholder="Enter feedback..."
        value={localFeedback}
        onChange={(e) => setLocalFeedback(e.target.value)}
      />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Feedback"}
      </Button>

      {interview.feedback && (
        <p className="text-green-600 mt-2">Previous Feedback: {interview.feedback}</p>
      )}
    </div>
  );
}

// Main Scheduled Interview Component
function ScheduledInterview() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase Auth User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all interviews from Firestore
  const GetInterviewList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "interview"),
        orderBy("created_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      setInterviewList(results);
    } catch (err) {
      console.error("Firestore fetch error:", err);
      alert("Failed to fetch interviews. Check console for details.");
    }
    setLoading(false);
  };

  // Save feedback to Firestore
  const saveFeedback = async (interviewId, feedback) => {
    try {
      const docRef = doc(db, "interview", interviewId);
      await updateDoc(docRef, { feedback, updated_at: serverTimestamp() });

      // Update local state for instant UI update
      setInterviewList((prev) =>
        prev.map((item) =>
          item.id === interviewId ? { ...item, feedback } : item
        )
      );

      alert("Feedback saved successfully!");
    } catch (err) {
      console.error("Failed to save feedback:", err);
      alert("Failed to save feedback! Check console for details.");
    }
  };

  // Fetch interviews when component mounts or user changes
  useEffect(() => {
    GetInterviewList();
  }, [firebaseUser]);

  return (
    <div className="w-full mt-10">
      <h2 className="font-bold text-xl mb-4">Interview List With Feedback</h2>

      {loading && (
        <p className="text-center text-gray-500 mt-4">Loading interviews...</p>
      )}

      {!loading && !interviewList.length && (
        <div className="p-5 mt-6 flex flex-col items-center gap-4 border rounded-md bg-white">
          <Video className="h-10 w-10 text-primary" />
          <p className="text-gray-700">No interviews scheduled yet.</p>
          <Button onClick={() => window.location.assign("/interview/create")}>
            Create New Interview
          </Button>
        </div>
      )}

      {!loading && interviewList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {interviewList.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onSaveFeedback={saveFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
