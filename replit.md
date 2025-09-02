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
- **Home** (`/`): Hero section with Kevin saga overview, media appearances, exclusive stamp inquiry form, and featured content
- **Lore** (`/lore`): Comprehensive Kevin mythology, origins, the ghost in the machine story, and television appearances
- **Stamps** (`/stamps`): Gallery of all 91 Kevin stamps with external links
- **Community** (`/community`): User-generated memes and artwork gallery
- **Token** (`/token`): KEVIN SRC-20 token information and statistics

### API Endpoints
- `GET /api/stamps` - Returns Kevin stamp numbers and image URLs
- `GET /api/token` - Returns KEVIN token statistics and market data with dynamic updates (prepared for OpenStamp API integration)
- `GET /api/community` - Returns community-generated content metadata
- `POST /api/kevin-inquiry` - Handles exclusive Kevin stamp acquisition inquiries with validation
- `GET /api/kevin-inquiries` - Admin endpoint to view all submitted inquiries

## External Dependencies

### Third-Party Services
- **Stampchain.io**: Primary data source for Bitcoin Stamps images and metadata
- **OpenStamp.io**: Trading platform integration for KEVIN token (KEVIN/BTC pair)
- **SuperEX.com**: Web3 crypto exchange with KEVIN/USDT trading pair integration
- **Neon Database**: Serverless PostgreSQL hosting
- **Cloudflare Stream**: Video hosting for community content
- **YouTube**: Kevin's media appearances and official "We Are All Kevin" channel integration
- **GitHub**: Bitcoin Stamps repository (https://github.com/stampchain-io) for development resources

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

## 🔧 Replit Integration Strategy

### Replit-Compatible Improvements

#### ✅ SAFE IMPROVEMENTS (No Backend Conflicts)

**1. Frontend Enhancements**
- Add React Error Boundaries for better error handling
- Implement React.lazy() for code splitting (client-side only)
- Add loading states and skeletons
- Improve accessibility with ARIA labels
- Add keyboard navigation support
- Implement proper focus management

**2. Performance Optimizations**
- Add image lazy loading with Intersection Observer
- Implement client-side caching with React Query
- Add service worker for static asset caching
- Optimize Tailwind CSS purging
- Add compression for static assets

**3. Developer Experience**
- Add ESLint configuration (client-side only)
- Implement Prettier for code formatting
- Add TypeScript path mapping validation
- Create component documentation
- Add development-time type checking

**4. User Experience**
- Add offline support for static content
- Implement dark/light theme persistence
- Add progressive enhancement for JavaScript-disabled users
- Improve mobile responsiveness
- Add proper loading states for all async operations

#### ⚠️ CONDITIONAL IMPROVEMENTS (Requires Testing)

**5. API Enhancements**
- Add request/response logging (without changing core logic)
- Implement client-side request caching
- Add API response validation schemas
- Improve error messages (client-side formatting)

**6. Configuration Management**
- Move external URLs to environment variables
- Add configuration validation
- Implement feature flags for development/production

#### ❌ AVOID - Backend Changes That Could Break Replit

**Critical Restrictions:**
- Do NOT modify Express server startup logic
- Do NOT change PORT environment variable handling
- Do NOT alter Vite middleware integration
- Do NOT modify the core routing structure
- Do NOT change database connection patterns
- Do NOT add new server dependencies without testing

### Replit Workflow Integration

#### Using Replit Tools

**1. Replit Agent**
```bash
# Use for code analysis and suggestions
@agent analyze this component for performance issues
@agent suggest accessibility improvements
```

**2. Replit Assistant**
```bash
# Use for pair programming
@assistant help me optimize this React component
@assistant review this TypeScript interface
```

**3. Replit Secrets**
```bash
# Store sensitive configuration
EXTERNAL_API_TIMEOUT=10000
KEVIN_DEPO_URL=https://memedepot.com/d/kevin-depot
STAMPCHAIN_BASE_URL=https://stampchain.io
```

**4. Replit Workflows**
```yaml
# .replit/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Deploy
        run: echo "Deployment complete"
```

### Development Workflow

#### 1. Local Development (Replit)
```bash
# Use Replit's built-in terminal
npm run dev
# Server runs on Replit's assigned port
```

#### 2. Code Quality Checks
```bash
# Add to package.json scripts (client-side only)
"lint": "eslint client/src --ext .ts,.tsx",
"format": "prettier --write client/src/**/*.{ts,tsx}",
"type-check": "tsc --noEmit --project client/tsconfig.json"
```

#### 3. Testing Strategy
```bash
# Component testing (no server dependencies)
npm test -- --testPathPattern=client
```

### Deployment Strategy

#### Replit Deployment Best Practices

**1. Environment Variables**
```bash
# In Replit Secrets (not .env files)
NODE_ENV=production
PORT=<replit-assigned-port>
DATABASE_URL=<neon-connection-string>
```

**2. Build Optimization**
```json
// vite.config.ts (Replit-compatible)
export default defineConfig({
  build: {
    sourcemap: false, // Reduce bundle size
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

**3. Performance Monitoring**
```typescript
// Add to client-side code only
if (typeof window !== 'undefined') {
  // Client-side performance monitoring
  window.addEventListener('load', () => {
    // Performance metrics
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
  });
}
```

### Error Handling Strategy

#### Client-Side Error Boundaries
```typescript
// components/ErrorBoundary.tsx (SAFE)
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console only (Replit-compatible)
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Monitoring & Analytics

#### Replit-Compatible Monitoring
```typescript
// Client-side analytics (no server impact)
const trackPageView = (page) => {
  if (typeof window !== 'undefined') {
    console.log(`Page view: ${page}`);
    // Could integrate with Replit Analytics if available
  }
};
```

### Migration Strategy

#### Phase 1: Safe Frontend Improvements
1. ✅ Add Error Boundaries
2. ✅ Implement code splitting
3. ✅ Add loading states
4. ✅ Improve accessibility
5. ✅ Add performance monitoring

#### Phase 2: Configuration Improvements
1. ✅ Move URLs to environment variables
2. ✅ Add configuration validation
3. ✅ Implement feature flags

#### Phase 3: Testing & Validation
1. ✅ Add client-side testing
2. ✅ Performance testing
3. ✅ Accessibility testing

### Risk Assessment

#### Low Risk ✅
- Frontend component improvements
- Client-side performance optimizations
- Code formatting and linting
- Documentation improvements

#### Medium Risk ⚠️
- Environment variable changes
- Build configuration modifications
- New client-side dependencies

#### High Risk ❌
- Server-side code modifications
- Database schema changes
- API endpoint modifications
- Build process changes

This strategy ensures we improve the KEVIN Stamp website while maintaining full Replit compatibility and avoiding any backend conflicts.