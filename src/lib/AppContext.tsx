import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

// Import types from the types file
import { ClientDetails, Service, PriceData, SubService, PriceItem } from '../types';

// Default values for the state
const defaultClientDetails: ClientDetails = {
  name: "",
  company: "",
  email: "",
  phone: "",
  description: "",
};

const defaultPriceData: PriceData = {
  basePrice: 0,
  currency: "USD",
  additionalItems: [],
  notes: "",
};

const defaultSupportItems = [
  { id: "support_24_7", title: "support_24_7_title", description: "support_24_7_description" },
  { id: "quality_guarantee", title: "quality_guarantee_title", description: "quality_guarantee_description" },
  { id: "on_time_delivery", title: "on_time_delivery_title", description: "on_time_delivery_description" },
  { id: "dedicated_team", title: "dedicated_team_title", description: "dedicated_team_description" },
  { id: "secure_process", title: "secure_process_title", description: "secure_process_description" },
  { id: "fast_turnaround", title: "fast_turnaround_title", description: "fast_turnaround_description" }
];

// Context Type
interface AppContextType {
  clientDetails: ClientDetails;
  setClientDetails: (details: ClientDetails) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  priceData: PriceData;
  setPriceData: (data: PriceData) => void;
  supportItems: { id: string; title: string; description: string }[];
  setSupportItems: (items: { id: string; title: string; description: string }[]) => void;
  clearAllData: () => void;
  clearClientAndServicesData: () => void; // New function
  clearFormData: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clientDetails, setClientDetails] = useState<ClientDetails>(() => {
    const saved = localStorage.getItem('clientDetails');
    return saved ? JSON.parse(saved) : defaultClientDetails;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    if (saved) {
      // Convert string icon names back to LucideIcon components
      const parsedServices = JSON.parse(saved);
      return parsedServices.map((service: any) => {
        // If icon is a string, convert it to a LucideIcon component
        if (service.icon && typeof service.icon === 'string') {
          // Use the default Settings icon if the icon name doesn't exist in LucideIcons
          const iconComponent = LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.Settings;
          return { ...service, icon: iconComponent };
        }
        return service;
      });
    }
    return [];
  });

  const [priceData, setPriceData] = useState<PriceData>(() => {
    const saved = localStorage.getItem('priceData');
    return saved ? JSON.parse(saved) : defaultPriceData;
  });

  const [supportItems, setSupportItems] = useState<{ id: string; title: string; description: string }[]>(() => {
    const saved = localStorage.getItem('supportItems');
    return saved ? JSON.parse(saved) : defaultSupportItems;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('clientDetails', JSON.stringify(clientDetails));
  }, [clientDetails]);

  useEffect(() => {
    // Convert LucideIcon components to string names before saving to localStorage
    const serializableServices = services.map(service => {
      // Find the icon name by comparing the icon component with LucideIcons
      let iconName = 'Settings'; // Default icon name
      
      // Only process if service.icon exists
      if (service.icon) {
        // Try to find the icon name by comparing references
        for (const [key, value] of Object.entries(LucideIcons)) {
          if (service.icon === value) {
            iconName = key;
            break;
          }
        }
      }
      
      // Return a new object with the icon as a string
      return {
        ...service,
        icon: iconName
      };
    });
    
    localStorage.setItem('services', JSON.stringify(serializableServices));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('priceData', JSON.stringify(priceData));
  }, [priceData]);

  useEffect(() => {
    localStorage.setItem('supportItems', JSON.stringify(supportItems));
  }, [supportItems]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const clearAllData = useCallback(() => {
    setClientDetails(defaultClientDetails);
    setServices([]);
    setPriceData(defaultPriceData);
    setSupportItems(defaultSupportItems);
    localStorage.removeItem('clientDetails');
    localStorage.removeItem('services');
    localStorage.removeItem('priceData');
    localStorage.removeItem('supportItems');
    setIsLoggedIn(false); // Also log out when clearing data
  }, []);

  const clearClientAndServicesData = useCallback(() => {
    setClientDetails(defaultClientDetails);
    setServices([]);
    localStorage.removeItem('clientDetails');
    localStorage.removeItem('services');
  }, []);

  const clearFormData = useCallback(() => {
    setClientDetails(defaultClientDetails);
    setServices([]);
    setPriceData(defaultPriceData);
    setSupportItems(defaultSupportItems);
    localStorage.removeItem('clientDetails');
    localStorage.removeItem('services');
    localStorage.removeItem('priceData');
    localStorage.removeItem('supportItems');
  }, []);

  const value = {
    clientDetails,
    setClientDetails,
    services,
    setServices,
    priceData,
    setPriceData,
    supportItems,
    setSupportItems,
    clearAllData,
    clearClientAndServicesData, // Include new function in context value
    clearFormData,
    isLoggedIn,
    setIsLoggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
