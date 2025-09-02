import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { communityAPI, APIResponse, APIError } from '../lib/api/communityClient';
import { CommunityData } from '@shared/schema';
import { API_CONFIG } from '../lib/api/config';

interface UseCommunityDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
  retryCount?: number;
  onSuccess?: (data: CommunityData) => void;
  onError?: (error: APIError) => void;
}

interface UseCommunityDataReturn {
  data: CommunityData | null;
  error: APIError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  dataSource: 'live' | 'cached' | 'fallback' | null;
  lastUpdated: Date | null;
  retry: () => void;
  refetch: () => void;
  clearCache: () => void;
}

export function useCommunityData(options: UseCommunityDataOptions = {}): UseCommunityDataReturn {
  const {
    enabled = true,
    refetchInterval = 5 * 60 * 1000, // 5 minutes
    retryCount = 2,
    onSuccess,
    onError
  } = options;

  const queryClient = useQueryClient();
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'fallback' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Enhanced fetch function with better error handling
  const fetchCommunityData = useCallback(async (): Promise<CommunityData> => {
    try {
      const response: APIResponse<CommunityData> = await communityAPI.fetchCommunityData();

      if (response.error) {
        throw response.error;
      }

      if (response.data) {
        // Cache successful response
        communityAPI.cacheResponse(response.data);

        // Update metadata
        setDataSource(response.metadata.source);
        setLastUpdated(response.metadata.timestamp);

        // Call success callback
        onSuccess?.(response.data);

        return response.data;
      }

      throw new Error('No data received from API');
    } catch (error) {
      console.error('Community data fetch failed:', error);

      // Try to get cached data
      const cached = getCachedData();
      if (cached) {
        setDataSource('cached');
        setLastUpdated(cached.timestamp);
        return cached.data;
      }

      // Call error callback
      if (error && typeof error === 'object' && 'code' in error) {
        onError?.(error as APIError);
      }

      throw error;
    }
  }, [onSuccess, onError]);

  // Main query
  const {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['community-data'],
    queryFn: fetchCommunityData,
    enabled,
    refetchInterval,
    retry: (failureCount, error) => {
      // Custom retry logic
      if (failureCount >= retryCount) return false;

      // Don't retry certain error types
      if (error && typeof error === 'object' && 'retryable' in error) {
        return (error as unknown as APIError).retryable !== false;
      }

      return true;
    },
    retryDelay: (attemptIndex) => {
      setRetryAttempts(attemptIndex + 1);
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Enhanced retry function
  const retry = useCallback(() => {
    console.log('Manual retry triggered for community data');
    setRetryAttempts(0);
    refetch();
  }, [refetch]);

  // Clear cache function
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(API_CONFIG.FALLBACK_DATA.CACHE_KEY);
        queryClient.invalidateQueries({ queryKey: ['community-data'] });
        setDataSource(null);
        setLastUpdated(null);
        console.log('Community data cache cleared');
      } catch (error) {
        console.warn('Failed to clear cache:', error);
      }
    }
  }, [queryClient]);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored - refetching community data');
      refetch();
    };

    const handleOffline = () => {
      console.log('Network connection lost - using cached data if available');
      setDataSource('cached');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refetch]);

  // Log status changes for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Community Data Status:', {
        isLoading,
        isError,
        isSuccess,
        dataSource,
        lastUpdated: lastUpdated?.toISOString(),
        retryAttempts,
        hasData: !!data,
        error: error?.message
      });
    }
  }, [isLoading, isError, isSuccess, dataSource, lastUpdated, retryAttempts, data, error]);

  return {
    data: data || null,
    error: error as APIError | null,
    isLoading: isLoading || isRefetching,
    isError,
    isSuccess,
    dataSource,
    lastUpdated,
    retry,
    refetch,
    clearCache
  };
}

// Helper function to get cached data
function getCachedData(): { data: CommunityData; timestamp: Date } | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(API_CONFIG.FALLBACK_DATA.CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const cacheAge = Date.now() - parsed.timestamp;

    // Check if cache is still fresh
    if (cacheAge > API_CONFIG.COMMUNITY_API.CACHE_TTL) {
      localStorage.removeItem(API_CONFIG.FALLBACK_DATA.CACHE_KEY);
      return null;
    }

    return {
      data: parsed.data,
      timestamp: new Date(parsed.timestamp)
    };
  } catch (error) {
    console.warn('Cache retrieval failed:', error);
    return null;
  }
}

// Hook for monitoring API health
export function useAPIHealth() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      setLastChecked(new Date());
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      // Quick health check - just HEAD request to Kevin Depot
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(API_CONFIG.COMMUNITY_API.BASE_URL, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setLastChecked(new Date());

      return {
        healthy: response.ok,
        status: response.status,
        lastChecked: new Date()
      };
    } catch (error) {
      setLastChecked(new Date());
      return {
        healthy: false,
        status: 0,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, []);

  return {
    isOnline,
    lastChecked,
    checkHealth
  };
}
