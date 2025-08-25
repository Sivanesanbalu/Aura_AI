
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FixedInterviewCard({ title, description, icon: Icon, path }) {
  return (
    <Link href={path} passHref>
  <motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="group relative rounded-2xl p-8 min-h-[200px] min-w-[300px] border border-slate-200 bg-white hover:border-indigo-500 transition-colors duration-300 cursor-pointer shadow-md"
  >
    <div className="flex items-start gap-6">
      <div className="bg-indigo-100 p-4 rounded-xl">
        <Icon className="h-8 w-8 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-base text-slate-500 mt-2">{description}</p>
      </div>
    </div>
    <ArrowRight className="absolute top-5 right-5 h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
</Link>

  );
}
