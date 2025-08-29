import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { renderVisibleSections, SpecData } from '@/components/spec/sections';
import '@/styles/animated-bg.css';

const ReadSpec: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [spec, setSpec] = useState<SpecData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load specification');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, [slug]);

  useEffect(() => {
    // Reveal sections on scroll
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal sections after a short delay
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.reveal-section');
      sections.forEach(section => observer.observe(section));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [spec]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Specification Not Found</h1>
          <p className="text-muted-foreground">{error || 'The requested specification could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="aurora-gradient"></div>
        <div className="stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
        <div className="shooting-star"></div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen py-8 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="reveal-section">
            {renderVisibleSections(spec)}
          </div>
          
          {/* Footer */}
          <div className="reveal-section mt-12 text-center text-sm text-muted-foreground">
            <p>Generated with Service Spec Maker</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadSpec;
