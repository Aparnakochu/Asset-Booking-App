import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  assetId: varchar("asset_id", { length: 50 }).notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  category: text("category").notNull(),
  calibrationStatus: text("calibration_status").notNull(), // 'calibrated', 'due_soon', 'overdue'
  lastCalibrated: timestamp("last_calibrated").notNull(),
  nextDue: timestamp("next_due").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  maintenanceStatus: text("maintenance_status"), // 'maintenance', 'repair', null
  estimatedReturn: timestamp("estimated_return"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  userEmail: text("user_email").notNull(),
  purpose: text("purpose").notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  duration: integer("duration").notNull(), // in hours
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'cancelled'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  bookingDate: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  userEmail: z.string().email("Valid email is required"),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
