import { LanguageProvider } from "@/lib/i18n";
import NotFound from "./pages/NotFound";
import PreviewPage from "./pages/Preview";
import { AppProvider } from "@/lib/AppContext"; // Import AppProvider

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"; // For shadcn/ui toasts
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    {/* This allows us to use the QueryClientProvider anywhere in our app */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider> {/* Wrap BrowserRouter with AppProvider */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
