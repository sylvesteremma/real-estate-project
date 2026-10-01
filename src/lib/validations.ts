import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const propertySchema = z.object({
  title: z.string().min(3),
  category: z.enum(["RENT", "BUY_PROPERTY", "BUY_LAND"]),
  propertyType: z.string().min(2),
  price: z.number().min(0),
  currency: z.string().default("NGN"),
  status: z.enum(["AVAILABLE", "RESERVED", "TAKEN"]).default("AVAILABLE"),
  location: z.string().min(2),
  address: z.string().min(5),
  description: z.string().min(10),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  toilets: z.number().int().min(0).optional(),
  propertySize: z.string().optional(),
  landSize: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  features: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        altText: z.string().optional(),
      }),
    )
    .default([]),
});

export const inquirySchema = z.object({
  propertyId: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(10),
});

export const viewingSchema = z.object({
  propertyId: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  preferredDate: z.string(),
  preferredTime: z.string(),
  message: z.string().min(10),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export const adminCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});
