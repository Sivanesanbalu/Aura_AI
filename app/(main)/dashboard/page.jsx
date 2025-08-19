// File: app/dashboard/page.jsx

"use client";

import React from "react";
import CreateOptions from "./_components/CreateOptions";
import { FixedInterviews } from "@/services/Constants";
import { FixedInterviewCard } from "./create-interview/_components/FixedInterviewCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, Calendar, BarChart } from "lucide-react";

function Dashboard() {
  return (
  
    <div className="space-y-12 mt-8">
     
      <h2 className="font-bold text-2xl text-foreground ">
        Dashboard
      </h2>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
        <Card className="rounded-2xl bg-white shadow-sm border dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <User className="w-5 h-5 text-blue-600" /> Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Total: <span className="font-semibold text-slate-800">245</span></p>
            <p className="text-gray-600">Shortlisted: <span className="font-semibold text-slate-800">87</span></p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white shadow-sm border dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <Briefcase className="w-5 h-5 text-green-600" /> Open Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Active: <span className="font-semibold text-slate-800">12</span></p>
            <p className="text-gray-600">Closed: <span className="font-semibold text-slate-800">5</span></p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white shadow-sm border dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <Calendar className="w-5 h-5 text-purple-600" /> Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">This Week: <span className="font-semibold text-slate-800">14</span></p>
            <p className="text-gray-600">Pending: <span className="font-semibold text-slate-800">6</span></p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white shadow-sm border dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <BarChart className="w-5 h-5 text-orange-600" /> Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Conversion Rate: <span className="font-semibold text-slate-800">68%</span></p>
            <p className="text-gray-600">Avg. Time to Hire: <span className="font-semibold text-slate-800">12d</span></p>
          </CardContent>
        </Card>
       

      </div>

      {/* --- Prebuilt Interviews Section --- */}
      <section>
        <h2 className="font-bold text-2xl mb-5 text-foreground">
          Start an Instant Interview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FixedInterviews.map((interview) => (
            <FixedInterviewCard
              key={interview.path}
              title={interview.title}
              description={interview.description}
              icon={interview.icon}
              path={interview.path}
            />
          ))}
        </div>
      </section>

      {/* New Interview Section*/}
      <CreateOptions />
      
    </div>
  );
}

export default Dashboard;