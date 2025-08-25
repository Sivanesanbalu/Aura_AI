// File: app/profile/page.jsx
// This is the updated, professional version ready for your real application.
"use client";

import React, { useState, useEffect } from 'react';
import { useUser, UserProfile } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart, Bell, UserCog } from "lucide-react";
import { toast } from "sonner"; // Using a toast library for user feedback is recommended.

function RecruiterProfilePage() {
  const { user, isLoaded } = useUser();
  
  // --- State Management for Application-Specific Data ---
  const [performanceData, setPerformanceData] = useState(null); // Holds stats and jobs
  const [notificationSettings, setNotificationSettings] = useState({
    email: { newCandidate: true, aiMatchFound: true },
    inApp: { interviewReminder: true },
  });
  const [isSaving, setIsSaving] = useState(false);

  // --- Data Fetching Logic ---
  // This hook runs when the component loads to fetch data from your database.
  useEffect(() => {
    if (user) {
      // ** TODO: Replace the code below with a REAL API call to your backend. **
      // Example:
      // const fetchRecruiterData = async () => {
      //   const perfResponse = await fetch(`/api/recruiter/${user.id}/performance`);
      //   setPerformanceData(await perfResponse.json());
      //   const notifyResponse = await fetch(`/api/recruiter/${user.id}/notifications`);
      //   setNotificationSettings(await notifyResponse.json());
      // };
      // fetchRecruiterData();

      // For demonstration, we simulate fetching data with a delay.
      const timer = setTimeout(() => {
        setPerformanceData({
          candidatesProcessed: 124,
          avgTimeToFill: "28 days",
          successfulHires: 8,
          activeJobs: [
            { id: 1, title: "Senior Frontend Developer", candidates: 78 },
            { id: 2, title: "Backend Engineer (Python)", candidates: 112 },
          ],
        });
      }, 1200);

      return () => clearTimeout(timer); // Cleanup on component unmount
    }
  }, [user]); // Re-run if the user object changes

  // --- Action Handler to Save Settings ---
  const handleSaveChanges = async () => {
    setIsSaving(true);
    toast.info("Saving your notification settings...");

    // ** TODO: Replace this with a REAL API call to save settings to your database. **
    // Example:
    // await fetch(`/api/recruiter/${user.id}/notifications`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notificationSettings),
    // });
    
    // Simulating the save process
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1500);
  };
  
  // Show a main loading screen until Clerk has loaded the user.
  if (!isLoaded) {
    return <div className="p-8 text-center">Loading Account...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
          <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.fullName}</h1>
          <p className="text-muted-foreground">Manage your account and application settings.</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account"><UserCog className="w-4 h-4 mr-2"/>Account</TabsTrigger>
          <TabsTrigger value="performance"><BarChart className="w-4 h-4 mr-2"/>My Performance</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2"/>Notifications</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: Account Settings (Fully functional via Clerk) --- */}
        <TabsContent value="account" className="mt-6">
            <CardDescription className="mb-4">
              Update your personal information and manage your security settings. 
              Changes made here are handled by your secure account provider.
            </CardDescription>
            <UserProfile
              path="/profile"
              appearance={{ elements: { card: "shadow-none border", rootBox: "w-full" } }}
            />
        </TabsContent>

        {/* --- TAB 2: My Performance (Ready for real data) --- */}
        <TabsContent value="performance" className="mt-6">
          {!performanceData ? (
             <Card><CardContent className="p-6">Loading performance data...</CardContent></Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card><CardHeader><CardTitle className="text-sm font-medium">Candidates Processed</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{performanceData.candidatesProcessed}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Avg. Time to Fill</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{performanceData.avgTimeToFill}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Successful Hires</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{performanceData.successfulHires}</p></CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle>My Active Jobs</CardTitle></CardHeader>
                <CardContent>
                  {performanceData.activeJobs.map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                      <div><p className="font-semibold">{job.title}</p><p className="text-sm text-muted-foreground">{job.candidates} Candidates</p></div>
                      <Button variant="outline" size="sm">View Pipeline</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* --- TAB 3: Notifications (Fully interactive form) --- */}
        <TabsContent value="notifications" className="mt-6">
           <Card className="max-w-2xl mx-auto">
              <CardHeader><CardTitle>Notification Settings</CardTitle><CardDescription>Choose how you want to be notified.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <h3 className="font-semibold mb-3">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between"><Label htmlFor="email-new-candidate">When a new candidate applies</Label><Switch id="email-new-candidate" checked={notificationSettings.email.newCandidate} onCheckedChange={(isChecked) => setNotificationSettings(prev => ({...prev, email: {...prev.email, newCandidate: isChecked}}))}/></div>
                      <div className="flex items-center justify-between"><Label htmlFor="email-ai-match">When the AI finds a top-matched candidate</Label><Switch id="email-ai-match" checked={notificationSettings.email.aiMatchFound} onCheckedChange={(isChecked) => setNotificationSettings(prev => ({...prev, email: {...prev.email, aiMatchFound: isChecked}}))}/></div>
                    </div>
                 </div>
                 <hr/>
                 <div>
                    <h3 className="font-semibold mb-3">In-App Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between"><Label htmlFor="inapp-reminder">Upcoming interview reminder</Label><Switch id="inapp-reminder" checked={notificationSettings.inApp.interviewReminder} onCheckedChange={(isChecked) => setNotificationSettings(prev => ({...prev, inApp: {...prev.inApp, interviewReminder: isChecked}}))}/></div>
                    </div>
                 </div>
              </CardContent>
              <div className="p-6 pt-0 border-t mt-6 flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RecruiterProfilePage;