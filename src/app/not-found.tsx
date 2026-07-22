'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06091A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-8xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>
        <h2 className="text-xl font-bold text-[#E6E8E6] mb-2">Page not found</h2>
        <p className="text-[#A8A9AD] mb-8 font-inter">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold transition-colors"
          >
            <Home size={16} />
            Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1E3354] text-[#A8A9AD] hover:text-[#E6E8E6] hover:border-[#24476C] text-sm font-bold transition-all"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
