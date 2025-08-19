'use client';

import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function InterviewLink({ interview_id, formData, questionList }) {
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${interview_id}`;

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link Copied to Clipboard!');
    } catch (err) {
      toast.error('Failed to copy the link.');
      console.error('Failed to copy: ', err);
    }
  };

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Image
            src="/image.png"
            alt="Company Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-full shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800">Your AI Interview is Ready!</h1>
          <p className="text-md text-gray-500 mt-2">
            Share the link below with your candidates to begin the assessment.
          </p>
        </motion.div>

        {/* Interview Details Card */}
        {formData && (
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Details</h2>
            <div className="space-y-3">
              {formData.jobPosition && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <List className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium text-gray-800">{formData.jobPosition}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.date && (
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-800">{formData.date}</p>
                    </div>
                  </div>
                )}
                {formData.time && (
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Clock className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-800">{formData.time}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <List className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="font-medium text-gray-800">{questionList?.length ?? 0} Questions</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interview Link & Share Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900">Interview Link</h3>
            <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
              Valid for 30 Days
            </span>
          </div>

          {/* Modern Read-only Input with Copy Button */}
          <div className="flex items-center bg-gray-100 rounded-lg p-2 border border-gray-200">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCopyLink}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200"
            >
              <Copy size={16} />
              <span>Copy</span>
            </motion.button>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-md text-gray-800 mb-3">Share Via</h4>
            <div className="flex gap-4 flex-wrap">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={`mailto:?subject=Interview Link&body=${encodeURIComponent(url)}`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Mail size={16} /> Email
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={`https://wa.me/?text=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Share2 size={16} /> WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mt-8">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </motion.button>
          </Link>
          <Link href={`/interview/${interview_id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Connect to Interview</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InterviewLink;