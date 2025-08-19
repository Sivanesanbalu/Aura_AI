// app/dashboard/aptitude/page.jsx

'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck, AlertTriangle } from 'lucide-react'; // For icons
import AptitudeFormContainer from './_components/AptitudeFormContainer';
import AptitudeQuestionList from './_components/AptitudeQuestionList';

// API call function remains the same
const generateAptitudeQuestions = async ({ difficulty, questionCount }) => {
  const res = await fetch('/api/generate-aptitude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ difficulty, questionCount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
  return data;
};

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [fullLink, setFullLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef(null);

  const handleGenerate = async (params) => {
    setLoading(true);
    setError('');
    setQuestions([]);
    setFullLink('');
    try {
      const { interview_id, questions } = await generateAptitudeQuestions(params);
      setQuestions(questions);
      const newLink = `/dashboard/aptitude/preview/${interview_id}`;

      // Safely construct the full URL on the client-side
      if (typeof window !== 'undefined') {
        setFullLink(window.location.origin + newLink);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the results section when it appears
  useEffect(() => {
    if ((questions.length > 0 || error) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [questions, error]);

  const copyLink = () => {
    if (navigator.clipboard && fullLink) {
      navigator.clipboard.writeText(fullLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Aptitude Test Generator
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Create a custom aptitude test and share the link with candidates.
          </p>
        </header>

        {/* Main Content Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <AptitudeFormContainer onGenerate={handleGenerate} disabled={loading} />
        </div>

        {/* Results Section */}
        {(loading || error || questions.length > 0) && (
          <div ref={resultsRef} className="mt-10">
            {loading && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg">
                 <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
                 <p className="mt-4 text-lg font-semibold text-slate-700">Generating Questions</p>
                 <p className="text-slate-500">Please wait a moment...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-6 rounded-r-lg shadow-md flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Error Occurred</h3>
                    <p>{error}</p>
                </div>
              </div>
            )}

            {questions.length > 0 && !loading && (
              <div className="bg-white p-8 rounded-2xl shadow-lg space-y-8 animate-fade-in">
                {/* Generated Questions List */}
                <section>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Generated Questions</h2>
                  <AptitudeQuestionList questions={questions} />
                </section>
                
                {/* Shareable Link Section */}
                <section className="border-t border-slate-200 pt-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Shareable Link</h2>
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <input
                        type="text"
                        readOnly
                        value={fullLink}
                        className="w-full flex-1 bg-slate-100 border border-slate-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button onClick={copyLink} className="w-full sm:w-auto flex items-center justify-center" size="lg">
                      {copied ? (
                        <>
                          <ClipboardCheck className="mr-2 h-5 w-5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Clipboard className="mr-2 h-5 w-5" /> Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}