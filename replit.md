# ServeConnect - Volunteer Opportunity Platform

## Overview

ServeConnect is a full-stack web application that connects volunteers with churches and organizations to find and manage volunteer opportunities. The platform enables churches to post volunteer opportunities and allows individuals to discover and sign up for community service activities.

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
- Multi-member organizations with role assignments
- Organization dashboards for managing opportunities
- Location-based organization discovery

### Opportunity System
- Flexible opportunity creation with categories and requirements
- Date/time scheduling with volunteer capacity limits
- Skill-based matching and filtering
- Real-time signup tracking and status updates

### Data Models
- Users: Profile information, authentication data
- Organizations: Church/nonprofit details, verification status
- Opportunities: Volunteer positions with requirements and scheduling
- Volunteer Signups: User-opportunity relationships with status tracking
- Organization Members: Role-based organization access

## Data Flow

1. **Authentication Flow**: User authenticates via Replit Auth → OIDC verification → Session creation → User profile lookup/creation
2. **Opportunity Discovery**: Frontend queries opportunities API → Backend filters by location/category → Returns enriched data with organization details
3. **Signup Process**: User selects opportunity → Frontend validates capacity → Backend creates signup record → Real-time updates to opportunity status
4. **Organization Management**: Church admin creates organization → Verification process → Opportunity creation and management → Member management

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **@radix-ui/***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm & drizzle-kit**: Type-safe database operations and migrations
- **express & passport**: Server framework and authentication
- **react-hook-form & zod**: Form handling and validation

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundling for production

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Code navigation in Replit environment
- **Replit Auth**: Built-in authentication service

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot module replacement
- tsx for running TypeScript server code directly
- Automatic Replit integration for seamless development

### Production Build
- Frontend: Vite build to static assets in `dist/public`
- Backend: ESBuild bundling of server code to `dist/index.js`
- Single-command deployment with `npm run build && npm start`

### Database Management
- Environment-based database URL configuration
- Automated schema migrations with `drizzle-kit push`
- Session storage handled automatically via connect-pg-simple

### Architecture Decisions

**Monorepo Structure**: Chosen for shared TypeScript types and schema definitions between client and server, reducing duplication and ensuring type safety across the stack.

**Drizzle ORM**: Selected over alternatives like Prisma for its lightweight nature, excellent TypeScript support, and schema-first approach that works well with the shared code architecture.

**TanStack Query**: Implemented for robust server state management, caching, and optimistic updates, providing a better user experience than basic fetch calls.

**Replit Auth**: Leveraged for simplified authentication flow, eliminating the need for custom auth implementation while providing enterprise-grade security.

**shadcn/ui + Radix**: Chosen for accessible, customizable components that maintain design consistency while being lightweight compared to full component libraries.