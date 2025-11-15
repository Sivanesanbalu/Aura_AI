"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Code2Icon,
  BrainCircuit,
  User2Icon,
  ArrowRight,
} from "lucide-react";

const FixedInterviews = [
  {
    title: "Frontend Developer",
    description: "Simulate a realistic frontend coding interview experience.",
    icon: Code2Icon,
    path: "http://localhost:3000/interview/bcc29046-53f0-4b45-beb1-bac18985548b",
  },
  {
    title: "Backend Developer",
    description: "Evaluate your backend, API, and database design skills.",
    icon: BrainCircuit,
    path: "http://localhost:3000/interview/281936a8-e661-4e19-a3e1-3056f7b110bb",
  },
  {
    title: "Behavioral Interview",
    description: "Assess communication, collaboration, and leadership skills.",
    icon: User2Icon,
    path: "http://localhost:3000/interview/46de09d2-75a2-4a1f-81be-9a74a726cec2",
  },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#fafafa] via-[#f1f1f1] to-[#e7e9ec] dark:from-[#0b0b0b] dark:via-[#121212] dark:to-[#181818] text-foreground">

      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/10 blur-3xl pointer-events-none" />

      <section className="relative w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-24 gap-12 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6 max-w-2xl z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Create Your Own AI Interview
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Build intelligent, adaptive video interviews in seconds.<br />
            Whether you’re preparing for your next job or hiring top talent,<br />
            our AI interviewer adapts to your goals with real-time intelligence.
          </p>

          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 mt-4 rounded-xl shadow-md hover:shadow-primary/30 transition-all duration-300"
          >
            <Link href="/dashboard/create-interview">
              Start Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        {/* === RIGHT SIDE — IMAGE MOVED UP === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="flex-1 hidden md:flex items-center justify-center relative"
        >
          <img
            src="/s.jpg"
            alt="Hero Visual"
            className="absolute top-[-160px] right-10 md:right-28 object-contain z-30"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "520px",
              borderRadius: "20px",
            }}
          />

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[-150px] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/40 via-pink-400/30 to-cyan-400/30 blur-3xl opacity-70"
          ></motion.div>

          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-52 h-52 rounded-full bg-gradient-to-br from-primary/50 to-purple-600/50 blur-3xl opacity-60"
          ></motion.div>

          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-[700px] h-[700px] rounded-full border border-primary/20 blur-2xl"
          ></motion.div>
        </motion.div>
      </section>

      <section className="relative px-8 md:px-20 py-20 bg-gradient-to-t from-gray-100/40 to-transparent dark:from-[#101010]/50">
        <h2 className="text-4xl font-semibold mb-12 tracking-tight text-center">
          Or Choose a Prebuilt Template
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {FixedInterviews.map((interview, i) => {
            const Icon = interview.icon;
            return (
              <motion.div
                key={interview.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={interview.path}
                  className="group relative flex flex-col justify-between h-full rounded-3xl p-8 bg-white/80 dark:bg-[#111]/70 backdrop-blur-xl border border-border/40 hover:border-primary/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {interview.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {interview.description}
                    </p>
                  </div>

                  <ArrowRight className="w-6 h-6 mt-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
