"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-navy-dark via-brand-navy to-brand-navy-dark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Error Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 bg-brand-red-light/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-brand-red-light" />
          </div>
          <div className="absolute w-32 h-32 bg-brand-red-light/10 rounded-full blur-2xl" />
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Something Went Wrong
        </h1>
        <p className="text-lg text-white/60 mb-10">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-red-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-orange/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
