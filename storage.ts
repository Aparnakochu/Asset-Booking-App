import { assets, bookings, type Asset, type InsertAsset, type Booking, type InsertBooking } from "@shared/schema";

export interface IStorage {
  // Asset methods
  getAssets(): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetByAssetId(assetId: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByAsset(assetId: number): Promise<Booking[]>;
  getBookingsByDate(date: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private assets: Map<number, Asset>;
  private bookings: Map<number, Booking>;
  private currentAssetId: number;
  private currentBookingId: number;

  constructor() {
    this.assets = new Map();
    this.bookings = new Map();
    this.currentAssetId = 1;
    this.currentBookingId = 1;
    
    // Initialize with sample assets
    this.initializeAssets();
  }

  private initializeAssets() {
    const sampleAssets: InsertAsset[] = [
      {
        assetId: "OSC-001",
        name: "Keysight DSOX1204G Oscilloscope",
        description: "4-channel, 200 MHz digital oscilloscope with 2 GSa/s sampling rate",
        location: "Lab B-204",
        category: "Oscilloscopes",
        calibrationStatus: "calibrated",
        lastCalibrated: new Date("2024-11-15"),
        nextDue: new Date("2025-11-15"),
        isAvailable: true,
        maintenanceStatus: null,
        estimatedReturn: null,
      },
      {
        assetId: "DMM-003",
        name: "Fluke 8845A Precision Multimeter",
        description: "6.5-digit precision multimeter with 0.0024% basic DCV accuracy",
        location: "Lab A-101",
        category: "Multimeters",
        calibrationStatus: "due_soon",
        lastCalibrated: new Date("2024-01-20"),
        nextDue: new Date("2025-01-20"),
        isAvailable: true,
        maintenanceStatus: null,
        estimatedReturn: null,
      },
      {
        assetId: "PSU-002",
        name: "Keysight E36313A Power Supply",
        description: "Triple-output DC power supply, 6V/5A, ±25V/1A",
        location: "Lab C-305",
        category: "Power Supplies",
        calibrationStatus: "calibrated",
        lastCalibrated: new Date("2024-08-10"),
        nextDue: new Date("2025-08-10"),
        isAvailable: true,
        maintenanceStatus: null,
        estimatedReturn: null,
      },
      {
        assetId: "SIG-001",
        name: "Rohde & Schwarz SMC100A Signal Generator",
        description: "RF signal generator, 9 kHz to 1.1 GHz",
        location: "Lab B-204",
        category: "Signal Generators",
        calibrationStatus: "calibrated",
        lastCalibrated: new Date("2024-09-05"),
        nextDue: new Date("2025-09-05"),
        isAvailable: false,
        maintenanceStatus: "maintenance",
        estimatedReturn: new Date("2024-12-28"),
      },
      {
        assetId: "OSC-002",
        name: "Tektronix MSO46 Mixed Signal Oscilloscope",
        description: "4-channel, 1 GHz bandwidth with 16 digital channels",
        location: "Lab A-101",
        category: "Oscilloscopes",
        calibrationStatus: "calibrated",
        lastCalibrated: new Date("2024-10-12"),
        nextDue: new Date("2025-10-12"),
        isAvailable: true,
        maintenanceStatus: null,
        estimatedReturn: null,
      },
      {
        assetId: "DMM-004",
        name: "Keysight 34465A Digital Multimeter",
        description: "6.5-digit bench multimeter with Truevolt technology",
        location: "Lab C-305",
        category: "Multimeters",
        calibrationStatus: "calibrated",
        lastCalibrated: new Date("2024-09-20"),
        nextDue: new Date("2025-09-20"),
        isAvailable: true,
        maintenanceStatus: null,
        estimatedReturn: null,
      },
    ];

    sampleAssets.forEach(asset => {
      const id = this.currentAssetId++;
      const fullAsset: Asset = { 
        ...asset, 
        id,
        description: asset.description ?? null,
        isAvailable: asset.isAvailable ?? true,
        maintenanceStatus: asset.maintenanceStatus ?? null,
        estimatedReturn: asset.estimatedReturn ?? null
      };
      this.assets.set(id, fullAsset);
    });
  }

  // Asset methods
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(asset => asset.assetId === assetId);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.currentAssetId++;
    const asset: Asset = { 
      ...insertAsset, 
      id,
      description: insertAsset.description ?? null,
      isAvailable: insertAsset.isAvailable ?? true,
      maintenanceStatus: insertAsset.maintenanceStatus ?? null,
      estimatedReturn: insertAsset.estimatedReturn ?? null
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: number, updateData: Partial<InsertAsset>): Promise<Asset | undefined> {
    const asset = this.assets.get(id);
    if (!asset) return undefined;
    
    const updatedAsset = { ...asset, ...updateData };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByAsset(assetId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.assetId === assetId);
  }

  async getBookingsByDate(date: string): Promise<Booking[]> {
    const targetDate = new Date(date).toDateString();
    return Array.from(this.bookings.values()).filter(booking => 
      booking.bookingDate.toDateString() === targetDate
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      bookingDate: new Date(insertBooking.bookingDate),
      status: "pending",
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: number, updateData: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { 
      ...booking, 
      ...updateData,
      bookingDate: updateData.bookingDate ? new Date(updateData.bookingDate) : booking.bookingDate
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemStorage();
