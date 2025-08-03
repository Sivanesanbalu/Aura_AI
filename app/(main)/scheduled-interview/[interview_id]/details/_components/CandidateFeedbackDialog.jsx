"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback?.feedback;
  const isRecommended = feedback?.Recommendation?.toLowerCase() !== "no";

  
  const totalScore =
    Math.round(
      (feedback?.rating?.technicalSkills +
        feedback?.rating?.communication +
        feedback?.rating?.problemSolving +
        feedback?.rating?.experience) / 4
    ) || 0;

  const handleWhatsAppRedirect = () => {
    const message = `Hi ${candidate?.userName || "Candidate"},\n\nHere’s your interview feedback:\n\n⭐ Total Score: ${totalScore}/10\n📌 Recommendation: ${feedback?.RecommendationMsg || "Not provided"}\n\nThank you for your time.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm text-primary">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          bg-white rounded-md p-6 
          max-w-[95vw] max-h-[95vh] 
          flex flex-col
        "
      >
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>

        {/* Scrollable content container */}
        <DialogDescription asChild>
          <div className="mt-5 overflow-auto flex-1 pr-2">
            {/* Header info */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="bg-blue-700 text-white font-bold p-3 rounded-full w-10 h-10 flex items-center justify-center">
                  {candidate?.userName?.[0]?.toUpperCase() || ""}
                </div>
                <div>
                  <h2 className="font-bold">{candidate?.userName || "Unknown"}</h2>
                  <h2 className="text-sm text-gray-700">
                    {candidate?.userEmail || "Not Available"}
                  </h2>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-4">
                <h2 className="text-primary text-2xl font-semibold">{totalScore}/10</h2>
              </div>
            </div>

            {/* Skills Assessment - Grey Box */}
            <div className="mt-5 bg-gray-100 p-5 rounded-md">
              <h2 className="font-bold">Skills Assessment</h2>
              <div className="mt-3 grid grid-cols-2 gap-10">
                <div>
                  <h2 className="flex justify-between">
                    Technical Skills
                    <span>{feedback?.rating?.technicalSkills || 0}/10</span>
                  </h2>
                  <Progress
                    value={(feedback?.rating?.technicalSkills || 0) * 10}
                    className="mt-1"
                  />
                </div>
                <div>
                  <h2 className="flex justify-between">
                    Communication
                    <span>{feedback?.rating?.communication || 0}/10</span>
                  </h2>
                  <Progress
                    value={(feedback?.rating?.communication || 0) * 10}
                    className="mt-1"
                  />
                </div>
                <div>
                  <h2 className="flex justify-between">
                    Problem Solving
                    <span>{feedback?.rating?.problemSolving || 0}/10</span>
                  </h2>
                  <Progress
                    value={(feedback?.rating?.problemSolving || 0) * 10}
                    className="mt-1"
                  />
                </div>
                <div>
                  <h2 className="flex justify-between">
                    Experience
                    <span>{feedback?.rating?.experience || 0}/10</span>
                  </h2>
                  <Progress
                    value={(feedback?.rating?.experience || 0) * 10}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Performance Summary - Grey Box */}
            <div className="mt-5 bg-gray-100 p-5 rounded-md">
              <h2 className="font-bold">Performance Summary</h2>
              <div className="p-5 bg-secondary rounded-md space-y-2">
                <p className="text-sm whitespace-pre-line">
                  {feedback?.summery || "No summary available."}
                </p>
              </div>
            </div>

            {/* Recommendation Section - Grey Box */}
            <div className="p-10 mt-10 flex items-center justify-between rounded-md bg-gray-200">
              <div>
                <h2 className="font-bold text-gray-700">Recommendation Message:</h2>
                <p className="p-5 rounded-md text-gray-500">
                  {feedback?.RecommendationMsg || "No recommendation provided."}
                </p>
              </div>
              <Button
                onClick={handleWhatsAppRedirect}
                className={isRecommended ? "bg-green-500" : "bg-red-700"}
              >
                Send Msg
              </Button>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
