import React from 'react';
import { LanguageToggle } from '@/components/i18n/LanguageToggle';

interface PublicHeaderProps {
  companyName?: string;
}

export function PublicHeader({ companyName = "Marketing Corner" }: PublicHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="rounded-fill text-primary-foreground font-bold text-sm"><img src="/src/assets/logo.webp" alt="" />  </span>
            </div>
            <h1 className="p-2 text-xl font-semibold text-foreground">{companyName}</h1>
          </div>
          
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
