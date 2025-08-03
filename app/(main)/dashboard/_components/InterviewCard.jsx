"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
  const interviewId = interview.interview_id || interview.id;
  const url = `${hostUrl}/interview/${interviewId}`;
  const candidateCount = interview["interview-feedback"]?.length || 0;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("✅ Link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("❌ Failed to copy link.");
    }
  };

  const sendLink = () => {
    const subject = encodeURIComponent("Your Interview Link");
    const body = encodeURIComponent(`Here is your interview link: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition w-full">
      {/* Top row: blue dot + date */}
      <div className="flex justify-between items-center text-sm text-gray-600 font-medium mt-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600" />
          <p>
            {new Date(interview.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Job title */}
      <h3 className="text-lg font-semibold text-gray-900 mt-4">
        {interview.jobPosition}
      </h3>

      {/* Duration and Candidate Count Row */}
      <div className="mt-3 flex justify-between text-sm text-gray-700">
        <p>{interview.duration}</p>
        <p className="text-green-600 font-semibold">
          {candidateCount} Candidate{candidateCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Buttons */}
      {viewDetail ? (
        <Link href={'/scheduled-interview/' + interview?.interview_id + "/details"}>
          <Button className="mt-5 w-full" variant="outline">
            View Detail <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <div className="flex gap-4 mt-5">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={copyLink}
            aria-label="Copy interview link"
          >
            <Copy className="w-5 h-5" />
            Copy Link
          </Button>
          <Button
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={sendLink}
            aria-label="Send interview link"
          >
            <Send className="w-5 h-5" />
            Send
          </Button>
        </div>
      )}
    </div>
  );
}

export default InterviewCard;
