import { z } from 'zod';

// Define the seat configuration schema
export const seatConfigSchema = z.object({
  rows: z.number().min(1, 'At least one row is required'),
  seatsPerRow: z.number().min(1, 'At least one seat per row is required'),
  rowStartChar: z.string().min(1, 'Row start character is required'),
  seatStartNum: z.number().min(1, 'Seat start number is required'),
  rowOrder: z.enum(['down', 'up']),
  seatOrder: z.enum(['left', 'right']),
  rowLabel: z.string().min(1, 'Row label is required')
});

// Define the seat type schema
export const seatTypeSchema = z.object({
  seatNumber: z.string(),
  seatType: z.enum(['standard', 'wheelchair', 'companion', 'restricted_view', 'premium', 'aisle_marker', 'unavailable']),
  isPurchasable: z.boolean().optional().default(true),
  id: z.string().optional()
});

// Define the row schema
export const rowSchema = z.object({
  rowLabel: z.string(),
  seats: z.array(seatTypeSchema).optional().nullable(),
  id: z.string().optional()
});

// Define the section schema
export const sectionSchema = z.object({
  sectionName: z.string(),
  rows: z.array(rowSchema).optional().nullable(),
  id: z.string().optional()
});

// Define the seat map schema
export const seatMapSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  venue: z.any().optional(),
  description: z.string().optional().nullable(),
  sections: z.array(sectionSchema).optional().nullable(),
  event: z.number().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional()
});

// Define the seat map configuration schema
export const seatMapConfigSchema = z.object({
  ticketQuantity: z.number().min(1, 'Ticket quantity is required'),
  seatConfig: seatConfigSchema
});

// Define the seat layout data schema
export const seatLayoutDataSchema = z.object({
  name: z.string(),
  config: seatMapConfigSchema,
  seats: z.record(z.any()),
  customSeatNames: z.record(z.string()).optional().nullable(),
  summary: z.object({
    totalSeats: z.number(),
    availableSeats: z.number(),
    unavailableSeats: z.number(),
    soldSeats: z.number()
  })
}); 