'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';

type Status = 'loading' | 'unsubscribed' | 'resubscribed' | 'error' | 'invalid';

function UnsubscribeContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    // Auto-unsubscribe on page load
    fetch('/api/waitlist/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'unsubscribed' || data.status === 'already_unsubscribed') {
          setStatus('unsubscribed');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const handleUndo = async () => {
    if (!token) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist/resubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.status === 'resubscribed') {
        setStatus('resubscribed');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center"
    >
      {status === 'loading' && (
        <div className="p-8 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-surface1">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface1 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-accent-blue" viewBox="0 0 24 24">
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
          </div>
          <p className="text-subtext0">Loading...</p>
        </div>
      )}

      {status === 'invalid' && (
        <div className="p-8 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-accent-red/20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-red/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">{t('invalidToken')}</h1>
          <Link href="/" className="text-accent-blue hover:underline text-sm">
            {t('logo')}
          </Link>
        </div>
      )}

      {status === 'unsubscribed' && (
        <div className="p-8 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-surface1">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-green/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">{t('unsubscribeSuccess')}</h1>
          <p className="text-subtext0 mb-6">{t('unsubscribeDescription')}</p>
          <button
            onClick={handleUndo}
            className="px-6 py-3 rounded-xl bg-surface1 hover:bg-surface2 transition-colors text-sm font-medium"
          >
            {t('undoButton')}
          </button>
        </div>
      )}

      {status === 'resubscribed' && (
        <div className="p-8 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-accent-green/20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-green/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">{t('undoSuccess')}</h1>
          <Link href="/" className="text-accent-blue hover:underline text-sm">
            {t('logo')}
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="p-8 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-accent-red/20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-red/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">{t('unsubscribeError')}</h1>
          <Link href="/" className="text-accent-blue hover:underline text-sm">
            {t('logo')}
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default function UnsubscribePage() {
  const { t } = useLanguage();

  return (
    <>
      <Background />
      <Header />
      <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <Suspense
          fallback={
            <div className="p-8 rounded-3xl bg-surface0/30 backdrop-blur-sm border border-surface1">
              <p className="text-subtext0">Loading...</p>
            </div>
          }
        >
          <UnsubscribeContent />
        </Suspense>
      </main>
    </>
  );
}
