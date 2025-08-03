"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import CandidateFeedbackDialog from './CandidateFeedbackDialog'
function CandidaList({ candidateList }) {
  return (
    <div>
      <h2 className="font-bold my-5">Candidates ({candidateList?.length || 0})</h2>

      {candidateList?.map((candidate, index) => (
        <div
          key={index}
          className="p-5 flex items-center justify-between bg-white rounded-lg mb-4"
        >
          {/* Left section: Avatar + Info */}
          <div className="flex gap-3 items-center">
            <div className="bg-blue-700 text-white font-bold p-3 rounded-full w-10 h-10 flex items-center justify-center">
              {candidate.userName?.[0]?.toUpperCase() || ""}
            </div>

            <div>
              <h2 className="font-bold">{candidate?.userName || "Unknown"}</h2>
              <h2 className="text-sm text-gray-500">
                Completed On:{" "}
                {candidate?.created_at
                  ? moment(candidate.created_at).format("MMM DD, YYYY")
                  : "N/A"}
              </h2>
            </div>
          </div>

          {/* Right section: Score + Button */}
          <div className="flex items-center gap-4">
            <h2 className="text-green-600 font-semibold text-sm"></h2>
            
            <CandidateFeedbackDialog candidate={candidate}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidaList;
