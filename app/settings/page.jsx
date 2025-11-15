"use client";

import React, { useEffect, useState, useCallback } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

function SettingsPage() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [aiPersona, setAiPersona] = useState("bar_raiser");
  const [companyValues, setCompanyValues] = useState("");

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!firebaseUser) return;
      setLoading(true);
      try {
        const docRef = doc(db, "profiles", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.full_name || "");
          setCompanyName(data.company_name || "");
          setCompanyLogoUrl(data.company_logo_url || "");
          setAiPersona(data.ai_persona || "bar_raiser");
          setCompanyValues(data.company_values || "");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [firebaseUser]);

  // Save profile data
  const handleSaveChanges = async () => {
    if (!firebaseUser) {
      toast.error("You must be logged in to save settings.");
      return;
    }
    setSaving(true);
    try {
      const docRef = doc(db, "profiles", firebaseUser.uid);
      await setDoc(
        docRef,
        {
          full_name: fullName,
          company_name: companyName,
          company_logo_url: companyLogoUrl,
          ai_persona: aiPersona,
          company_values: companyValues,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Upload logo to Firebase Storage
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!firebaseUser) {
        toast.error("Authentication error.");
        return;
      }
      const file = acceptedFiles[0];
      if (!file) {
        toast.error("No file selected or file type is not supported.");
        return;
      }

      setUploadingLogo(true);

      try {
        const fileExt = file.name.split(".").pop();
        const filePath = `logos/${firebaseUser.uid}/logo-${Date.now()}.${fileExt}`;
        const storageRef = ref(storage, filePath);

        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        // Update Firestore
        const docRef = doc(db, "profiles", firebaseUser.uid);
        await setDoc(docRef, { company_logo_url: downloadUrl, updated_at: serverTimestamp() }, { merge: true });

        setCompanyLogoUrl(downloadUrl);
        toast.success("Logo updated successfully!");
      } catch (err) {
        console.error("Error uploading logo:", err);
        toast.error("Failed to upload logo.");
      } finally {
        setUploadingLogo(false);
      }
    },
    [firebaseUser]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0E14]">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  const inputStyles =
    "w-full bg-[#22242D] border border-gray-700 text-white placeholder:text-gray-500 rounded-lg p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#0D0E14] text-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your profile, branding, and AI preferences.</p>
        </div>

        {/* Profile & Branding Section */}
        <Card className="bg-[#17181F] border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Profile & Branding</CardTitle>
            <CardDescription className="text-gray-400">Manage your personal and company information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="fullName" className="text-gray-300">
                Full Name
              </Label>
              <Input id="fullName" className={`md:col-span-2 ${inputStyles}`} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="companyName" className="text-gray-300">
                Company Name
              </Label>
              <Input id="companyName" className={`md:col-span-2 ${inputStyles}`} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Label className="text-gray-300 mt-2">Company Logo</Label>
              <div className="md:col-span-2 flex items-center gap-6">
                <div
                  {...getRootProps()}
                  className={`w-48 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors duration-300 ${
                    isDragActive ? "border-cyan-400 bg-cyan-900/30" : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  {uploadingLogo ? (
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  ) : (
                    <>
                      <UploadCloud className={`h-8 w-8 mb-2 ${isDragActive ? "text-cyan-300" : "text-gray-500"}`} />
                      <p className="text-xs text-gray-400">{isDragActive ? "Drop the file here..." : "Drag 'n' drop or click"}</p>
                    </>
                  )}
                </div>
                {companyLogoUrl && !uploadingLogo && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Current Logo</p>
                    <Image src={companyLogoUrl} alt="Company Logo" width={80} height={80} className="rounded-md bg-white p-1" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI & Interview Defaults Section */}
        <Card className="bg-[#17181F] border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">AI & Interview Defaults</CardTitle>
            <CardDescription className="text-gray-400">Customize the AI's behavior to fit your company culture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label className="text-gray-300">AI Interviewer Persona</Label>
              <div className="md:col-span-2">
                <Select value={aiPersona} onValueChange={setAiPersona}>
                  <SelectTrigger className={inputStyles}>
                    <SelectValue placeholder="Select a persona" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#22242D] border-gray-700 text-white">
                    <SelectItem value="bar_raiser">Strict FAANG "Bar Raiser"</SelectItem>
                    <SelectItem value="friendly_startup">Friendly & Encouraging</SelectItem>
                    <SelectItem value="formal_corporate">Formal & Direct Corporate</SelectItem>
                    <SelectItem value="technical_specialist">Technical & Deeply Focused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Label htmlFor="companyValues" className="text-gray-300">
                Company Core Values
              </Label>
              <Textarea
                id="companyValues"
                className={`md:col-span-2 min-h-[100px] ${inputStyles}`}
                placeholder="e.g., Customer Obsession, Innovation, Integrity"
                value={companyValues}
                onChange={(e) => setCompanyValues(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSaveChanges}
            disabled={saving || loading}
            className="px-8 py-6 text-base font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
