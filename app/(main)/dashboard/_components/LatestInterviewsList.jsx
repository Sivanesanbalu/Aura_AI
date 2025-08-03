"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/app/components/supabaseClient";
import { Button } from "@/components/ui/button";
import { Video, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";
import { toast } from "sonner";

function LatestInterviewsList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("interview")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      toast.error("❌ Error fetching interviews.");
      console.error("Supabase error:", error);
    } else {
      setInterviewList(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchInterviews();
    }
  }, [user]);

  return (
    <div className="my-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Previously Created Interviews</h2>
        {!loading && (
          <Button variant="outline" onClick={fetchInterviews}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 rounded-lg animate-pulse p-4 space-y-3"
            >
              <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : interviewList.length === 0 ? (
        <div className="p-6 mt-6 text-center border rounded-md bg-white">
          <Video className="h-10 w-10 mx-auto text-primary mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Interviews Yet</h3>
          <p className="text-sm text-gray-600 mb-4">
            You haven’t created any interviews yet. Get started now.
          </p>
          <Button onClick={() => (window.location.href = "/interview/create")}>
            ➕ Create New Interview
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {interviewList.map((interview) => (
            <div
              key={interview.id}
              className="transition-transform hover:scale-[1.01] hover:shadow-md"
            >
              <InterviewCard interview={interview} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestInterviewsList;
