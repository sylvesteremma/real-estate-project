export type PropertyCategory = "RENT" | "BUY PROPERTY" | "BUY LAND";
export type PropertyStatus = "AVAILABLE" | "RESERVED" | "TAKEN";

export type Property = {
  slug: string;
  title: string;
  category: PropertyCategory;
  propertyType: string;
  status: PropertyStatus;
  price: number;
  currency: string;
  location: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  propertySize?: string;
  landSize?: string;
  featured: boolean;
  published: boolean;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
};
