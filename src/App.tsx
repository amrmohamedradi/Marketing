import React, { useEffect, useState } from 'react';
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "./pages/NotFound";
import PreviewPage from "./pages/Preview";
import HealthPage from "./pages/Health";
import { AppProvider, useAppContext } from "@/lib/AppContext"; // Import AppProvider and useAppContext
import { healthCheck } from "@/lib/api";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"; // For shadcn/ui toasts
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ReadSpec from "./pages/ReadSpec";
import Header from "./components/Header"; // Import the new Header component

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();
  const [isApiOnline, setIsApiOnline] = useState(true);
  const [showHealthBanner, setShowHealthBanner] = useState(false);
  
  // Check if current route is read-only page
  const isReadOnlyRoute = location.pathname.startsWith('/read/');

  useEffect(() => {
    const checkHealth = async () => {
      const isOnline = await healthCheck();
      setIsApiOnline(isOnline);
      setShowHealthBanner(!isOnline);
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full h-full bg-background text-foreground">
      {showHealthBanner && (
        <div className="bg-red-600 text-white px-4 py-2 text-center relative">
          <span>⚠️ API is currently offline. Some features may not work properly.</span>
          <button 
            onClick={() => setShowHealthBanner(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      {isLoggedIn && !isReadOnlyRoute && <Header />}
      <main className={isReadOnlyRoute ? "" : "container mx-auto py-8"}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/read/:slug" element={<ReadSpec />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/debug/health" element={<HealthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const AppWithRouter = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const App = () => (
  <LanguageProvider>
    {/* This allows us to use the QueryClientProvider anywhere in our app */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider> {/* Wrap BrowserRouter with AppProvider */}
          <AppWithRouter />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
