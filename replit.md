# Replit.md

## Overview

This is a React-based web application showcasing "The Kevin Saga" - a Bitcoin Stamps meme centered around a mysterious stamp that self-replicated on the Bitcoin blockchain. The project features a retro-gaming aesthetic with pixel art styling, terminal animations, and cyberpunk-inspired design elements. It displays information about Kevin stamps, community-generated content, and the KEVIN SRC-20 token.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for development and build tooling
- **Routing**: wouter for client-side routing (lightweight React Router alternative)
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom pixel-art themed design system
- **State Management**: TanStack Query for server state management
- **Typography**: Custom pixel fonts (Orbitron, Share Tech Mono) with retro gaming aesthetic

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Development Setup**: Vite middleware integration for hot reloading
- **API Structure**: RESTful endpoints under `/api/*` routes
- **Data Storage**: In-memory storage with file-based fallbacks for development

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Simple user management schema with UUID primary keys
- **Environment**: Neon Database serverless PostgreSQL (production ready)
- **Migrations**: Drizzle Kit for schema management

### Component Architecture
- **Design System**: Pixel-art inspired components with terminal/retro gaming theme
- **Layout**: Responsive grid-based layouts with mobile-first approach
- **Animations**: CSS-based pixel animations and terminal text effects
- **Image Handling**: Direct integration with stampchain.io API for stamp images

### Page Structure
- **Home** (`/`): Hero section with Kevin saga overview and featured content
- **Stamps** (`/stamps`): Gallery of all 91 Kevin stamps with external links
- **Community** (`/community`): User-generated memes and artwork gallery
- **Token** (`/token`): KEVIN SRC-20 token information and statistics

### API Endpoints
- `GET /api/stamps` - Returns Kevin stamp numbers and image URLs
- `GET /api/token` - Returns KEVIN token statistics and market data
- `GET /api/community` - Returns community-generated content metadata

## External Dependencies

### Third-Party Services
- **Stampchain.io**: Primary data source for Bitcoin Stamps images and metadata
- **OpenStamp.io**: Trading platform integration for KEVIN token (placeholder)
- **Neon Database**: Serverless PostgreSQL hosting
- **Cloudflare Stream**: Video hosting for community content

### Key Libraries
- **UI Components**: Radix UI primitives for accessibility-compliant components
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Forms**: React Hook Form with Zod validation schemas
- **Query Management**: TanStack Query for server state and caching
- **Development**: Replit-specific plugins for runtime error handling and cartographer integration

### Asset Management
- **Fonts**: Google Fonts (Orbitron, Share Tech Mono) for pixel-perfect typography
- **Images**: External stamp images served directly from stampchain.io API
- **Static Assets**: Attached assets directory for local content and documentation

### Build & Deployment
- **Bundler**: Vite with React plugin and TypeScript support
- **Server Build**: esbuild for production server bundling
- **Environment**: Environment variables for database connections and API endpoints
- **Process Management**: Node.js with ES modules for both client and server code