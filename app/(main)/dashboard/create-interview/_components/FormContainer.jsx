'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Clock, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [jobPosition, setJobPosition] = useState("");
  const [duration, setDuration] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // --- Set default interview type without frontend input ---
  useEffect(() => {
    const defaultType = "Technical"; // Change if needed
    onHandleInputChange("type", defaultType);
  }, []);

  return (
    <Card className="max-w-4xl mx-auto shadow-lg text-black bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">
          Let's find your next great hire!
        </CardTitle>
        <CardDescription className="pt-2">
          Start by telling us about the role you're looking to fill.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {/* --- Job Position --- */}
          <div>
            <label
              htmlFor="jobPosition"
              className="flex items-center text-md font-medium text-foreground mb-2"
            >
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              What role are you practicing for?
            </label>
            <Input
              id="jobPosition"
              placeholder="e.g., Senior Software Engineer"
              className="mt-1"
              value={jobPosition}
              onChange={(e) => {
                setJobPosition(e.target.value);
                onHandleInputChange("jobPosition", e.target.value);
              }}
            />
          </div>

          {/* --- Job Description --- */}
          <div>
            <label
              htmlFor="jobDescription"
              className="flex items-center text-md font-medium text-foreground mb-2"
            >
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Tell us about the position
            </label>
            <Textarea
              id="jobDescription"
              placeholder="e.g., Responsibilities: Develop and maintain web applications... Qualifications: 5+ years React, Node.js..."
              className="h-[150px] mt-1"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                onHandleInputChange("jobDescription", e.target.value);
              }}
            />
            <p className="text-sm text-muted-foreground mt-2 px-1">
              Provide a detailed job description. This will be used to generate
              realistic interview questions.
            </p>
          </div>

          {/* --- Duration --- */}
          <div>
            <label
              htmlFor="duration"
              className="flex items-center text-md font-medium text-foreground mb-2"
            >
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Interview Duration
            </label>
            <div className="relative">
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 45"
                className="mt-1 pr-16"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  onHandleInputChange("duration", e.target.value);
                }}
                min="1"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                minutes
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          onClick={GoToNext}
          disabled={
            !jobPosition.trim() ||
            !jobDescription.trim() ||
            !duration.trim()
          }
          className="bg-primary text-primary-foreground hover:bg-primary/80 font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:scale-100"
        >
          Generate Questions <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FormContainer;
