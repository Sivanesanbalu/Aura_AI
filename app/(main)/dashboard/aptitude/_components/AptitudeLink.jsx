'use client';
import React from 'react';

export default function AptitudeLink({ link }) {
  if (!link) return null;

  return (
    <div className="mt-4 flex justify-center">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-block 
          px-8 py-3 
          border border-transparent rounded-full 
          text-base font-medium text-white 
          bg-indigo-600 hover:bg-indigo-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
          transition-all duration-300 ease-in-out 
          transform hover:scale-105
        "
      >
        Take the Test
      </a>
    </div>
  );
}