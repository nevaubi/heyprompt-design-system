import { Hero } from '@/components/features/Hero';
import { FeatureCards } from '@/components/features/FeatureCards';
import { PopularCategories } from '@/components/features/PopularCategories';
import { SamplePrompts } from '@/components/features/SamplePrompts';
import { CTASection } from '@/components/features/CTASection';

const Index = () => {
  return (
    <>
      <Hero />
      <FeatureCards />
      <PopularCategories />
      <SamplePrompts />
      <CTASection />
    </>
  );
};

export default Index;
