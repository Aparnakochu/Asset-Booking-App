import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all assets
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  // Get asset by ID
  app.get("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getAsset(id);
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  // Get available time slots for an asset on a specific date
  app.get("/api/assets/:id/availability/:date", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      const date = req.params.date;
      
      const asset = await storage.getAsset(assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      if (!asset.isAvailable) {
        return res.json({ availableSlots: [] });
      }

      // Get existing bookings for this asset on this date
      const existingBookings = await storage.getBookingsByDate(date);
      const assetBookings = existingBookings.filter(booking => booking.assetId === assetId);

      // Define all possible time slots
      const allSlots = [
        "09:00", "10:00", "11:00", "12:00", 
        "13:00", "14:00", "15:00", "16:00", "16:30"
      ];

      // Filter out booked slots
      const bookedSlots = assetBookings.map(booking => booking.timeSlot);
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json({ availableSlots, bookedSlots });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if asset exists and is available
      const asset = await storage.getAsset(validatedData.assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      if (!asset.isAvailable) {
        return res.status(400).json({ message: "Asset is not available for booking" });
      }

      // Check if the time slot is already booked
      const existingBookings = await storage.getBookingsByDate(validatedData.bookingDate);
      const conflictingBooking = existingBookings.find(
        booking => booking.assetId === validatedData.assetId && 
                  booking.timeSlot === validatedData.timeSlot
      );

      if (conflictingBooking) {
        return res.status(400).json({ message: "Time slot is already booked" });
      }

      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get asset statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      const bookings = await storage.getBookings();
      
      const available = assets.filter(asset => asset.isAvailable).length;
      const inUse = assets.filter(asset => !asset.isAvailable && !asset.maintenanceStatus).length;
      const maintenance = assets.filter(asset => asset.maintenanceStatus).length;
      const myBookings = bookings.filter(booking => booking.status === "confirmed").length;

      res.json({
        available,
        inUse,
        maintenance,
        myBookings
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
