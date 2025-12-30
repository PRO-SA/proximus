'use client';

import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-6xl flex items-center justify-end">
        <div className="flex items-center gap-2 bg-surface0/50 backdrop-blur-xl rounded-full p-1">
          <button
            onClick={() => setLanguage('no')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              language === 'no'
                ? 'bg-accent-blue text-background'
                : 'text-subtext0 hover:text-foreground'
            )}
          >
            NO
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              language === 'en'
                ? 'bg-accent-blue text-background'
                : 'text-subtext0 hover:text-foreground'
            )}
          >
            EN
          </button>
        </div>
      </div>
    </motion.header>
  );
}
