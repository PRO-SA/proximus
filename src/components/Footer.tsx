'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-surface1">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and company */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-blue flex items-center justify-center">
              <span className="text-background font-bold text-sm">J</span>
            </div>
            <span className="font-bold">{t('logo')}</span>
            <span className="text-subtext0 text-sm">by {t('footerCompany')}</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-subtext0 hover:text-foreground transition-colors"
            >
              {t('footerPrivacy')}
            </Link>

            {/* Language toggle */}
            <div className="flex items-center gap-1 bg-surface0/50 rounded-full p-1">
              <button
                onClick={() => setLanguage('no')}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
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
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                  language === 'en'
                    ? 'bg-accent-blue text-background'
                    : 'text-subtext0 hover:text-foreground'
                )}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-surface1 text-center">
          <p className="text-sm text-subtext0">
            &copy; {year} {t('footerCompany')}. {t('footerRights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
