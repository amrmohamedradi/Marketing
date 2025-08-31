import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { deepCompact } from '@/lib/utils/deepCompact';
import { LanguageProvider } from '@/lib/i18n';
import { PublicHeader } from '@/components/public/PublicHeader';
import { AboutClient } from '@/components/public/AboutClient';
import { Services } from '@/components/public/Services';
import Support from '@/components/public/Support';
import { Pricing } from '@/components/public/Pricing';
import { ContactCompany } from '@/components/public/ContactCompany';
import { Reveal } from '@/components/Reveal';
import { LucideIcon } from 'lucide-react';
import '@/styles/space.css';
import '@/styles/readonly-page.css';

interface SpecData {
  client?: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    description?: string;
  };
  services?: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: LucideIcon;
    subServices?: Array<{
      id: string;
      name: string;
      description?: string;
    }>;
  }>;
  pricing?: {
    basePrice?: number;
    currency?: string;
    additionalItems?: Array<{
      id: string;
      description: string;
      amount?: number;
    }>;
    notes?: string;
  };
}

const ReadSpec: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [spec, setSpec] = useState<SpecData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if this is the "only" route - focuses primarily on client information
  const isOnlyRoute = location.pathname.startsWith('/only/');

  useEffect(() => {
    const fetchSpec = async () => {
      if (!slug) {
        setError('No specification ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/specs/${slug}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error('Specification not found');
        }

        const data = await response.json();
        // Apply deepCompact to sanitize the data
        const cleanedData = deepCompact(data) as SpecData;
        setSpec(cleanedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load specification');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, [slug]);

  return (
    <LanguageProvider>
      <div className="readonly-page min-h-screen overflow-visible space-bg">
        <PublicHeader />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl overflow-visible">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading specification...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : spec ? (
            <div className="space-y-12">
              <Reveal>
                <AboutClient client={spec.client || {}} isStandalone={isOnlyRoute} />
              </Reveal>
              
              {!isOnlyRoute && (
                <>
                  <Reveal>
                    <Services services={spec.services || []} />
                  </Reveal>
                  
                  <Reveal>
                    <Support />
                  </Reveal>
                  
                  <Reveal>
                    <Pricing pricing={spec.pricing || {}} />
                  </Reveal>
                  
                  <Reveal>
                    <ContactCompany />
                  </Reveal>
                </>
              )}
              
              {isOnlyRoute && spec.client && (
                <div className="text-center py-8">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-4">Client Information Summary</h3>
                    <p className="text-gray-300 text-sm">
                      This page displays the client information for this specification. 
                      <a 
                        href={`/read/${slug}`} 
                        className="text-blue-400 hover:text-blue-300 underline ml-1"
                      >
                        View full specification
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Specification Not Found</h1>
                <p className="text-muted-foreground">The requested specification could not be found.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </LanguageProvider>
  );
};

export default ReadSpec;
