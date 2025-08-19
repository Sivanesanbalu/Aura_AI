// File: app/practice-zone/dashboard/page.jsx (Corrected)
'use client';

import React from 'react';
import CreateOptions from './_components/CreateOptions'; // Adjust path if necessary
import LatestInterviewsList from './_components/LatestInterviewsList';
function PracticeZoneDashboard() {
  return (
    
    <div className="h-full w-full mt-10">

      {/* 1. Page Title */}
      <h2 className="text-3xl font-bold text-foreground mb-8 ">
        Practice Zone
      </h2>
      
      
      <CreateOptions />

     
      <LatestInterviewsList />
      
    </div>
  );
}

export default PracticeZoneDashboard;