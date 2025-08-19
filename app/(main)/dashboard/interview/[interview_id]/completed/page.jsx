'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, ArrowRight, FileText, User } from 'lucide-react'; // Using lucide-react for modern icons

export default function InterviewCompleted() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
  
    const animationTimer = setTimeout(() => setProgress(100), 100);

    
    const redirectTimer = setTimeout(() => {
      router.push('/dashboard');
    }, 8000); 

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header Section with Animated Icon */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
            <Check className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Submission Successful!
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-xl mx-auto">
            Your interview has been successfully submitted. We appreciate you taking the time.
          </p>
        </div>

        {/* "What Happens Next?" Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 text-center">What Happens Next?</h2>
          
          <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6">
            {/* Step 1: Review */}
            <div className="flex-1 text-center flex flex-col items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mb-3">
                <FileText size={24} />
              </div>
              <h3 className="font-semibold text-gray-800">1. We Review</h3>
              <p className="text-gray-500 text-sm mt-1">Our team will carefully review your responses within the next 3-5 business days.</p>
            </div>

            {/* Step 2: Update */}
            <div className="flex-1 text-center flex flex-col items-center">
              <div className="bg-purple-100 text-purple-600 rounded-full h-12 w-12 flex items-center justify-center mb-3">
                <User size={24} />
              </div>
              <h3 className="font-semibold text-gray-800">2. You Get an Update</h3>
              <p className="text-gray-500 text-sm mt-1">We'll contact you via email with the next steps, so please keep an eye on your inbox.</p>
            </div>
          </div>
        </div>

        {/* Call to Action & Redirect Progress */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="group inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-lg"
          >
            Go to Your Dashboard
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          <div className="mt-6 w-full max-w-sm mx-auto">
            <p className="text-sm text-gray-500 mb-2">Auto-redirecting in 8 seconds...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-[8000ms] ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}