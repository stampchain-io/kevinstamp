// API Configuration - Replit-compatible client-side config
export const API_CONFIG = {
  COMMUNITY_API: {
    BASE_URL: 'https://memedepot.com/d/kevin-depot',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    RETRY_DELAY: 1000, // 1 second
  },
  FALLBACK_DATA: {
    STATIC_MEMES: '/static/community-fallback.json',
    OFFLINE_MESSAGE: 'Community content temporarily unavailable',
    CACHE_KEY: 'kevin-community-cache',
  },
  MONITORING: {
    ENABLED: true,
    LOG_LEVEL: 'info', // 'debug' | 'info' | 'warn' | 'error'
    TRACK_PERFORMANCE: true,
  }
} as const;

// Environment-aware configuration (Replit-compatible)
export const getEnvConfig = () => {
  // Client-side environment detection
  const isDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.port === '5000');

  return {
    ...API_CONFIG,
    ENVIRONMENT: isDevelopment ? 'development' : 'production',
    DEBUG_MODE: isDevelopment || (API_CONFIG.MONITORING.LOG_LEVEL as string) === 'debug',
  };
};
