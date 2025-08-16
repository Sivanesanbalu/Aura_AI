"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react"; 

function WelcomeContainer({ darkMode = true }) { 
  const { user } = useUser();

  const displayName = user?.fullName || user?.firstName || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`
        relative overflow-hidden rounded-2xl p-6 md:p-8 flex justify-between items-center mt-1 border
        ${darkMode 
          ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-lg shadow-slate-200/50'
        }
      `}
    >
      {/* Decorative background element */}
      <Sparkles 
        className={`
          absolute -top-4 -right-4 h-32 w-32 transform rotate-12 
          ${darkMode ? 'text-slate-700/80' : 'text-slate-100'}
        `} 
      />

      {/* Welcome text content */}
      <div className="z-10">
        <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Welcome Back, {displayName}!
        </h2>
        <p className={`mt-1 text-md md:text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          AI-Driven Interviews, Hassle-Free Hiring.
        </p>
      </div>

      {/* User avatar with a nice border effect */}
      {user?.imageUrl && (
        <div 
          className={`
            z-10 flex-shrink-0 p-1 rounded-full ml-4
            ${darkMode ? 'bg-white/10' : 'bg-slate-200/50'}
          `}
        >
          <Image
            src={user.imageUrl}
            alt={`${displayName}'s Avatar`}
            width={60} 
            height={60} 
            className="rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
}

export default WelcomeContainer;