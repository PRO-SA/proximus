'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { validateEmail, cn } from '@/lib/utils';

type FormStatus = 'idle' | 'loading' | 'success' | 'exists' | 'error';

export function WaitlistForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage(t('invalidEmail'));
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'created' || data.status === 'reactivated') {
        setStatus('success');
      } else if (data.status === 'exists') {
        setStatus('exists');
      } else {
        setStatus('error');
        setErrorMessage(t('errorMessage'));
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('errorMessage'));
    }
  };

  const isSuccess = status === 'success' || status === 'exists';

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="shimmer-border p-[2px] rounded-2xl">
              <div className="flex bg-surface0 rounded-2xl overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t('emailPlaceholder')}
                  className={cn(
                    'flex-1 px-5 py-4 bg-transparent text-foreground placeholder:text-subtext0',
                    'focus:outline-none text-base'
                  )}
                  disabled={status === 'loading'}
                  aria-label={t('emailPlaceholder')}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'px-6 py-4 bg-accent-blue text-background font-semibold',
                    'hover:opacity-90 transition-opacity disabled:opacity-50',
                    'text-sm whitespace-nowrap'
                  )}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    </span>
                  ) : (
                    t('ctaButton')
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-accent-red text-sm mt-3 text-center"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 bg-surface0/50 backdrop-blur-sm rounded-2xl border border-accent-green/20"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-green/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {status === 'exists' ? t('alreadySignedUp') : t('successMessage')}
            </p>
            <p className="text-sm text-subtext0 mt-2">
              {t('successSubtext')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
