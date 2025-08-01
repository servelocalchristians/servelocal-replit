# ServeConnect - Volunteer Opportunity Platform

## Overview

ServeConnect is a full-stack web application that connects volunteers with churches and organizations to find and manage volunteer opportunities. The platform enables churches to post volunteer opportunities and volunteers to discover and sign up for service opportunities in their community.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL storage

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Database Client**: @neondatabase/serverless with WebSocket support
- **Schema Location**: Shared between client and server (`shared/schema.ts`)
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Authentication System
- Replit Auth integration for seamless user authentication
- OpenID Connect (OIDC) flow with automatic user creation
- Session-based authentication with PostgreSQL session store
- Protected routes and middleware for API endpoints

### User Management
- User profiles with skills, location, and preferences
- Organization membership with role-based access
- Volunteer history and statistics tracking

### Organization Management
- Church/organization registration and verification
- Organization ownership and member management
- Role-based permissions within organizations

### Opportunity Management
- Creation and management of volunteer opportunities
- Categories, skill requirements, and scheduling
- Volunteer signup and status tracking
- Progress tracking for opportunity fulfillment

### Data Models
Key entities include:
- **Users**: Authentication, profiles, and volunteer history
- **Organizations**: Churches and nonprofits posting opportunities
- **Opportunities**: Volunteer positions with details and requirements
- **Volunteer Signups**: User registrations for specific opportunities
- **Organization Members**: Relationship between users and organizations

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth OIDC, sessions stored in PostgreSQL
2. **Organization Registration**: Organizations register and are verified before posting opportunities
3. **Opportunity Discovery**: Volunteers browse and filter opportunities by category, location, skills
4. **Signup Process**: Volunteers sign up for opportunities with status tracking
5. **Management Dashboard**: Organizations manage their opportunities and volunteer signups

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database client with WebSocket support
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **express**: Web server framework
- **passport**: Authentication middleware (configured for OIDC)
- **connect-pg-simple**: PostgreSQL session store

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation library
- **tailwindcss**: Utility-first CSS framework
- **@radix-ui/***: Accessible UI component primitives

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Express server running on Node.js with tsx
- PostgreSQL database (Neon serverless)
- Environment variables for database connection and session secrets

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Static file serving through Express in production
- Database migrations handled through Drizzle Kit

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key
- **REPL_ID**: Replit environment identifier
- **ISSUER_URL**: OIDC provider URL (defaults to replit.com/oidc)

The application uses a monorepo structure with shared TypeScript schemas between client and server, ensuring type safety across the full stack.

## Recent Changes

### Bug Fixes
- **Authentication Flow (January 2025)**: Fixed 404 error after user registration by ensuring `/auth` route is available for both authenticated and non-authenticated users
- **Navigation Security**: Updated navbar to only show "Find Opportunities" and "For Nonprofits" links to authenticated users
- **Sign-in Flow**: Fixed Sign In button to properly focus on Login tab instead of Register tab
- **Responsive Design**: Improved spacing and mobile layouts across auth, opportunities, church-dashboard, and create-opportunity pages