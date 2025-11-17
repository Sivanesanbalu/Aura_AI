'use client';

import React, { useEffect, useState } from 'react';
import { Loader2Icon, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Import AnimatePresence
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({ formData, interview_id }) {
  const { user } = useAuth(); // Firebase Auth
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false); // Track if interview is saved
  const [generatedId] = useState(interview_id || uuidv4()); // Generate ID once

  // Generate questions in backend when formData is ready
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      generateQuestionsInBackend();
    }
  }, [formData]);

  const generateQuestionsInBackend = async () => {
    setLoading(true);
    try {
      const userId = user?.uid || `unknown_user_${generatedId}`;

      // Backend generates and saves questions; frontend doesn't display them
      await axios.post('/api/ai-model', { ...formData, interview_id: generatedId, user_id: userId });
      console.log("Questions generated in backend for interview:", generatedId);
    } catch (error) {
      console.error("Backend generation error:", error);
      toast.error("Failed to generate questions in backend.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaving(true);
    try {
      const userId = user?.uid || `unknown_user_${generatedId}`;
      const userEmail = user?.email || `unknown_user_${generatedId}`;

      const interviewData = {
        user_id: userId,
        jobPosition: formData.jobPosition || "Untitled Position",
        jobDescription: formData.jobDescription || "",
        duration: formData.duration || "N/A",
        type: formData.type || "Technical",
        email: userEmail,
        interview_id: generatedId,
        createdAt: new Date().toISOString(),
      };

      // Save metadata in Firestore
      await setDoc(doc(db, "interviews", generatedId), interviewData, { merge: true });

      // Update user credits
      const userRef = doc(db, "users", userEmail);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentCredits = userSnap.data()?.credits || 0;
        const updatedCredits = Math.max(currentCredits - 1, 0);
        await updateDoc(userRef, { credits: updatedCredits });
      } else {
        await setDoc(userRef, { credits: 0 });
      }

      setSaved(true); // ✅ Mark as saved so "Connect" button shows
      toast.success("Interview saved successfully!");
    } catch (error) {
      console.error("Firestore error:", error);
      toast.error("Failed to save interview: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // --- MODIFICATIONS BELOW ---

  return (
    <div className="mt-4 flex flex-col items-center space-y-4">
      {/* Wrap the loading state in AnimatePresence for smooth fade in/out */}
      <AnimatePresence>
        {loading && (
          <motion.div
            // Use flex-col for a slightly cleaner layout
            className="flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animate the icon with both rotate and scale (pulse) */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{
                rotate: { repeat: Infinity, duration: 1, ease: 'linear' },
                scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
              }}
            >
              {/* Removed animate-spin, framer-motion handles it. Made icon bigger/colored for effect. */}
              <Loader2Icon className="w-8 h-8 text-blue-600" />
            </motion.div>
            
            {/* Add a subtle "breathing" animation to the text */}
            <motion.span
              className="text-gray-700"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              Generating Interview Questions...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* This logic remains the same, but won't overlap with the loader */}
      {!loading && !saved ? (
        <Button onClick={onFinish} disabled={saving}>
          {saving ? "Saving..." : "Save & Generate Interview"}
        </Button>
      ) : null}

      {!loading && saved ? (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href={`/interview/${generatedId}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Connect to Interview
            </Button>
          </Link>
        </motion.div>
      ) : null}
    </div>
  );
}

export default QuestionList;