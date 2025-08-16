'use client';
import React, { useState } from 'react';

export default function AptitudeFormContainer({ onGenerate, disabled }) {
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Aptitude Test Generator
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Customize your test below.
          </p>
        </div>
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            onGenerate({ difficulty, questionCount }); 
          }} 
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select 
                id="difficulty"
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="pt-4">
              <label htmlFor="question-count" className="block text-sm font-medium text-gray-700">
                Number of Questions
              </label>
              <input 
                id="question-count"
                type="number" 
                min="1" 
                max="20" 
                value={questionCount} 
                onChange={(e) => setQuestionCount(Number(e.target.value))} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={disabled} 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {disabled ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}