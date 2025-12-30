import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Janus - AI Læringsverktøy for Norge',
  description: 'Janus er NotebookLM for Norge. AI som forstår den norske læreplanen, Bokmål og Nynorsk.',
  openGraph: {
    title: 'Janus - AI Læringsverktøy for Norge',
    description: 'Janus er NotebookLM for Norge. AI som forstår den norske læreplanen, Bokmål og Nynorsk.',
    type: 'website',
    locale: 'nb_NO',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Janus - AI Læringsverktøy for Norge',
    description: 'Janus er NotebookLM for Norge. AI som forstår den norske læreplanen, Bokmål og Nynorsk.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
