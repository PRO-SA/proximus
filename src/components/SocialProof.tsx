'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const logos = [
  { name: 'UiO', abbr: 'UiO' }
];

const quotes = [
  {
    text: {
      no: 'Endelig et AI-verktøy som forstår norsk pensum!',
      en: 'Finally an AI tool that understands Norwegian curriculum!',
    },
    author: 'Maria S.',
    role: { no: 'Medisinstudent, UiO', en: 'Medical student, UiO' },
  },
  {
    text: {
      no: 'Janus sparer meg timer med lesing hver uke.',
      en: 'Janus saves me hours of reading every week.',
    },
    author: 'Erik L.',
    role: { no: 'Jusstudent, UiB', en: 'Law student, UiB' },
  },
  {
    text: {
      no: 'Nynorsk-støtten er uvurderlig for min forskning.',
      en: 'The Nynorsk support is invaluable for my research.',
    },
    author: 'Ingrid K.',
    role: { no: 'PhD-kandidat, NTNU', en: 'PhD candidate, NTNU' },
  },
  {
    text: {
      no: 'Mine studenter kommer til å elske dette.',
      en: 'My students are going to love this.',
    },
    author: 'Prof. Anders H.',
    role: { no: 'Professor, UiT', en: 'Professor, UiT' },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SocialProof() {
  const { t, language } = useLanguage();

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
          {t('socialProofTitle')}
        </motion.h2>

        {/* University logos */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="w-24 h-24 rounded-2xl bg-surface0/50 backdrop-blur-sm flex items-center justify-center border border-surface1"
            >
              <span className="text-lg font-bold text-subtext0">{logo.abbr}</span>
            </div>
          ))}
        </motion.div>

        {/* Quotes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-6 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-surface1"
            >
              <p className="text-foreground mb-4 leading-relaxed">
                &ldquo;{quote.text[language]}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface1 flex items-center justify-center">
                  <span className="text-sm font-medium text-subtext0">
                    {quote.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{quote.author}</p>
                  <p className="text-xs text-subtext0">{quote.role[language]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
