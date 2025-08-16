"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/app/components/supabaseClient";
import { Button } from "@/components/ui/button";
import { Video, RefreshCcw, PlusCircle, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard"; // Assuming this is a well-styled component
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


const InterviewSkeletonCard = () => (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-700 animate-pulse shadow-2xl shadow-slate-950/50">
        <div className="flex justify-between items-start">
            <div className="h-7 w-32 rounded-full bg-slate-900"></div>
            <div className="h-7 w-24 rounded-full bg-slate-900"></div>
        </div>
        <div className="my-7 space-y-4">
            <div className="h-5 w-40 rounded-full bg-slate-900"></div>
            <div className="h-4 w-48 rounded-full bg-slate-900"></div>
            <div className="h-4 w-36 rounded-full bg-slate-900"></div>
        </div>
        <div className="mt-auto pt-5 border-t border-slate-900">
            <div className="flex gap-4">
                <div className="h-10 w-full rounded-lg bg-slate-900"></div>
                <div className="h-10 w-full rounded-lg bg-slate-900"></div>
            </div>
        </div>
    </div>
);


function LatestInterviewsList({ darkMode = true }) {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchInterviews = async () => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from("interview")
            .select("*")
            .eq("email", email)
            .order("created_at", { ascending: false })
            .limit(6);
        if (error) { throw error; }
        setInterviewList(data || []);
    } catch (error) {
        toast.error("❌ Failed to fetch your interviews. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
        fetchInterviews();
    }
  }, [user]);


  const listVariant = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    },
    hidden: { opacity: 0 }
  };

  const itemVariant = {
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } },
    hidden: { opacity: 0, y: 30, scale: 0.95 }
  };

  return (
    <div className="my-10">
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="font-bold text-3xl dark:text-slate-200">
          Recent Interviews
        </h2>
        {!loading && (
          <Button 
            variant="outline" 
            onClick={fetchInterviews}
            className="transition-all duration-300 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </motion.div>

      {/* --- CONDITIONAL RENDERING --- */}
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
            className="p-12 mt-8 text-center border-2 border-dashed rounded-3xl border-slate-700 bg-slate-800/20"
          >
             <Sparkles className="h-16 w-16 mx-auto mb-5 text-yellow-400" strokeWidth={1}/>
            <h3 className="font-bold text-2xl mb-3 text-white">
              Start Your Interview Journey!
            </h3>
            <p className="text-md mb-8 text-slate-400 max-w-sm mx-auto">
              You haven't conducted any interviews yet. Create one now to get started with our AI-powered platform.
            </p>
            <Button 
              onClick={() => (window.location.href = "/dashboard/create-interview")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-md py-3 px-6 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1"
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
                <InterviewCard interview={interview} darkMode={darkMode}/>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LatestInterviewsList;