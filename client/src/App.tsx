import React, { Suspense, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./lib/language-context";
import ErrorBoundary from "./components/ErrorBoundary";
import PixelNav from "./components/pixel-nav";
import MatrixRain from "./components/matrix-rain";
import AudioPlayer from "./components/audio-player";
import SEOHead from "./components/seo-head";
import PerformanceOptimizer from "./components/performance-optimizer";
import { usePerformance, trackPageView, useRenderPerformance } from "./hooks/usePerformance";

// Lazy load pages for better performance
const Home = React.lazy(() => import("@/pages/home"));
const Stamps = React.lazy(() => import("@/pages/stamps"));
const Community = React.lazy(() => import("@/pages/community"));
const Token = React.lazy(() => import("@/pages/token"));
const Lore = React.lazy(() => import("@/pages/lore"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-kevin-charcoal flex items-center justify-center">
      <div className="terminal-window text-center">
        <div className="font-pixel text-kevin-orange text-xl mb-4">
          🔄 LOADING KEVIN.EXE
        </div>
        <div className="font-terminal text-kevin-mint">
          <div>&gt; Initializing ghost in the machine...</div>
          <div>&gt; Loading stamp data...</div>
          <div>&gt; Preparing matrix effects...</div>
        </div>
        <div className="mt-4">
          <div className="inline-block w-8 h-8 border-2 border-kevin-neon border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <SEOHead />
        <PerformanceOptimizer />
        <MatrixRain />
        <PixelNav />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/stamps" component={Stamps} />
          <Route path="/community" component={Community} />
          <Route path="/token" component={Token} />
          <Route path="/lore" component={Lore} />
          <Route component={NotFound} />
        </Switch>
        <AudioPlayer />
      </Suspense>
    </ErrorBoundary>
  );
}

// Performance monitoring wrapper (client-side only)
function PerformanceWrapper({ children }: { children: React.ReactNode }) {
  usePerformance(); // Track app performance
  useRenderPerformance('App'); // Track render performance

  useEffect(() => {
    // Track initial page view
    trackPageView('App Initialized');
  }, []);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <div className="dark">
            <Toaster />
            <PerformanceWrapper>
              <Router />
            </PerformanceWrapper>
          </div>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
