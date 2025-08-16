"use client";

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/app/components/supabaseClient'; // Adjust path if needed
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone'; // Import react-dropzone
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [aiPersona, setAiPersona] = useState('bar_raiser');
  const [companyValues, setCompanyValues] = useState('');
  
  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error && error.code !== 'PGRST116') {
          toast.error('Could not load profile data.');
        } else if (data) {
          setFullName(data.full_name || '');
          setCompanyName(data.company_name || '');
          setCompanyLogoUrl(data.company_logo_url || '');
          setAiPersona(data.ai_persona || 'bar_raiser');
          setCompanyValues(data.company_values || '');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Function to save all settings
  const handleSaveChanges = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to save settings.");
      setSaving(false);
      return;
    }
    const updates = { id: user.id, full_name: fullName, company_name: companyName, ai_persona: aiPersona, company_values: companyValues, updated_at: new Date() };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      toast.error("Failed to save settings.");
    } else {
      toast.success("Settings saved successfully!");
    }
    setSaving(false);
  };

  // Memoized onDrop callback for react-dropzone
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      toast.error("No file selected or file type is not supported.");
      return;
    }

    setUploadingLogo(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Authentication error.");
      setUploadingLogo(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, file);
    if (uploadError) {
      toast.error("Failed to upload logo.");
      setUploadingLogo(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath);
    const { error: dbError } = await supabase.from('profiles').upsert({ id: user.id, company_logo_url: publicUrl });
    if (dbError) {
      toast.error("Could not save logo reference.");
    } else {
      setCompanyLogoUrl(publicUrl);
      toast.success("Logo updated successfully!");
    }
    setUploadingLogo(false);
  }, []);

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    multiple: false,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0E14]">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  // Common styling for form elements
  const inputStyles = "w-full bg-[#22242D] border border-gray-700 text-white placeholder:text-gray-500 rounded-lg p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300";

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
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input id="fullName" className={`md:col-span-2 ${inputStyles}`} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
              <Input id="companyName" className={`md:col-span-2 ${inputStyles}`} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Label className="text-gray-300 mt-2">Company Logo</Label>
              <div className="md:col-span-2 flex items-center gap-6">
                {/* Drag and Drop Component */}
                <div {...getRootProps()} className={`w-48 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-600 hover:border-gray-500'}`}>
                  <input {...getInputProps()} />
                  {uploadingLogo ? (
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  ) : (
                    <>
                      <UploadCloud className={`h-8 w-8 mb-2 ${isDragActive ? 'text-cyan-300' : 'text-gray-500'}`} />
                      <p className="text-xs text-gray-400">
                        {isDragActive ? "Drop the file here..." : "Drag 'n' drop or click"}
                      </p>
                    </>
                  )}
                </div>
                {/* Logo Preview */}
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
              <Label htmlFor="companyValues" className="text-gray-300">Company Core Values</Label>
              <Textarea id="companyValues" className={`md:col-span-2 min-h-[100px] ${inputStyles}`} placeholder="e.g., Customer Obsession, Innovation, Integrity" value={companyValues} onChange={(e) => setCompanyValues(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveChanges} disabled={saving || loading} className="px-8 py-6 text-base font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
            {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;