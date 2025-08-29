// Import types from a new types file we'll create
import { ClientDetails, Service, PriceData } from '../types';
import { SpecData } from './api';

/**
 * Maps the frontend data model to the backend data model
 * @param clientDetails The client details from the frontend
 * @param services The services from the frontend
 * @param priceData The price data from the frontend
 * @returns The mapped data for the backend
 */
export const mapToBackendModel = (
  clientDetails: ClientDetails,
  services: Service[],
  priceData: PriceData
): SpecData => {
  // Map services to the backend format
  const mappedServices = services.map(service => ({
    category: service.name,
    items: service.subServices.map(subService => subService.name)
  }));

  // Map pricing to the backend format
  const mappedPricing = [
    {
      title: 'Base Package',
      price: priceData.basePrice,
      currency: priceData.currency,
      features: services.flatMap(service => 
        service.subServices.map(subService => subService.name)
      )
    }
  ];

  // If there are additional items, add them as a separate pricing tier
  if (priceData.additionalItems.length > 0) {
    mappedPricing.push({
      title: 'Additional Items',
      price: priceData.additionalItems.reduce((sum, item) => sum + item.amount, 0),
      currency: priceData.currency,
      features: priceData.additionalItems.map(item => item.description)
    });
  }

  // Create the spec data object
  const specData: SpecData = {
    clientName: clientDetails.name,
    brief: clientDetails.description || 'Service specification for ' + clientDetails.name,
    services: mappedServices,
    pricing: mappedPricing,
    contact: {
      email: clientDetails.email,
      phone: clientDetails.phone,
      website: undefined // Using undefined instead of empty string to pass URL validation
    },
    meta: {
      brandColors: [],
      logoUrl: undefined // Using undefined instead of empty string to pass URL validation
    }
  };

  return specData;
};