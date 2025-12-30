'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { WaitlistForm } from './WaitlistForm';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto text-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface0/50 backdrop-blur-sm text-sm text-subtext1 border border-surface1">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Beta Q1 2025
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-accent-blue to-accent-mauve bg-clip-text text-transparent">
            {t('heroTitle')}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-subtext0 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div variants={itemVariants}>
          <WaitlistForm />
        </motion.div>
      </motion.div>
    </section>
  );
}
