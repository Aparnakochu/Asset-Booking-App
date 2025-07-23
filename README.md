# Asset-Booking-App

A full-stack web application for managing laboratory equipment booking. This platform allows lab technicians and engineers to browse available calibration equipment, check availability, and book time slots with a clean, intuitive interface.

![Asset Booking Platform](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.0-green)

## 🚀 Features

### Core Functionality
- **Equipment Browsing**: View all available laboratory assets with detailed information
- **Real-time Availability**: Check equipment availability by date with time slot visualization
- **Smart Booking System**: Select dates, time slots, and submit booking requests
- **Status Tracking**: Monitor calibration status, maintenance schedules, and availability
- **Search & Filter**: Find equipment by name, asset ID, category, or status

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Interface**: Clean, modern UI designed for lab technicians
- **Form Validation**: Comprehensive validation using Zod schema validation
- **Real-time Updates**: Automatic cache invalidation and UI updates
- **Loading States**: Skeleton loading for better perceived performance

### Technical Features
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Data Validation**: Runtime validation with Zod schemas
- **Modern Stack**: React 18, Express.js, and PostgreSQL ready
- **Hot Reload**: Development server with instant updates
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety across the application
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Performant form handling
- **Radix UI** - Accessible, unstyled UI primitives
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Beautiful, customizable icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Schema validation and type inference

### Database & Storage
- **PostgreSQL** - Production database (Neon serverless ready)
- **In-Memory Storage** - Development mode with sample data
- **Drizzle Kit** - Database migrations and schema management

### Development Tools
- **Vite** - Lightning-fast build tool and dev server
- **ESBuild** - Fast TypeScript compilation
- **Hot Module Replacement** - Instant development updates

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- PostgreSQL database (for production)

## 🚦 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd asset-booking-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database URL (optional for development)
DATABASE_URL=postgresql://username:password@localhost:5432/asset_booking
```

### 4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Architecture

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
│   └── index.html         # HTML template
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Development server integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and validation
└── package.json          # Project dependencies and scripts
```

### Data Flow
1. **Asset Discovery**: Frontend fetches equipment list from `/api/assets`
2. **Availability Check**: Real-time availability lookup for selected dates
3. **Booking Submission**: Form validation and submission to `/api/bookings`
4. **State Updates**: Automatic cache invalidation and UI refresh

## 📊 Database Schema

### Assets Table
- `id` - Primary key
- `assetId` - Unique asset identifier (e.g., "OSC-001")
- `name` - Equipment name
- `description` - Detailed description
- `location` - Physical location (e.g., "Lab B-204")
- `category` - Equipment category
- `calibrationStatus` - Current calibration state
- `lastCalibrated` - Last calibration date
- `nextDue` - Next calibration due date
- `isAvailable` - Current availability status
- `maintenanceStatus` - Maintenance state
- `estimatedReturn` - Expected return date

### Bookings Table
- `id` - Primary key
- `assetId` - Foreign key to assets
- `userEmail` - Booking contact email
- `purpose` - Booking purpose description
- `bookingDate` - Selected booking date
- `timeSlot` - Selected time slot
- `duration` - Booking duration in hours
- `status` - Booking status (pending/confirmed/cancelled)
- `createdAt` - Booking creation timestamp

## 🔌 API Endpoints

### Assets
- `GET /api/assets` - List all assets with filtering
- `GET /api/assets/:id` - Get specific asset details
- `GET /api/assets/:id/availability/:date` - Check available time slots

### Bookings
- `POST /api/bookings` - Create new booking request
- `GET /api/bookings` - List all bookings

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎨 Component Library

### Core Components
- **AssetCard** - Equipment display with status indicators
- **BookingPanel** - Interactive booking form with validation
- **StatsDashboard** - Overview statistics and metrics
- **SearchFilter** - Equipment search and filtering interface

### UI Components (Shadcn/UI)
- Form components with validation
- Select dropdowns and inputs
- Cards, buttons, and badges
- Dialog modals and toasts
- Loading skeletons

## 🧪 Sample Data

The application includes realistic sample data:
- **6 Laboratory Assets**: Oscilloscopes, multimeters, power supplies, signal generators
- **Calibration History**: Realistic calibration dates and schedules
- **Availability Simulation**: Dynamic time slot generation
- **Status Indicators**: Various equipment states and conditions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Configuration
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production)

### Database Setup
```bash
# Push schema to database
npm run db:push

# Generate migrations (if needed)
npm run db:generate
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:push` - Apply database schema
- `npm run db:generate` - Generate migration files

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Tailwind CSS for styling

## 📱 User Guide

### For Lab Technicians
1. **Browse Equipment**: View available calibration equipment with status indicators
2. **Check Availability**: Select equipment and choose your preferred date
3. **Book Time Slots**: Pick available time slots and specify duration
4. **Submit Requests**: Provide contact details and booking purpose
5. **Track Status**: Monitor booking confirmations and equipment availability

### Equipment Status Indicators
- 🟢 **Calibrated** - Equipment ready for use
- 🟡 **Due Soon** - Calibration due within 30 days
- 🔴 **Maintenance** - Equipment under maintenance
- ⚪ **Available** - Ready for booking
- ⚫ **In Use** - Currently booked

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
