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

  const [interviewType, setInterviewType] = useState(() =>
    InterviewType.map((type) => type.title)
  );

  const [jobPosition, setJobPosition] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    onHandleInputChange("type", interviewType);
  }, [interviewType]);

  return (
    <div className="p-8 bg-background dark:bg-background rounded-2xl shadow-lg max-w-4xl mx-auto my-10 border-2">
      <div className="text-center mb-8">
        
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Let's find your next great hire!</h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-2">Start by telling us about the role you're looking to fill.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="jobPosition" className="flex items-center text-md font-medium text-foreground dark:text-foreground mb-2">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            What role are you practicing for?
          </label>
          <Input
            id="jobPosition"
            placeholder="e.g., Senior Software Engineer"
            className="mt-1 block w-full border border-input dark:border-input dark:bg-background dark:text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary"
            value={jobPosition}
            onChange={(e) => {
              setJobPosition(e.target.value);
              onHandleInputChange("jobPosition", e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="flex items-center text-md font-medium text-foreground dark:text-foreground mb-2">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Tell us about the position.
          </label>
          <Textarea
            id="jobDescription"
            placeholder="Provide a detailed job description, including responsibilities and qualifications."
            className="h-[200px] mt-1 block w-full border border-input dark:border-input dark:bg-background dark:text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary"
            onChange={(event) =>
              onHandleInputChange("jobDescription", event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="duration" className="flex items-center text-md font-medium text-foreground dark:text-foreground mb-2">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            How long will the interview be?
          </label>
          <Select
            onValueChange={(value) => {
              setDuration(value);
              onHandleInputChange("duration", value);
            }}
            value={duration}
          >
            <SelectTrigger id="duration" className="w-full mt-1 border border-input dark:border-input dark:bg-background dark:text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Select a duration" />
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-background text-foreground dark:text-foreground border border-input dark:border-input">
              <SelectItem value="60">60 Minutes</SelectItem>
              <SelectItem value="90">90 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="flex items-center text-md font-medium text-foreground dark:text-foreground mb-2">
            <Type className="h-5 w-5 mr-2 text-primary" />
            What kind of interview is it?
          </h2>
          <div className="flex gap-3 flex-wrap mt-2">
            {InterviewType.map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-2 py-2 px-4 border border-input dark:border-input rounded-full bg-background dark:bg-background text-foreground dark:text-foreground"
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
          className="bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground hover:bg-primary/80 font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:scale-100"
        >
          Generate Questions <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
