"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react"; 

function WelcomeContainer() { 
  const { user } = useUser();
  const displayName = user?.fullName || user?.firstName || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}

      className="relative overflow-hidden rounded-2xl p-6 md:p-8 flex justify-between items-center mt-1 
                 border border-slate-200 dark:border-slate-800 
                 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50
                 shadow-xl shadow-slate-200/50 dark:shadow-black/20"
    >
      <Sparkles 

        className="absolute -top-8 -right-8 h-36 w-36 text-blue-100/80 dark:text-blue-500/10 transform rotate-12" 
      />

      <div className="z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
          Welcome Back, {displayName}!
        </h2>
        <p className="mt-1 text-md md:text-lg text-slate-600 dark:text-slate-400">
          AI-Driven Interviews, Hassle-Free Hiring.
        </p>
      </div>

      {user?.imageUrl && (

        <div 
          className="z-10 flex-shrink-0 p-1 border-2 border-slate-200 dark:border-slate-700 rounded-full ml-4"
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