'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
export default function PreviewPage() {
  const { interview_id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/get-aptitude-questions?interview_id=${interview_id}`)

      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setQuestions(data.questions);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [interview_id]);

  const handleSelect = (idx, option) => {
    setAnswers((prev) => ({ ...prev, [idx]: option }));
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await fetch('/api/evaluate-aptitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview_id, answers }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setScore(data.score);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setFeedbackLoading(true);
    try {
      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview_id, feedback }),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setFeedbackSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (score !== null) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">
          Your Score: {score} / {questions.length}
        </h2>

        {!feedbackSubmitted ? (
          <>
            <textarea
              rows={4}
              placeholder="Please provide your feedback here..."
              className="mt-4 w-full border p-2 rounded"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={feedbackLoading}
            />
            <Button 
              onClick={handleFeedbackSubmit}
              disabled={feedbackLoading || !feedback.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </>
        ) : (
          <p className="mt-4 text-green-600">Thank you for your feedback!</p>
        )}

        <Button
          onClick={() => router.push('/aptitude')}
          className="mt-6 px-4 py-2 bg-gray-700 text-white rounded"
        >
          Take New Test
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Aptitude Test</h1>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-4 p-4 border rounded">
          <p className="font-semibold">
            {idx + 1}. {q.question}
          </p>
          {q.options.map((opt) => (
            <label key={opt} className="block mt-2 cursor-pointer">
              <input
                type="radio"
                name={`q${idx}`}
                value={opt}
                onChange={() => handleSelect(idx, opt)}
                checked={answers[idx] === opt}
                className="mr-2"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== questions.length || submitLoading}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {submitLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
