"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Firestore instance
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCcw, PlusCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InterviewCard from "./InterviewCard"; // Your card component

// Skeleton placeholder for loading
const InterviewSkeletonCard = () => (
  <div className="rounded-2xl p-6 bg-white border border-black shadow-lg">
    <div className="flex justify-between items-start">
      <div className="h-7 w-32 rounded-full bg-gray-200"></div>
      <div className="h-7 w-24 rounded-full bg-gray-200"></div>
    </div>
    <div className="my-7 space-y-4">
      <div className="h-5 w-40 rounded-full bg-gray-200"></div>
      <div className="h-4 w-48 rounded-full bg-gray-200"></div>
      <div className="h-4 w-36 rounded-full bg-gray-200"></div>
    </div>
    <div className="mt-auto pt-5 border-t border-black">
      <div className="flex gap-4">
        <div className="h-10 w-full rounded-lg bg-gray-200"></div>
        <div className="h-10 w-full rounded-lg bg-gray-200"></div>
      </div>
    </div>
  </div>
);

function LatestInterviewsList({ userEmail, darkMode = false }) {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch interviews from Firestore
  const fetchInterviews = async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "interview"),
        where("email", "==", userEmail),
        orderBy("created_at", "desc"),
        limit(6)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInterviewList(data);
    } catch (error) {
      toast.error("❌ Failed to fetch your interviews. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchInterviews();
  }, [userEmail]);

  const listVariant = {
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
    hidden: { opacity: 0 }
  };

  const itemVariant = {
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
    hidden: { opacity: 0, y: 30, scale: 0.95 }
  };

  return (
    <div className="my-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="font-bold text-3xl text-black">Recent Interviews</h2>
        {!loading && (
          <Button
            variant="outline"
            onClick={fetchInterviews}
            className="transition-all duration-300 bg-white border-black text-black hover:bg-gray-200 hover:text-black hover:border-black hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </motion.div>

      {/* Conditional Rendering */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <InterviewSkeletonCard key={i} />
            ))}
          </motion.div>
        ) : interviewList.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="p-12 mt-8 text-center border-2 border-dashed rounded-3xl border-black bg-white"
          >
            <Sparkles className="h-16 w-16 mx-auto mb-5 text-black" strokeWidth={1} />
            <h3 className="font-bold text-2xl mb-3 text-black">Start Your Interview Journey!</h3>
            <p className="text-md mb-8 text-black max-w-sm mx-auto">
              You haven't conducted any interviews yet. Create one now to get started with our AI-powered platform.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/create-interview")}
              className="bg-black hover:bg-gray-800 text-white font-semibold text-md py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Interview
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={listVariant}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {interviewList.map((interview) => (
              <motion.div key={interview.id} variants={itemVariant}>
                <InterviewCard interview={interview} darkMode={darkMode} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LatestInterviewsList;
