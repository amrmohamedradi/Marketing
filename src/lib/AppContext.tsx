import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Interfaces for your data structures (copied from your existing files)
interface SubService {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  subServices: SubService[];
  suggestedItems: { name: string; description: string }[];
  isDefault?: boolean;
  originalId?: string;
}

interface ClientDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
}

interface PriceItem {
  id: string;
  description: string;
  amount: number;
}

interface PriceData {
  basePrice: number;
  currency: string;
  additionalItems: PriceItem[];
  notes: string;
}

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
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem('services', JSON.stringify(services));
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

  const value = {
    clientDetails,
    setClientDetails,
    services,
    setServices,
    priceData,
    setPriceData,
    clearAllData,
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
