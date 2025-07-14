import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/features/Hero';
import { FeatureCards } from '@/components/features/FeatureCards';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeatureCards />
      </main>
    </div>
  );
};

export default Index;
