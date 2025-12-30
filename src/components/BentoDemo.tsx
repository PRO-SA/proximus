'use client';

import { useState, useEffect, useRef } from 'react';
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
  const { language } = useLanguage();
  const [stage, setStage] = useState<'upload' | 'processing' | 'streaming'>('upload');
  const [streamedText, setStreamedText] = useState('');
  const streamRef = useRef<NodeJS.Timeout | null>(null);

  const summaryText = language === 'no'
    ? 'Big O-notasjon beskriver algoritmers tidskompleksitet. O(1) er konstant tid, O(n) er lineær, og O(n²) er kvadratisk. For sortering er QuickSort gjennomsnittlig O(n log n), mens BubbleSort er O(n²)...'
    : 'Big O notation describes algorithm time complexity. O(1) is constant time, O(n) is linear, and O(n²) is quadratic. For sorting, QuickSort averages O(n log n), while BubbleSort is O(n²)...';

  useEffect(() => {
    const cycleDemo = () => {
      setStage('upload');
      setStreamedText('');

      setTimeout(() => setStage('processing'), 1500);
      setTimeout(() => {
        setStage('streaming');
        let index = 0;
        streamRef.current = setInterval(() => {
          if (index < summaryText.length) {
            setStreamedText(summaryText.slice(0, index + 1));
            index++;
          } else {
            if (streamRef.current) clearInterval(streamRef.current);
          }
        }, 30);
      }, 2500);
    };

    cycleDemo();
    const mainInterval = setInterval(cycleDemo, 10000);

    return () => {
      clearInterval(mainInterval);
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, [summaryText]);

  return (
    <div className="flex gap-4 h-52">
      {/* PDF Upload Area */}
      <div className="w-32 flex-shrink-0 bg-surface1/50 rounded-xl p-3 flex flex-col items-center justify-center border-2 border-dashed border-surface2">
        <motion.div
          animate={stage === 'processing' ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 1, repeat: stage === 'processing' ? Infinity : 0 }}
          className="w-12 h-14 bg-accent-blue/20 rounded-lg flex items-center justify-center mb-2"
        >
          <svg className="w-6 h-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </motion.div>
        <span className="text-[10px] text-subtext0 text-center">algoritmer.pdf</span>
        {stage === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] text-accent-blue mt-1"
          >
            {language === 'no' ? 'Analyserer...' : 'Analyzing...'}
          </motion.div>
        )}
      </div>

      {/* Streaming Output */}
      <div className="flex-1 bg-accent-blue/10 rounded-xl p-4 border border-accent-blue/20 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
          <span className="text-xs text-accent-blue font-medium">
            {language === 'no' ? 'Sammendrag' : 'Summary'}
          </span>
        </div>
        <AnimatePresence mode="wait">
          {stage === 'upload' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-xs text-subtext0"
            >
              {language === 'no' ? 'Venter på dokument...' : 'Waiting for document...'}
            </motion.div>
          )}
          {stage === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 h-1.5 rounded-full bg-accent-blue"
                  />
                ))}
              </div>
              <span className="text-xs text-subtext0">
                {language === 'no' ? 'Genererer sammendrag...' : 'Generating summary...'}
              </span>
            </motion.div>
          )}
          {stage === 'streaming' && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-foreground leading-relaxed"
            >
              {streamedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-3 bg-accent-blue ml-0.5 align-middle"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChatDemo() {
  const { language } = useLanguage();
  const messages = [
    {
      role: 'user',
      text: language === 'no'
        ? 'Hva er forskjellen på stakk og kø?'
        : 'What is the difference between stack and queue?',
    },
    {
      role: 'assistant',
      text: language === 'no'
        ? 'En stakk bruker LIFO (Last In, First Out), mens en kø bruker FIFO (First In, First Out).'
        : 'A stack uses LIFO (Last In, First Out), while a queue uses FIFO (First In, First Out).',
      source: language === 'no' ? 'Kap. 4: Datastrukturer' : 'Ch. 4: Data Structures',
    },
  ];

  return (
    <div className="space-y-3 h-52 flex flex-col justify-end">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.8 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
              msg.role === 'user'
                ? 'bg-accent-blue text-background'
                : 'bg-surface1/50 text-foreground'
            }`}
          >
            {msg.text}
            {msg.source && (
              <span className="block text-xs mt-1.5 opacity-70 text-accent-blue">[{msg.source}]</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ExamDemo() {
  const { language } = useLanguage();

  const questionsNo = [
    {
      id: 'mcq',
      label: 'Flervalg',
      question: 'Hva er tidskompleksiteten til binærsøk?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 1,
      userAnswer: '',
      feedback: '',
    },
    {
      id: 'short',
      label: 'Kort svar',
      question: 'Forklar hva rekursjon er med ett eksempel.',
      userAnswer: 'Rekursjon er når en funksjon kaller seg selv. F.eks. factorial(n) = n * factorial(n-1).',
      feedback: '✓ Bra! Du har forstått konseptet. Husk å nevne base case for å unngå uendelig rekursjon.',
    },
    {
      id: 'long',
      label: 'Langt svar',
      question: 'Sammenlign objektorientert og funksjonell programmering.',
      userAnswer: 'OOP bruker klasser og objekter, mens FP fokuserer på rene funksjoner uten sideeffekter...',
      feedback: '✓ God start! Utvid med konkrete eksempler på immutabilitet i FP og arv i OOP.',
    },
  ];

  const questionsEn = [
    {
      id: 'mcq',
      label: 'Multiple Choice',
      question: 'What is the time complexity of binary search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 1,
      userAnswer: '',
      feedback: '',
    },
    {
      id: 'short',
      label: 'Short Answer',
      question: 'Explain what recursion is with one example.',
      userAnswer: 'Recursion is when a function calls itself. E.g. factorial(n) = n * factorial(n-1).',
      feedback: '✓ Good! You understood the concept. Remember to mention base case to avoid infinite recursion.',
    },
    {
      id: 'long',
      label: 'Long Answer',
      question: 'Compare object-oriented and functional programming.',
      userAnswer: 'OOP uses classes and objects, while FP focuses on pure functions without side effects...',
      feedback: '✓ Good start! Expand with concrete examples of immutability in FP and inheritance in OOP.',
    },
  ];

  const questions = language === 'no' ? questionsNo : questionsEn;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % 3);
    setSelectedOption(null);
    setTypedAnswer('');
    setFeedbackText('');
    setShowFeedback(false);
  };

  // Handle typing and feedback animation
  useEffect(() => {
    // Clear any existing intervals/timeouts
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (feedbackIntervalRef.current) clearInterval(feedbackIntervalRef.current);
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);

    setTypedAnswer('');
    setFeedbackText('');
    setShowFeedback(false);
    setSelectedOption(null);

    // MCQ: show answer after 1.5s, then wait 2s and go next
    if (activeIndex === 0) {
      const timer = setTimeout(() => {
        setSelectedOption(1);
        nextTimeoutRef.current = setTimeout(goToNext, 2000);
      }, 1500);
      return () => {
        clearTimeout(timer);
        if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
      };
    }

    // Short/Long answer: type answer, show feedback, wait, then go next
    const q = questions[activeIndex];
    if (!q.userAnswer) return;

    let answerIdx = 0;
    intervalRef.current = setInterval(() => {
      answerIdx++;
      if (answerIdx <= q.userAnswer.length) {
        setTypedAnswer(q.userAnswer.slice(0, answerIdx));
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        // Start feedback after typing completes
        setTimeout(() => {
          setShowFeedback(true);
          let fbIdx = 0;
          feedbackIntervalRef.current = setInterval(() => {
            fbIdx++;
            if (fbIdx <= q.feedback.length) {
              setFeedbackText(q.feedback.slice(0, fbIdx));
            } else {
              if (feedbackIntervalRef.current) clearInterval(feedbackIntervalRef.current);
              // Wait 2s after feedback is done, then go next
              nextTimeoutRef.current = setTimeout(goToNext, 2000);
            }
          }, 25);
        }, 400);
      }
    }, 35);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (feedbackIntervalRef.current) clearInterval(feedbackIntervalRef.current);
      if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
    };
  }, [activeIndex, language]);

  const activeQuestion = questions[activeIndex];

  return (
    <div className="h-64 flex flex-col">
      {/* Question type tabs */}
      <div className="flex gap-2 mb-3">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => {
              setActiveIndex(i);
              setSelectedOption(null);
              setTypedAnswer('');
              setFeedbackText('');
              setShowFeedback(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              i === activeIndex
                ? 'bg-accent-mauve text-background'
                : 'bg-surface1/50 text-subtext0 hover:bg-surface1'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Question content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-1 bg-surface1/30 rounded-xl p-4 overflow-hidden"
        >
          <div className="text-sm text-foreground font-medium mb-3">
            {activeQuestion.question}
          </div>

          {/* Multiple choice options */}
          {activeQuestion.id === 'mcq' && activeQuestion.options && (
            <div className="space-y-2">
              {activeQuestion.options.map((opt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === i
                      ? i === activeQuestion.correctIndex
                        ? 'bg-accent-green/20 border border-accent-green/40'
                        : 'bg-accent-red/20 border border-accent-red/40'
                      : 'hover:bg-surface1/50'
                  }`}
                  onClick={() => setSelectedOption(i)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedOption === i
                        ? i === activeQuestion.correctIndex
                          ? 'border-accent-green bg-accent-green'
                          : 'border-accent-red bg-accent-red'
                        : 'border-subtext0/40'
                    }`}
                  >
                    {selectedOption === i && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-background"
                      />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{opt}</span>
                  {selectedOption === i && i === activeQuestion.correctIndex && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-auto text-xs text-accent-green"
                    >
                      ✓ {language === 'no' ? 'Riktig!' : 'Correct!'}
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Short answer with feedback */}
          {activeQuestion.id === 'short' && (
            <div className="space-y-2">
              <div className="bg-surface0/50 rounded-lg p-2.5 text-xs text-foreground border border-surface1">
                {typedAnswer || <span className="text-subtext0">{language === 'no' ? 'Skriv svar...' : 'Type answer...'}</span>}
                {!showFeedback && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 bg-accent-mauve ml-0.5 align-middle"
                  />
                )}
              </div>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-2.5 text-xs text-accent-green"
                >
                  {feedbackText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 bg-accent-green ml-0.5 align-middle"
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* Long answer with feedback */}
          {activeQuestion.id === 'long' && (
            <div className="space-y-2">
              <div className="bg-surface0/50 rounded-lg p-2.5 text-xs text-foreground border border-surface1 h-14 overflow-hidden">
                {typedAnswer || <span className="text-subtext0">{language === 'no' ? 'Skriv svar...' : 'Type answer...'}</span>}
                {!showFeedback && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 bg-accent-mauve ml-0.5 align-middle"
                  />
                )}
              </div>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-2.5 text-xs text-accent-green"
                >
                  {feedbackText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 bg-accent-green ml-0.5 align-middle"
                  />
                </motion.div>
              )}
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
      gradient: 'from-frappe-blue/10 via-frappe-sapphire/5 to-transparent',
      borderColor: 'border-frappe-blue/30 hover:border-frappe-blue/50',
      titleColor: 'text-frappe-blue',
    },
    {
      title: t('demo2Title'),
      description: t('demo2Description'),
      component: <ChatDemo />,
      span: 'md:col-span-1',
      gradient: 'from-frappe-teal/10 via-frappe-green/5 to-transparent',
      borderColor: 'border-frappe-teal/30 hover:border-frappe-teal/50',
      titleColor: 'text-frappe-teal',
    },
    {
      title: t('demo3Title'),
      description: t('demo3Description'),
      component: <ExamDemo />,
      span: 'md:col-span-3',
      gradient: 'from-frappe-mauve/10 via-frappe-pink/5 to-transparent',
      borderColor: 'border-frappe-mauve/30 hover:border-frappe-mauve/50',
      titleColor: 'text-frappe-mauve',
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
              className={`p-6 rounded-3xl bg-linear-to-br ${demo.gradient} backdrop-blur-sm border ${demo.borderColor} transition-all duration-300 ${demo.span}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${demo.titleColor}`}>{demo.title}</h3>
              <p className="text-sm text-subtext0 mb-6">{demo.description}</p>
              {demo.component}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
