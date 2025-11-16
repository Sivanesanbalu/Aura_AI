"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code2Icon, BrainCircuit, User2Icon, ArrowRight } from "lucide-react";

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
    <div className="snap-y snap-mandatory h-screen overflow-scroll w-full bg-gradient-to-br from-[#fafafa] via-[#f1f1f1] to-[#e7e9ec] dark:from-[#0b0b0b] dark:via-[#121212] dark:to-[#181818] text-foreground">

      {/* =================== SECTION 1 — HERO =================== */}
      <section className="snap-start h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-20 gap-12 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/10 blur-3xl pointer-events-none" />

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
            Build intelligent, adaptive video interviews in seconds.
            <br />
            Whether you’re preparing for your next job or hiring top talent,
            <br />
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
            animate={{ scale: [1, 1.05, 1], rotate: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-150px] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/40 via-pink-400/30 to-cyan-400/30 blur-3xl opacity-70"
          ></motion.div>

          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-52 h-52 rounded-full bg-gradient-to-br from-primary/50 to-purple-600/50 blur-3xl opacity-60"
          ></motion.div>

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[700px] h-[700px] rounded-full border border-primary/20 blur-2xl"
          ></motion.div>
        </motion.div>
      </section>

      {/* =================== SECTION 2 — TEMPLATES =================== */}
      <section className="snap-start h-screen px-8 md:px-20 py-20 flex flex-col justify-center">
        <h2 className="text-4xl font-semibold mb-12 tracking-tight text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Or Choose a Prebuilt Template
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                  className="group relative flex flex-col justify-between min-h-[330px] rounded-3xl p-14 bg-white/80 dark:bg-[#111]/70 backdrop-blur-xl border border-border/40 hover:border-primary/70 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div>
                    <div className="p-4 bg-primary/10 rounded-xl w-fit mb-6">
                      <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{interview.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {interview.description}
                    </p>
                  </div>

                  <ArrowRight className="w-7 h-7 mt-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =================== SECTION 3 — OUR COMPANY =================== */}
      <section className="snap-start h-screen px-8 md:px-20 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
              Why Choose Our AI Platform?
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mb-10">
              We are building the world’s most intelligent AI interview system.
              So you get faster decisions, fair evaluation and smart
              suggestions powered by cutting-edge technology.
            </p>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#111]/70 shadow-md hover:shadow-xl border border-border/40 backdrop-blur-xl transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">
                  ⚡ AI-Powered Evaluation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our system analyzes skills, communication, and logic
                  using advanced AI models for pinpoint accuracy.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#111]/70 shadow-md hover:shadow-xl border border-border/40 backdrop-blur-xl transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">
                  📈 Real-Time Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Instant feedback reports, scoring, analytics, improvement
                  suggestions and candidate insights.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#111]/70 shadow-md hover:shadow-xl border border-border/40 backdrop-blur-xl transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">
                  🤝 Trusted by Teams
                </h3>
                <p className="text-sm text-muted-foreground">
                  Companies depend on our platform for unbiased,
                  scalable, professional hiring workflows.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src="/ai.jpg"
              alt="AI Team"
              className="rounded-3xl shadow-2xl w-[600px] max-w-xl md:w-[650px] md:max-w-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* =================== SECTION 4 — START AGAIN =================== */}
      <section className="snap-start h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl text-center bg-white/70 dark:bg-[#111]/60 backdrop-blur-xl
                     rounded-3xl p-12 shadow-2xl border border-border/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-400/20 blur-3xl"></div>

          <h2 className="text-4xl font-extrabold mb-4 relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Ready to Start a New Interview?
          </h2>

          <p className="text-muted-foreground mb-8 text-lg relative z-10">
            Create a fresh AI-powered interview with a single click.
          </p>

          <Button
            size="lg"
            asChild
            className="px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-primary/40 transition-all relative z-10"
          >
            <Link href="/dashboard/create-interview">
              Start Again <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute w-40 h-40 bg-primary/30 blur-3xl rounded-full -top-10 -right-10"
          ></motion.div>
        </motion.div>
      </section>

    </div>
  );
}
