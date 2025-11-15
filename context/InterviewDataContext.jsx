// context/InterviewDataContext.js
'use client';
import { createContext, useState } from "react";

export const InterviewDataContex = createContext(null);

export const InterviewDataProvider = ({ children }) => {
  const [interviewInfo, setInterviewInfo] = useState(null);

  return (
    <InterviewDataContex.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContex.Provider>
  );
};