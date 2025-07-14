import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SEO } from '@/components/SEO';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useGlobalShortcuts, useKonamiCode } from "@/hooks/useKeyboardShortcuts";
import { analytics, usePageTracking, useUserTracking } from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { Enhanced404 } from "@/components/ErrorBoundary";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Browse = lazy(() => import("./pages/Browse"));
const Search = lazy(() => import("./pages/Search"));
const PromptDetail = lazy(() => import("./pages/PromptDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Library = lazy(() => import("./pages/Library"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SubmitPrompt = lazy(() => import("./pages/SubmitPrompt"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Settings = lazy(() => import("./pages/Settings"));

// Import Layout
import { Layout } from "@/components/layout/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times on other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for Suspense
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

// Main app component with hooks
function AppContent() {
  const { user } = useAuth();
  
  // Set up global functionality
  useGlobalShortcuts();
  usePageTracking();
  useUserTracking(user?.id || null);
  
  // Easter egg
  useKonamiCode(() => {
    analytics.featureUsed('konami_code');
    // TODO: Add fun animation or message
    console.log('🎮 Konami code activated!');
  });

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO />
              <Index />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/browse" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO 
                title="Browse AI Prompts - HeyPrompt"
                description="Discover thousands of AI prompts for ChatGPT, Claude, and more. Filter by category, rating, and AI model."
              />
              <Browse />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/search" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO 
                title="Search Results - HeyPrompt"
                description="Search results for AI prompts, users, and tags."
              />
              <Search />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/prompts/:id" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <PromptDetail />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/auth" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout hideHeader hideFooter>
              <SEO 
                title="Sign In - HeyPrompt"
                description="Sign in to save prompts, create collections, and join our community."
              />
              <Auth />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/library" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO 
                title="My Library - HeyPrompt"
                description="Manage your saved prompts, folders, and submissions."
              />
              <Library />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/submit" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO 
                title="Submit Prompt - HeyPrompt"
                description="Share your AI prompt with the community and help others discover great prompts."
              />
              <SubmitPrompt />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/u/:username" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <UserProfile />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO 
                title="Admin Panel - HeyPrompt"
                description="Admin panel for managing prompts, users, and system settings."
              />
              <AdminPanel />
            </Layout>
          </Suspense>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout>
              <SEO 
                title="Settings - HeyPrompt"
                description="Account settings and preferences"
              />
              <Settings />
            </Layout>
          </Suspense>
        } 
      />
      <Route path="*" element={<Enhanced404 />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;