// page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion'; // For subtle animations

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <main className="landing-main">
      <motion.div
        className="landing-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="landing-title"
          variants={itemVariants}
        >
          Welcome to Our Admin Dashboard
        </motion.h1>
        <motion.p
          className="landing-paragraph"
          variants={itemVariants}
        >
          Streamline your e-commerce operations with ease.
        </motion.p>

        <motion.div
          className="landing-buttons-container"
          variants={itemVariants}
        >
          {/* Main call to action - for users who might be logged in or want to explore */}
          <Link
            href="/dashboard"
            className="landing-button primary"
          >
            Go to Dashboard
          </Link>

          {/* Unified link to the new authentication page */}
          <Link
            href="/login"
            className="landing-button secondary"
          >
            Login / Register
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}