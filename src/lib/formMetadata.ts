// Shared form field metadata to ensure consistency between dashboard and public view
export const clientFieldLabels = {
  name: 'Client Name',
  company: 'Company',
  email: 'Email Address',
  phone: 'Phone Number',
  description: 'Project Description'
} as const;

export const pricingFieldLabels = {
  basePrice: 'Base Price',
  currency: 'Currency',
  additionalItems: 'Additional Items',
  notes: 'Terms & Conditions'
} as const;

export const serviceFieldLabels = {
  name: 'Service Name',
  description: 'Description',
  subServices: 'Included Items'
} as const;

export type ClientFieldKey = keyof typeof clientFieldLabels;
export type PricingFieldKey = keyof typeof pricingFieldLabels;
export type ServiceFieldKey = keyof typeof serviceFieldLabels;
