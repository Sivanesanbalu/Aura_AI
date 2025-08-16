// File: app/dashboard/resume-analysis/page.jsx

"use client";

import { useState } from 'react';
import { Upload, FileText, Loader2, Bot, HelpCircle } from 'lucide-react';

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a resume file to upload.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze the resume.');
      }
      
      setAnalysisResult(result.analysis);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="mx-auto h-12 w-12 text-green-400" />
          <h1 className="text-3xl sm:text-4xl font-bold mt-4">AI Resume Analyzer</h1>
          <p className="text-slate-400 mt-2">Upload a resume to automatically generate tailored interview questions.</p>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <label htmlFor="resume-upload" className="block text-lg font-medium mb-2 text-slate-200">
              Upload Resume (.pdf, .docx)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 cursor-pointer"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-blue-600 rounded-md font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
            {file && <p className="text-sm text-slate-400 mt-3">Selected file: {file.name}</p>}
          </form>
        </div>

        {/* Error Message */}
        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-8 text-center">{error}</div>}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Generated Questions Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="flex items-center text-2xl font-bold text-slate-100 mb-4">
                <HelpCircle className="h-7 w-7 mr-3 text-green-400" />
                AI-Suggested Interview Questions
              </h2>
              {analysisResult.generatedQuestions && analysisResult.generatedQuestions.length > 0 ? (
                 <ul className="space-y-3 list-disc list-inside text-slate-300">
                    {analysisResult.generatedQuestions.map((q, index) => (
                      <li key={index}>{q}</li>
                    ))}
                  </ul>
              ) : (
                <p className="text-slate-400">The AI could not generate questions from this resume.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}