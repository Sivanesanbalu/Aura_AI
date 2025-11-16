"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";   // ⭐ Added
import { useAuth } from "@/context/AuthContext"; // 🔥 Firebase Auth Hook
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
import { BarChart, Bell, UserCog, ArrowLeft } from "lucide-react"; // ⭐ Added ArrowLeft icon
import { toast } from "sonner";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore"; // ⭐ Added setDoc

function RecruiterProfilePage() {
  const router = useRouter(); // ⭐ Added
  const { user, loading } = useAuth(); // 🔥 Firebase user

  const [performanceData, setPerformanceData] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: { newCandidate: true, aiMatchFound: true },
    inApp: { interviewReminder: true },
  });
  const [isSaving, setIsSaving] = useState(false);

  // ---------------------------
  // 🔥 Fetch data from Firestore
  // ---------------------------
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // --- Performance Data ---
          const perfRef = doc(db, "recruiterPerformance", user.uid);
          const perfSnap = await getDoc(perfRef);

          if (perfSnap.exists()) {
            setPerformanceData(perfSnap.data());
          } else {
            // fallback demo data
            setPerformanceData({
              candidatesProcessed: 124,
              avgTimeToFill: "28 days",
              successfulHires: 8,
              activeJobs: [
                { id: 1, title: "Senior Frontend Developer", candidates: 78 },
                { id: 2, title: "Backend Engineer (Python)", candidates: 112 },
              ],
            });
          }

          // --- Notifications ---
          const notifyRef = doc(db, "recruiterNotifications", user.uid);
          const notifySnap = await getDoc(notifyRef);

          if (notifySnap.exists()) {
            setNotificationSettings(notifySnap.data());
          }
        } catch (err) {
          console.error("Error loading Firestore:", err);
        }
      };

      fetchData();
    }
  }, [user]);

  // ---------------------------
  // 🔥 Save settings to Firestore
  // ---------------------------
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      toast.info("Saving your notification settings...");

      const notifyRef = doc(db, "recruiterNotifications", user.uid);
      await setDoc(notifyRef, notificationSettings);

      setTimeout(() => {
        setIsSaving(false);
        toast.success("Settings saved successfully!");
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Try again!");
      setIsSaving(false);
    }
  };

  // ---------------------------
  // 💠 Loading UI
  // ---------------------------
  if (loading || !user) {
    return <div className="p-8 text-center">Loading Account...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">

      {/* ⭐ BACK BUTTON ADDED HERE */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 mb-4"
        onClick={() => {
          if (window.history.length > 1) {
            router.back(); // go to previous page
          } else {
            router.push("/recruiter/dashboard"); // fallback dashboard
          }
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* --- Profile Header --- */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.photoURL} alt={user.displayName || ""} />
          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.displayName}</h1>
          <p className="text-muted-foreground">
            Manage your account and application settings.
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">
            <UserCog className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>

          <TabsTrigger value="performance">
            <BarChart className="w-4 h-4 mr-2" />
            My Performance
          </TabsTrigger>

          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* ACCOUNT TAB */}
        <TabsContent value="account" className="mt-6">
          <Card className="p-6 space-y-4 max-w-xl">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Manage your name, photo & account information.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.displayName}
              </p>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/account")}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERFORMANCE TAB */}
        <TabsContent value="performance" className="mt-6">
          {!performanceData ? (
            <Card>
              <CardContent className="p-6">
                Loading performance data...
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Candidates Processed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {performanceData.candidatesProcessed}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Avg. Time to Fill
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {performanceData.avgTimeToFill}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Successful Hires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {performanceData.successfulHires}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>My Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {performanceData.activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex justify-between items-center p-3 
                      hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.candidates} Candidates
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Pipeline
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose how you want to be notified.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="font-semibold mb-3">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>New Candidate Applies</Label>
                    <Switch
                      checked={notificationSettings.email.newCandidate}
                      onCheckedChange={(value) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, newCandidate: value },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>AI Found Top-Matched Candidate</Label>
                    <Switch
                      checked={notificationSettings.email.aiMatchFound}
                      onCheckedChange={(value) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, aiMatchFound: value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* In-App Notifications */}
              <div>
                <h3 className="font-semibold mb-3">In-App Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Upcoming Interview Reminder</Label>
                    <Switch
                      checked={notificationSettings.inApp.interviewReminder}
                      onCheckedChange={(value) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          inApp: { ...prev.inApp, interviewReminder: value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-0 border-t mt-6 flex justify-end">
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RecruiterProfilePage;
