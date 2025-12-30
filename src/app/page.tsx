import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { HowItWorks } from '@/components/HowItWorks';
import { BentoDemo } from '@/components/BentoDemo';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { Background } from '@/components/Background';

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <BentoDemo />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
