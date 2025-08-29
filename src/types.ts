// Common types used across the application

export interface SubService {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
}

// Import LucideIcon type
import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon; // Changed from string to LucideIcon
  subServices: SubService[];
  suggestedItems: { name: string; description: string }[];
  isDefault?: boolean;
  originalId?: string;
}

export interface ClientDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
}

export interface PriceItem {
  id: string;
  description: string;
  amount: number;
}

export interface PriceData {
  basePrice: number;
  currency: string;
  additionalItems: PriceItem[];
  notes: string;
}