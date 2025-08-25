"use client";

import React from "react";
import Link from "next/link"; // Added for functional links
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Briefcase,
  Calendar,
  BarChart,
  Video,
  Phone,
  Code2Icon,
  BrainCircuit,
  User2Icon,
} from "lucide-react";

// Data provided for the "Instant Interview" tab
const FixedInterviews = [
  {
    title: "Frontend Developer",
    description: "A ready-to-go interview for frontend roles. Click to start.",
    icon: Code2Icon,
    path: "http://localhost:3000/interview/bcc29046-53f0-4b45-beb1-bac18985548b",
  },
  {
    title: "Electronics Engineer",
    description:
      "An instant interview for backend positions, ready for candidates.",
    icon: BrainCircuit,
    path: "http://localhost:3000/interview/281936a8-e661-4e19-a3e1-3056f7b110bb",
  },
  {
    title: "AI Developer",
    description:
      "A general interview for assessing teamwork and communication skills.",
    icon: User2Icon,
    path: "http://localhost:3000/interview/46de09d2-75a2-4a1f-81be-9a74a726cec2",
  },
];

function Dashboard() {
  return (
    <div className="space-y-12 mt-8">
      {/* Dashboard Header */}
      <div>
        <h2 className="font-bold text-3xl text-foreground tracking-tight">
          Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          A quick overview of candidates, jobs, and interviews.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-500" />
              Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Total: <span className="font-semibold text-foreground">245</span>
            </p>
            <p className="text-muted-foreground">
              Shortlisted:{" "}
              <span className="font-semibold text-foreground">87</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="w-5 h-5 text-green-500" />
              Open Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Active: <span className="font-semibold text-foreground">12</span>
            </p>
            <p className="text-muted-foreground">
              Closed: <span className="font-semibold text-foreground">5</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
              Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This Week:{" "}
              <span className="font-semibold text-foreground">14</span>
            </p>
            <p className="text-muted-foreground">
              Pending: <span className="font-semibold text-foreground">6</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart className="w-5 h-5 text-orange-500" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Conversion Rate:{" "}
              <span className="font-semibold text-foreground">68%</span>
            </p>
            <p className="text-muted-foreground">
              Avg. Time to Hire:{" "}
              <span className="font-semibold text-foreground">12d</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interviews Toggle Section */}
      <section>
        <h2 className="font-bold text-2xl mb-5 text-foreground">Interviews</h2>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fixed">Start an Instant Interview</TabsTrigger>
            <TabsTrigger value="create">Create a New Interview</TabsTrigger>
          </TabsList>

          {/* This section remains unchanged as requested */}
          <TabsContent value="fixed" className="mt-6">
            {FixedInterviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FixedInterviews.map((interview) => {
                  const IconComponent = interview.icon;
                  return (
                    <a href={interview.path} key={interview.path}>
                      <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition cursor-pointer h-full">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <IconComponent className="w-6 h-6 text-slate-800 dark:text-slate-200" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-foreground">
                              {interview.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {interview.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                No instant interviews available. Switch to "Create a New
                Interview".
              </p>
            )}
          </TabsContent>

          {/* === THIS SECTION IS UPDATED === */}
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create New Interview Card */}
              <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Video className="w-6 h-6 text-slate-800 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Create New Interview
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Design and schedule AI-powered video interviews for
                        candidates.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6 pt-0">
                  {/* UPDATE: Link is now functional */}
                  <Link href="/dashboard/create-interview" legacyBehavior>
                    <a className="font-semibold text-sm text-foreground cursor-pointer hover:underline">
                      Get Started →
                    </a>
                  </Link>
                </div>
              </Card>

              {/* Mock Aptitude Test Card */}
              <Card className="rounded-2xl shadow-md border dark:border-slate-800 hover:shadow-lg transition flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Phone className="w-6 h-6 text-slate-800 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Mock Aptitude Test
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate and assign mock aptitude tests to evaluate
                        candidates.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6 pt-0">
                  {/* UPDATE: Link is now functional */}
                  <Link href="/dashboard/aptitude" legacyBehavior>
                    <a className="font-semibold text-sm text-foreground cursor-pointer hover:underline">
                      Get Started →
                    </a>
                  </Link>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

export default Dashboard;