'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Clock, FileText, Type } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [interviewType, setInterviewType] = useState([]);
  const [jobPosition, setJobPosition] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    onHandleInputChange("type", interviewType);
  }, [interviewType]);

  const AddInterviewType = (type) => {
    const exists = interviewType.includes(type);
    if (!exists) {
      setInterviewType((prev) => [...prev, type]);
    } else {
      const updated = interviewType.filter((item) => item !== type);
      setInterviewType(updated);
    }
  };

  return (
    <div className="p-8 bg-gray-50 rounded-2xl shadow-lg max-w-4xl mx-auto my-10">
      <div className="text-center mb-8">
        {/* Corrected image path */}
        <img src="/logo.png" alt="AuraAI" className="h-19 mx-auto mb-9" />
        <h1 className="text-3xl font-bold text-gray-800">Let's find your next great hire!</h1>
        <p className="text-gray-600 mt-2">Start by telling us about the role you're looking to fill.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="jobPosition" className="flex items-center text-md font-medium text-gray-700 mb-2">
            <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
            What role are you hiring for?
          </label>
          <Input
            id="jobPosition"
            placeholder="e.g., Senior Software Engineer"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={jobPosition}
            onChange={(e) => {
              setJobPosition(e.target.value);
              onHandleInputChange("jobPosition", e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="flex items-center text-md font-medium text-gray-700 mb-2">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Tell us about the position.
          </label>
          <Textarea
            id="jobDescription"
            placeholder="Provide a detailed job description, including responsibilities and qualifications."
            className="h-[200px] mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            onChange={(event) =>
              onHandleInputChange("jobDescription", event.target.value)
            }
          />
        </div>

        {/* This div now only contains the duration selector */}
        <div>
          <label htmlFor="duration" className="flex items-center text-md font-medium text-gray-700 mb-2">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            How long will the interview be?
          </label>
          <Select
            onValueChange={(value) => {
              setDuration(value);
              onHandleInputChange("duration", value);
            }}
            value={duration}
          >
            <SelectTrigger id="duration" className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select a duration" />
            </SelectTrigger>
            <SelectContent>
              
              <SelectItem value="60 ">60 Minutes</SelectItem>
              <SelectItem value="90 ">90 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* The interview type section is moved here, outside the grid */}
        <div>
          <h2 className="flex items-center text-md font-medium text-gray-700 mb-2">
            <Type className="h-5 w-5 mr-2 text-blue-500" />
            What kind of interview is it?
          </h2>
          <div className="flex gap-3 flex-wrap mt-2">
            {InterviewType.map((type, index) => (
              <div
                key={index}
                className={`flex items-center cursor-pointer gap-2 py-2 px-4 border rounded-full transition-colors ${
                  interviewType.includes(type.title)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                }`}
                onClick={() => AddInterviewType(type.title)}
              >
                <type.icon className="h-4 w-4" />
                <span>{type.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button
          onClick={GoToNext}
          disabled={!jobPosition.trim() || !duration || interviewType.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:shadow-none disabled:scale-100"
        >
          Generate Questions <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;