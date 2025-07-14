import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;
}

export function Layout({ 
  children, 
  hideHeader = false, 
  hideFooter = false, 
  className = '' 
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {!hideHeader && <Header />}
      <main className={hideHeader ? '' : 'pt-14 sm:pt-16'}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}