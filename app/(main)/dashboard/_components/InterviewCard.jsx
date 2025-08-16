"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send, Clock, Users, CalendarDays, BrainCircuit, Code, Palette } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";


const getFieldStyle = (position) => {
    const pos = position.toLowerCase();

    if (pos.includes('ai') || pos.includes('python')) {
        return {
            Icon: BrainCircuit,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/30 hover:border-purple-500/60",
            ping: "bg-purple-400",
            button: "bg-purple-500 hover:bg-purple-600",
        };
    }
    if (pos.includes('frontend') || pos.includes('ui/ux')) {
        return {
            Icon: Palette,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/30 hover:border-cyan-500/60",
            ping: "bg-cyan-400",
            button: "bg-cyan-500 hover:bg-cyan-600",
        };
    }

    return {
        Icon: Code,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30 hover:border-blue-500/60",
        ping: "bg-blue-400",
        button: "bg-blue-500 hover:bg-blue-600",
    };
};

function InterviewCard({ interview, viewDetail = false, darkMode = true }) {

  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
  const interviewId = interview.interview_id || interview.id;
  const url = `${hostUrl}/interview/${interviewId}`;
  const candidateCount = interview["interview-feedback"]?.length || 0;

  const copyLink = async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(url); toast.success("✅ Link copied to clipboard!"); } catch (err) { toast.error("❌ Failed to copy link."); } };
  const sendLink = (e) => { e.stopPropagation(); const subject = encodeURIComponent("Your Interview Link for " + interview.jobPosition); const body = encodeURIComponent(`You have been invited to an AI-powered interview.\n\nPlease use the following link to proceed:\n${url}`); window.location.href = `mailto:?subject=${subject}&body=${body}`; };

  // Get the unique style for this card
  const fieldStyle = getFieldStyle(interview.jobPosition);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`
        flex flex-col rounded-2xl p-6 border transition-all duration-300 h-full group
        ${darkMode
          ? `bg-slate-900 border-slate-800 hover:bg-slate-800/90 ${fieldStyle.border}`
          : `bg-white border-slate-200 hover:shadow-xl ${fieldStyle.border}`
        }
      `}
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start">
        {/* Job Field Tag */}
        <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${fieldStyle.bg} ${fieldStyle.color}`}>
          <fieldStyle.Icon className="h-4 w-4" />
          <span>{interview.jobPosition}</span>
        </div>

        {/* Candidates Badge */}
        <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          <Users className="h-4 w-4" />
          <span>{candidateCount} Candidate{candidateCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* --- BODY (META INFO) --- */}
      <div className="flex-grow my-6 space-y-4">
        {/* Live Status Indicator */}
        <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${fieldStyle.ping} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${fieldStyle.ping}`}></span>
            </span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Interview is Live
            </span>
        </div>

        <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>Duration: {interview.duration}</span>
        </div>
        <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <CalendarDays className="h-4 w-4 flex-shrink-0" />
          <span>Created: {new Date(interview.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
        </div>
      </div>

      {/* --- FOOTER (ACTIONS) --- */}
      <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {viewDetail ? (
          <Link href={'/scheduled-interview/' + interview?.interview_id + "/details"} className="w-full">
            <Button className={`w-full group text-white ${fieldStyle.button}`}>
              View Detail <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className={`flex-1 flex items-center justify-center gap-2 transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
              onClick={copyLink}
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button
              className={`flex-1 flex items-center justify-center gap-2 text-white ${fieldStyle.button}`}
              onClick={sendLink}
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default InterviewCard;