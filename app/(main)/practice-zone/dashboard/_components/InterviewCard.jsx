"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Copy,
  Send,
  Clock,
  Users,
  CalendarDays,
  Code,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
  // --- Constants and Event Handlers ---
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
  const interviewId = interview.interview_id || interview.id;
  const url = `${hostUrl}/interview/${interviewId}`;
  const candidateCount = interview["interview-feedback"]?.length || 0;

  // Copy interview link to clipboard
  const copyLink = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("✅ Link copied to clipboard!");
    } catch (err) {
      toast.error("❌ Failed to copy link.");
    }
  };

  // Open default email client with pre-filled link
  const sendLink = (e) => {
    e.stopPropagation();
    const subject = encodeURIComponent(
      "Your Interview Link for " + interview.jobPosition
    );
    const body = encodeURIComponent(
      `You have been invited to an AI-powered interview.\n\nPlease use the following link to proceed:\n${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="flex flex-col rounded-2xl p-6 border border-gray-300 bg-white h-full shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start">
        {/* Job Field Tag */}
        <div className="flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full bg-white border border-gray-300 text-black">
          <Code className="h-4 w-4" />
          <span>{interview.jobPosition}</span>
        </div>

        {/* Candidates Badge */}
        <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-white border border-gray-300 text-black">
          <Users className="h-4 w-4" />
          <span>
            {candidateCount} Candidate{candidateCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* --- BODY (META INFO) --- */}
      <div className="flex-grow my-6 space-y-4 text-black">
        {/* Live Status Indicator */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {/* Simple static circle instead of animated ping */}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold">Interview is Live</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>Duration: {interview.duration}</span>
        </div>

        {/* Creation Date */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CalendarDays className="h-4 w-4 flex-shrink-0" />
          <span>
            Created:{" "}
            {new Date(interview.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
      </div>

      {/* --- FOOTER (ACTIONS) --- */}
      <div className="mt-auto pt-4 border-t border-gray-300">
        {viewDetail ? (
          <Link
            href={"/scheduled-interview/" + interview?.interview_id + "/details"}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full bg-white text-black border-gray-300 hover:bg-gray-100"
            >
              View Detail <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 bg-white text-black border-gray-300 hover:bg-gray-100"
              onClick={copyLink}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-white text-black border-gray-300 hover:bg-gray-100"
              onClick={sendLink}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewCard;