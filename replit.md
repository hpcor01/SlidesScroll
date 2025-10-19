# Slides Management Application

## Overview

A slides management system built with React, Express, and PostgreSQL that enables users to create, view, and manage presentation slides with intelligent duplicate detection. The application features a clean, productivity-focused interface inspired by tools like Linear and Notion, with paginated slide viewing and real-time duplicate checking during content creation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Shadcn UI component library built on Radix UI primitives
- Tailwind CSS for styling with custom design system

**Key Design Decisions:**
- **Component-Based Architecture**: Uses shadcn/ui's "new-york" style variant for consistent, professional UI components
- **Form Management**: React Hook Form with Zod schema validation for type-safe form handling
- **State Management**: TanStack Query handles server state with disabled refetch on window focus and infinite stale time for optimal performance
- **Styling Approach**: Utility-first CSS with Tailwind, custom CSS variables for theming, and productivity-focused design system emphasizing information density and clarity
- **Real-time Duplicate Detection**: Debounced API calls check for content similarity as users type (minimum 20 characters required)

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Drizzle ORM for database interactions
- Neon serverless PostgreSQL database
- In-memory storage fallback for development

**Key Design Decisions:**
- **Dual Storage Strategy**: Implements `IStorage` interface with both in-memory (`MemStorage`) and database implementations for flexibility
- **RESTful API Design**: Clean API endpoints under `/api` prefix with JSON request/response format
- **Request Logging**: Custom middleware logs all API requests with timing information (truncated to 80 characters)
- **Error Handling**: Centralized error handler middleware with status code normalization
- **Development Mode**: Vite middleware integration for HMR during development, static file serving in production

**API Endpoints:**
- `GET /api/slides` - Paginated slide retrieval (supports `page` and `perPage` query params)
- `GET /api/slides/check-duplicate` - Duplicate detection (requires `texto` and optional `assunto` params)
- `POST /api/slides` - Slide creation

### Database Schema

**Tables:**
- `slides` table with columns:
  - `id`: Primary key (UUID, auto-generated)
  - `assunto`: Text field for slide subject/topic (required)
  - `texto`: Text field for slide content (required)
  - `autor`: Text field for author name (required)
  - `data`: Timestamp with automatic defaulting to current time

**Schema Management:**
- Drizzle Kit for migrations (output to `./migrations`)
- Drizzle-Zod integration for automatic Zod schema generation from database schema
- Type-safe database operations with TypeScript inference

### Duplicate Detection Algorithm

**Implementation:**
- Uses `string-similarity` library for text comparison
- Configurable similarity threshold (default: 0.5 or 50%)
- Returns matches sorted by similarity score (highest first)
- Considers both slide content (`texto`) and subject (`assunto`) for matching
- Client-side debouncing prevents excessive API calls during typing

### Build and Deployment

**Development:**
- Hot Module Replacement via Vite middleware
- Concurrent client/server TypeScript type checking
- Custom error modal overlay for runtime errors (Replit integration)

**Production:**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.js` (ESM format)
- Static file serving from built client directory
- Environment-based configuration (NODE_ENV)

**Build Commands:**
- `npm run dev` - Development server with HMR
- `npm run build` - Production build (client + server)
- `npm run start` - Production server
- `npm run db:push` - Push database schema changes

## External Dependencies

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (accordions, dialogs, dropdowns, popovers, tooltips, etc.)
- **Shadcn UI**: Pre-styled components built on Radix with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

### Database & ORM
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL database (`@neondatabase/serverless`)
- **Drizzle ORM**: Type-safe SQL query builder with PostgreSQL dialect
- **Drizzle Kit**: Schema management and migration tool
- **Drizzle-Zod**: Automatic Zod schema generation from Drizzle schemas

### Utility Libraries
- **string-similarity**: Text similarity calculation for duplicate detection
- **date-fns**: Date formatting and manipulation
- **clsx + tailwind-merge**: Conditional CSS class composition
- **class-variance-authority**: Type-safe component variant management
- **nanoid**: Unique ID generation

### Development Tools
- **Vite**: Build tool with fast HMR and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for server code
- **Replit Plugins**: Runtime error modal, cartographer, and dev banner for Replit environment

### Form & Validation
- **React Hook Form**: Performant form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Zod integration for React Hook Form

### Session & Security
- **connect-pg-simple**: PostgreSQL session store (included but session implementation not visible in provided code)