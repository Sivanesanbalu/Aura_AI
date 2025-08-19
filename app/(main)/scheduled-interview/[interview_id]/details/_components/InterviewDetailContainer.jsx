"use client";

import React from "react";
import { Clock, Calendar } from "lucide-react";
import moment from "moment";

function InterviewDetailContainer({ interviewDetail }) {
  if (!interviewDetail) return null;

  return (
    <div className="p-5 bg-white rounded-lg mt-5">
      
      <h2 className="text-2xl font-bold mb-3">{interviewDetail?.jobPosition}</h2>

      
      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
       
        {interviewDetail?.type && (
          <div>
            <h2 className="text-sm text-gray-500">Type</h2>
            <h2 className="flex text-sm font-bold items-center gap-2">
              <Clock className="h-4 w-4" /> {interviewDetail.type}
            </h2>
          </div>  
        )}

        
        {interviewDetail?.duration && (
          <div>
            <h2 className="text-sm text-gray-500">Duration</h2>
            <h2 className="flex text-sm font-bold items-center gap-2">
              <Clock className="h-4 w-4" /> {interviewDetail.duration} mins
            </h2>
          </div>
        )}

        {/* Created Date */}
        {interviewDetail?.created_at && (
          <div>
            <h2 className="text-sm text-gray-500">Created On</h2>
            <h2 className="flex text-sm font-bold items-center gap-2">
              <Calendar className="h-4 w-4" />
              {moment(interviewDetail.created_at).format("MMM DD, YYYY")}
            </h2>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="mt-5">
        <h2 className="font-bold">Job Description</h2>
        <p className="text-sm leading-6 text-gray-700">
          {interviewDetail?.jobDescription}
        </p>
      </div>

      {/* Interview Questions */}
      <div className="mt-5">
        <h2 className="font-bold">Interview Questions</h2>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {interviewDetail?.questionList?.map((item, index) => (
            <h2 key={index} className="text-xs flex">
              {index + 1}. {item?.question}
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterviewDetailContainer;
