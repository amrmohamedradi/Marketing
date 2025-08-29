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

// Context Type
interface AppContextType {
  clientDetails: ClientDetails;
  setClientDetails: (details: ClientDetails) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  priceData: PriceData;
  setPriceData: (data: PriceData) => void;
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
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const clearAllData = useCallback(() => {
    setClientDetails(defaultClientDetails);
    setServices([]);
    setPriceData(defaultPriceData);
    localStorage.removeItem('clientDetails');
    localStorage.removeItem('services');
    localStorage.removeItem('priceData');
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
    localStorage.removeItem('clientDetails');
    localStorage.removeItem('services');
    localStorage.removeItem('priceData');
  }, []);

  const value = {
    clientDetails,
    setClientDetails,
    services,
    setServices,
    priceData,
    setPriceData,
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
