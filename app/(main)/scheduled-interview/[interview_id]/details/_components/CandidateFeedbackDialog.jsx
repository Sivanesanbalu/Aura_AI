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

  // Calculate total score dynamically
  const totalScore = Math.round(
    (feedback?.rating?.technicalSkills +
      feedback?.rating?.communication +
      feedback?.rating?.problemSolving +
      feedback?.rating?.experience) / 4
  ) || 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm text-primary">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="bg-blue-700 text-white font-bold p-3 rounded-full w-10 h-10 flex items-center justify-center">
                    {candidate?.userName?.[0]?.toUpperCase() || ""}
                  </div>
                  <div>
                    <h2 className="font-bold">{candidate?.userName || "Unknown"}</h2>
                    <h2 className="text-sm text-gray-500">
                      {candidate?.userEmail || "Not Available"}
                    </h2>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-4">
                  <h2 className="text-primary text-2xl font-semibold">
                    {totalScore}/10
                  </h2>
                </div>
              </div>

              {/* Skills Assessment */}
              <div className="mt-5">
                <h2 className="font-bold">Skills Assessment</h2>
                <div className="mt-3 grid grid-cols-2 gap-10">
                  <div>
                    <h2 className="flex justify-between">
                      Technical Skills
                      <span>{feedback?.rating?.technicalSkills || 0}/10</span>
                    </h2>
                    <Progress value={(feedback?.rating?.technicalSkills || 0) * 10} className="mt-1" />
                  </div>
                  <div>
                    <h2 className="flex justify-between">
                      Communication
                      <span>{feedback?.rating?.communication || 0}/10</span>
                    </h2>
                    <Progress value={(feedback?.rating?.communication || 0) * 10} className="mt-1" />
                  </div>
                  <div>
                    <h2 className="flex justify-between">
                      Problem Solving
                      <span>{feedback?.rating?.problemSolving || 0}/10</span>
                    </h2>
                    <Progress value={(feedback?.rating?.problemSolving || 0) * 10} className="mt-1" />
                  </div>
                  <div>
                    <h2 className="flex justify-between">
                      Experience
                      <span>{feedback?.rating?.experience || 0}/10</span>
                    </h2>
                    <Progress value={(feedback?.rating?.experience || 0) * 10} className="mt-1" />
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="mt-5">
                  <h2 className="font-bold">Performance Summary</h2>
                  <div className="p-5 bg-secondary rounded-md space-y-2">
                    <p className="text-sm whitespace-pre-line">
                      {feedback?.summery || "No summary available."}
                    </p>
                  </div>
                </div>

                {/* Recommendation Section */}
                <div
                  className={`p-10 mt-10 flex items-center justify-between rounded-md ${
                    isRecommended ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <div>
                    <h2 className={`font-bold ${isRecommended ? "text-green-700" : "text-red-700"}`}>
                      Recommendation Msg:
                    </h2>
                    <p className={`p-5 rounded-md ${isRecommended ? "text-green-500" : "text-red-500"}`}>
                      {feedback?.RecommendationMsg || "No recommendation provided."}
                    </p>
                  </div>
                  <Button className={isRecommended ? "bg-green-500" : "bg-red-700"}>Send Msg</Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
