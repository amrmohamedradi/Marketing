import { LanguageProvider } from "@/lib/i18n";
import NotFound from "./pages/NotFound";
import PreviewPage from "./pages/Preview";
import { AppProvider, useAppContext } from "@/lib/AppContext"; // Import AppProvider and useAppContext

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"; // For shadcn/ui toasts
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Header from "./components/Header"; // Import the new Header component

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full h-full bg-background text-foreground">
        {isLoggedIn && <Header />}
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
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
          <AppContent />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
