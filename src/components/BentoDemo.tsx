'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

function PDFDemo() {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setHighlighted((h) => !h), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 h-48">
      {/* Source document */}
      <div className="flex-1 bg-surface1/50 rounded-xl p-4 text-xs space-y-2 overflow-hidden">
        <div className="h-2 w-3/4 bg-subtext0/20 rounded" />
        <div className="h-2 w-full bg-subtext0/20 rounded" />
        <motion.div
          animate={{ backgroundColor: highlighted ? 'rgba(140, 170, 238, 0.3)' : 'rgba(165, 173, 206, 0.2)' }}
          className="h-2 w-5/6 rounded transition-colors"
        />
        <div className="h-2 w-full bg-subtext0/20 rounded" />
        <motion.div
          animate={{ backgroundColor: highlighted ? 'rgba(140, 170, 238, 0.3)' : 'rgba(165, 173, 206, 0.2)' }}
          className="h-2 w-2/3 rounded transition-colors"
        />
        <div className="h-2 w-4/5 bg-subtext0/20 rounded" />
      </div>

      {/* Summary panel */}
      <div className="flex-1 bg-accent-blue/10 rounded-xl p-4 border border-accent-blue/20">
        <div className="text-xs text-accent-blue font-medium mb-2">Sammendrag</div>
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-accent-blue/20 rounded" />
          <div className="h-2 w-4/5 bg-accent-blue/20 rounded" />
          <div className="h-2 w-3/4 bg-accent-blue/20 rounded" />
        </div>
      </div>
    </div>
  );
}

function ChatDemo() {
  const messages = [
    { role: 'user', text: 'Hva sier kapittel 3 om...' },
    { role: 'assistant', text: 'Ifølge s. 47: "..."', hasSource: true },
  ];

  return (
    <div className="space-y-3 h-48 flex flex-col justify-end">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.5 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
              msg.role === 'user'
                ? 'bg-accent-blue text-background'
                : 'bg-surface1/50 text-foreground'
            }`}
          >
            {msg.text}
            {msg.hasSource && (
              <span className="block text-xs mt-1 opacity-70">[Kilde: Kapittel 3]</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ExamDemo() {
  const { language } = useLanguage();
  const types = [
    { id: 'mcq', label: 'Flervalg', labelEn: 'Multiple Choice' },
    { id: 'short', label: 'Kort svar', labelEn: 'Short Answer' },
    { id: 'long', label: 'Langt svar', labelEn: 'Long Answer' },
  ];
  const [activeType, setActiveType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveType((t) => (t + 1) % types.length), 2500);
    return () => clearInterval(interval);
  }, [types.length]);

  return (
    <div className="h-48 flex flex-col">
      {/* Type toggles */}
      <div className="flex gap-2 mb-4">
        {types.map((type, i) => (
          <button
            key={type.id}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              i === activeType
                ? 'bg-accent-mauve text-background'
                : 'bg-surface1/50 text-subtext0'
            }`}
          >
            {language === 'no' ? type.label : type.labelEn}
          </button>
        ))}
      </div>

      {/* Question preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-1 bg-surface1/30 rounded-xl p-4"
        >
          <div className="text-sm text-foreground mb-3 typewriter-cursor">
            {activeType === 0 && (language === 'no' ? 'Hvilket alternativ beskriver...' : 'Which option describes...')}
            {activeType === 1 && (language === 'no' ? 'Forklar kort hva...' : 'Briefly explain what...')}
            {activeType === 2 && (language === 'no' ? 'Drøft sammenhengen mellom...' : 'Discuss the relationship between...')}
          </div>
          {activeType === 0 && (
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-subtext0/30" />
                  <div className="h-2 flex-1 bg-subtext0/20 rounded" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function BentoDemo() {
  const { t } = useLanguage();

  const demos = [
    {
      title: t('demo1Title'),
      description: t('demo1Description'),
      component: <PDFDemo />,
      span: 'md:col-span-2',
    },
    {
      title: t('demo2Title'),
      description: t('demo2Description'),
      component: <ChatDemo />,
      span: 'md:col-span-1',
    },
    {
      title: t('demo3Title'),
      description: t('demo3Description'),
      component: <ExamDemo />,
      span: 'md:col-span-3',
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
          {t('demosTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demos.map((demo, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`p-6 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-surface1 ${demo.span}`}
            >
              <h3 className="text-lg font-semibold mb-2">{demo.title}</h3>
              <p className="text-sm text-subtext0 mb-6">{demo.description}</p>
              {demo.component}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
