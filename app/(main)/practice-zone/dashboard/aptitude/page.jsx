'use client';
import React, { useState, useRef, useEffect } from 'react';
import AptitudeFormContainer from './_components/AptitudeFormContainer';
import { useRouter } from 'next/navigation';
import AptitudeQuestionList from './_components/AptitudeQuestionList';
import AptitudeLink from './_components/AptitudeLink';
import { Button } from "@/components/ui/button"
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
  const [link, setLink] = useState('');
  const [fullLink, setFullLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const questionsRef = useRef(null);

  const handleGenerate = async (params) => {
    setLoading(true);
    setError('');
    setQuestions([]);
    setLink('');
    setFullLink('');
    try {
      const { interview_id, questions } = await generateAptitudeQuestions(params);
      setQuestions(questions);
      const newLink = `/dashboard/aptitude/preview/${interview_id}`;
      setLink(newLink);

      // Safe usage inside client
      if (typeof window !== 'undefined') {
        setFullLink(window.location.origin + newLink);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length && questionsRef.current) {
      questionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [questions]);

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && fullLink) {
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <AptitudeFormContainer onGenerate={handleGenerate} disabled={loading} />

      {loading && <p className="mt-4 text-blue-600">Generating questions…</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {questions.length > 0 && (
        <>
          <div ref={questionsRef}>
            <AptitudeQuestionList questions={questions} />
          </div>
          <div className="mt-4 flex space-x-2">
            <AptitudeLink link={fullLink} />
            <Button
              onClick={copyLink}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
