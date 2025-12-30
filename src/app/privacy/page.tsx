'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const content = {
  no: {
    title: 'Personvernerklæring',
    lastUpdated: 'Sist oppdatert: Januar 2025',
    sections: [
      {
        title: 'Hvem vi er',
        content: 'Janus er et produkt utviklet av PROSA AS. Vi er forpliktet til å beskytte personvernet ditt og behandle dine personopplysninger i samsvar med gjeldende lovgivning, inkludert GDPR.',
      },
      {
        title: 'Hvilke data vi samler inn',
        content: 'For ventelisten samler vi kun inn e-postadressen din. Vi samler ikke inn navn, telefonnummer, eller andre personopplysninger.',
      },
      {
        title: 'Hvorfor vi samler inn data',
        content: 'Vi bruker e-postadressen din utelukkende for å sende deg oppdateringer om Janus-lanseringen. Du vil motta maksimalt to e-poster: én uke før lansering og én på selve lanseringsdagen.',
      },
      {
        title: 'Datalagring og sikkerhet',
        content: 'Dine data lagres sikkert hos Supabase i EU (eu-central-1). Vi bruker industristandarder for kryptering og tilgangskontroll. Data slettes automatisk 1 år etter lansering.',
      },
      {
        title: 'Deling av data',
        content: 'Vi selger aldri dine data til tredjeparter. E-postadressen din deles ikke med noen utenfor PROSA AS.',
      },
      {
        title: 'Dine rettigheter',
        content: 'Du har rett til å: (1) Be om tilgang til dine data, (2) Kreve sletting av dine data, (3) Melde deg av ventelisten når som helst via avmeldingslenken i e-poster, (4) Klage til Datatilsynet hvis du mener vi bryter personvernlovgivningen.',
      },
      {
        title: 'Avmelding',
        content: 'Alle e-poster inneholder en unik avmeldingslenke. Du kan også melde deg på igjen når som helst ved å registrere deg på nytt på forsiden.',
      },
      {
        title: 'Kontakt',
        content: 'Har du spørsmål om personvern? Kontakt oss på privacy@prosa.no.',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 2025',
    sections: [
      {
        title: 'Who we are',
        content: 'Janus is a product developed by PROSA AS. We are committed to protecting your privacy and processing your personal data in accordance with applicable legislation, including GDPR.',
      },
      {
        title: 'What data we collect',
        content: 'For the waitlist, we only collect your email address. We do not collect names, phone numbers, or other personal information.',
      },
      {
        title: 'Why we collect data',
        content: 'We use your email address solely to send you updates about the Janus launch. You will receive a maximum of two emails: one week before launch and one on launch day.',
      },
      {
        title: 'Data storage and security',
        content: 'Your data is stored securely at Supabase in the EU (eu-central-1). We use industry standards for encryption and access control. Data is automatically deleted 1 year after launch.',
      },
      {
        title: 'Data sharing',
        content: 'We never sell your data to third parties. Your email address is not shared with anyone outside PROSA AS.',
      },
      {
        title: 'Your rights',
        content: 'You have the right to: (1) Request access to your data, (2) Request deletion of your data, (3) Unsubscribe from the waitlist at any time via the unsubscribe link in emails, (4) File a complaint with the Data Protection Authority if you believe we are violating privacy legislation.',
      },
      {
        title: 'Unsubscribe',
        content: 'All emails contain a unique unsubscribe link. You can also re-subscribe at any time by signing up again on the front page.',
      },
      {
        title: 'Contact',
        content: 'Have questions about privacy? Contact us at privacy@prosa.no.',
      },
    ],
  },
};

export default function PrivacyPage() {
  const { language, t } = useLanguage();
  const pageContent = content[language];

  return (
    <>
      <Background />
      <Header />
      <main className="min-h-screen px-6 pt-32 pb-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-subtext0 hover:text-foreground transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('logo')}
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{pageContent.title}</h1>
          <p className="text-subtext0 mb-12">{pageContent.lastUpdated}</p>

          <div className="space-y-8">
            {pageContent.sections.map((section, i) => (
              <section key={i} className="p-6 rounded-2xl bg-surface0/20 backdrop-blur-sm border border-surface1">
                <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
                <p className="text-subtext0 leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
        </motion.article>
      </main>
      <Footer />
    </>
  );
}
