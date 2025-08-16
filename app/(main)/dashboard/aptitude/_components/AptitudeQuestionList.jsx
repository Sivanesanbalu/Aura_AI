'use client';
import React from 'react';

export default function AptitudeQuestionList({ questions }) {
  return (
    <div className="mt-6 bg-white p-4 border rounded shadow space-y-4">
      <h3 className="text-xl font-bold text-center">Preview Questions</h3>
      {questions.map((q, idx) => (
        <div key={idx} className="p-2 border rounded">
          <p className="font-semibold">{idx + 1}. {q.question}</p>
          <ul className="list-disc ml-6 mt-2">
            {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
