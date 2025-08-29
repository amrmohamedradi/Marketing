import React from 'react';
import { ClientDetails, Service, PriceData } from '@/types';
import { deepCompact } from '@/lib/utils/deepCompact';

export interface SpecData {
  client?: ClientDetails;
  services?: Service[];
  pricing?: PriceData;
  summary?: string;
  deliverables?: string[];
  team?: string[];
  techStack?: string[];
  timeline?: string;
  notes?: string;
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
  };
}

export interface SectionConfig {
  id: string;
  title: string;
  isVisible: (spec: SpecData) => boolean;
  render: (spec: SpecData) => React.ReactNode;
}

const hasNonEmptyServices = (services?: Service[]): boolean => {
  if (!services || services.length === 0) return false;
  return services.some(service => 
    service.name?.trim() || 
    service.description?.trim() || 
    (service.subServices && service.subServices.some(sub => 
      sub.name?.trim() || sub.description?.trim()
    ))
  );
};

const hasNonEmptyPricing = (pricing?: PriceData): boolean => {
  if (!pricing) return false;
  return pricing.basePrice > 0 || 
         (pricing.additionalItems && pricing.additionalItems.some(item => 
           item.description?.trim() || item.amount > 0
         ));
};

const hasContactInfo = (contact?: SpecData['contact']): boolean => {
  if (!contact) return false;
  return !!(contact.phone?.trim() || contact.whatsapp?.trim() || 
           contact.email?.trim() || contact.website?.trim());
};

export const sectionRegistry: SectionConfig[] = [
  {
    id: 'header',
    title: 'Client Information',
    isVisible: (spec) => !!(spec.client?.name?.trim() || spec.client?.company?.trim()),
    render: (spec) => (
      <div className="text-center mb-8">
        {spec.client?.company && (
          <div className="text-sm text-muted-foreground mb-2">{spec.client.company}</div>
        )}
        {spec.client?.name && (
          <h1 className="text-3xl font-bold mb-4">{spec.client.name}</h1>
        )}
        {spec.client?.description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {spec.client.description}
          </p>
        )}
      </div>
    )
  },
  
  {
    id: 'summary',
    title: 'Project Summary',
    isVisible: (spec) => !!(spec.summary?.trim()),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
        <p className="text-muted-foreground leading-relaxed">{spec.summary}</p>
      </div>
    )
  },

  {
    id: 'services',
    title: 'Services',
    isVisible: (spec) => hasNonEmptyServices(spec.services),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid gap-4">
          {spec.services?.map((service, index) => (
            <div key={service.id || index} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                {service.icon && <service.icon className="h-5 w-5 text-primary" />}
                <h3 className="font-medium">{service.name}</h3>
              </div>
              {service.description && (
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              )}
              {service.subServices && service.subServices.length > 0 && (
                <ul className="space-y-1">
                  {service.subServices.map((sub, subIndex) => (
                    <li key={sub.id || subIndex} className="text-sm">
                      <span className="font-medium">{sub.name}</span>
                      {sub.description && (
                        <span className="text-muted-foreground"> - {sub.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },

  {
    id: 'deliverables',
    title: 'Deliverables',
    isVisible: (spec) => !!(spec.deliverables && spec.deliverables.length > 0),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Deliverables</h2>
        <ul className="space-y-2">
          {spec.deliverables?.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  },

  {
    id: 'team',
    title: 'Team',
    isVisible: (spec) => !!(spec.team && spec.team.length > 0),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <div className="flex flex-wrap gap-2">
          {spec.team?.map((member, index) => (
            <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              {member}
            </span>
          ))}
        </div>
      </div>
    )
  },

  {
    id: 'techStack',
    title: 'Technology Stack',
    isVisible: (spec) => !!(spec.techStack && spec.techStack.length > 0),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
        <div className="flex flex-wrap gap-2">
          {spec.techStack?.map((tech, index) => (
            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    )
  },

  {
    id: 'pricing',
    title: 'Pricing',
    isVisible: (spec) => hasNonEmptyPricing(spec.pricing),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="space-y-3">
          {spec.pricing?.basePrice && spec.pricing.basePrice > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <span>Base Price</span>
              <span className="font-medium">
                {spec.pricing.basePrice} {spec.pricing.currency || 'USD'}
              </span>
            </div>
          )}
          {spec.pricing?.additionalItems?.map((item, index) => (
            <div key={item.id || index} className="flex justify-between items-center py-2">
              <span>{item.description}</span>
              {item.amount > 0 && (
                <span className="font-medium">
                  {item.amount} {spec.pricing?.currency || 'USD'}
                </span>
              )}
            </div>
          ))}
          {spec.pricing?.notes && (
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground">{spec.pricing.notes}</p>
            </div>
          )}
        </div>
      </div>
    )
  },

  {
    id: 'timeline',
    title: 'Timeline',
    isVisible: (spec) => !!(spec.timeline?.trim()),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <p className="text-muted-foreground">{spec.timeline}</p>
      </div>
    )
  },

  {
    id: 'notes',
    title: 'Additional Notes',
    isVisible: (spec) => !!(spec.notes?.trim()),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{spec.notes}</p>
      </div>
    )
  },

  {
    id: 'contact',
    title: 'Contact Information',
    isVisible: (spec) => hasContactInfo(spec.contact),
    render: (spec) => (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-2">
          {spec.contact?.phone && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Phone:</span>
              <a href={`tel:${spec.contact.phone}`} className="text-primary hover:underline">
                {spec.contact.phone}
              </a>
            </div>
          )}
          {spec.contact?.whatsapp && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">WhatsApp:</span>
              <a href={`https://wa.me/${spec.contact.whatsapp.replace(/\D/g, '')}`} 
                 className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {spec.contact.whatsapp}
              </a>
            </div>
          )}
          {spec.contact?.email && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Email:</span>
              <a href={`mailto:${spec.contact.email}`} className="text-primary hover:underline">
                {spec.contact.email}
              </a>
            </div>
          )}
          {spec.contact?.website && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Website:</span>
              <a href={spec.contact.website} className="text-primary hover:underline" 
                 target="_blank" rel="noopener noreferrer">
                {spec.contact.website}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
];

export function renderVisibleSections(rawSpec: SpecData): React.ReactNode {
  const spec = deepCompact(rawSpec) as SpecData;
  
  return sectionRegistry
    .filter(section => section.isVisible(spec))
    .map(section => (
      <div key={section.id}>
        {section.render(spec)}
      </div>
    ));
}
