'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: t('step1Title'),
      description: t('step1Description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: t('step2Title'),
      description: t('step2Description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: t('step3Title'),
      description: t('step3Description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-bold text-center mb-16"
        >
          {t('howItWorksTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const isElectric = i === 2;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`relative p-8 rounded-3xl backdrop-blur-sm border group transition-all duration-300 ${
                  isElectric
                    ? 'bg-gradient-to-br from-accent-yellow/10 via-frappe-peach/10 to-accent-yellow/5 border-accent-yellow/40 hover:border-accent-yellow/60 hover:shadow-[0_0_30px_rgba(229,200,144,0.15)] electric-box'
                    : 'bg-surface0/30 border-surface1 hover:border-accent-blue/30'
                }`}
              >
                {isElectric && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/5 to-transparent animate-pulse" />
                  </div>
                )}

                <div className={`absolute top-6 right-6 text-4xl font-bold transition-colors ${
                  isElectric
                    ? 'text-accent-yellow/30 group-hover:text-accent-yellow/50'
                    : 'text-surface1 group-hover:text-surface2'
                }`}>
                  {step.number}
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  isElectric
                    ? 'bg-accent-yellow/20 text-accent-yellow'
                    : 'bg-accent-blue/10 text-accent-blue'
                }`}>
                  {step.icon}
                </div>

                <h3 className={`text-xl font-semibold mb-3 ${
                  isElectric ? 'text-accent-yellow' : ''
                }`}>{step.title}</h3>
                <p className="text-subtext0 leading-relaxed">{step.description}</p>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-surface1" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
