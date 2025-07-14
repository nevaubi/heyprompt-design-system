import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/features/Hero';
import { FeatureCards } from '@/components/features/FeatureCards';
import { PopularCategories } from '@/components/features/PopularCategories';
import { SamplePrompts } from '@/components/features/SamplePrompts';
import { CTASection } from '@/components/features/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <PopularCategories />
        <SamplePrompts />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
