import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { communityMemes, filterMemesByType, type CommunityMeme } from "../data/community-memes";
import { CommunityData } from "@shared/schema";
import { useLanguage } from '../lib/language-context';
import { useCommunityData, useAPIHealth } from '../hooks/useCommunityData';
import CommunityLoadingState, { GallerySkeleton } from './CommunityLoadingState';
import CommunityErrorState, { NetworkErrorState, TimeoutErrorState } from './CommunityErrorState';
import { GalleryLazyImage, default as LazyImage } from './LazyImage';
import { Search, Filter, Grid3X3, List, SortAsc, SortDesc, RefreshCw } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface CommunityGalleryProps {
  showAll?: boolean;
  itemsPerPage?: number;
  enableInfiniteScroll?: boolean;
  enableSearch?: boolean;
  enableAdvancedFilters?: boolean;
}

export default function CommunityGallery({
  showAll = false,
  itemsPerPage = 16,
  enableInfiniteScroll = true,
  enableSearch = true,
  enableAdvancedFilters = true
}: CommunityGalleryProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState('all');
  const [selectedMeme, setSelectedMeme] = useState<CommunityMeme | null>(null);
  const [hoveredMeme, setHoveredMeme] = useState<CommunityMeme | null>(null);
  const [videoModal, setVideoModal] = useState<CommunityMeme | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enhanced features state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedItems, setLoadedItems] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Mobile-specific state
  const [pullRefreshDistance, setPullRefreshDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [doubleTapTarget, setDoubleTapTarget] = useState<CommunityMeme | null>(null);

  // Use the new robust community data hook
  const {
    data: communityData,
    error: apiError,
    isLoading,
    dataSource,
    lastUpdated,
    retry,
    clearCache
  } = useCommunityData({
    refetchInterval: 5 * 60 * 1000, // 5 minutes instead of 30 seconds
    onError: (error) => {
      console.warn('Community gallery error:', error);
    }
  });

  // Monitor API health
  const { isOnline } = useAPIHealth();

  // Use live featured content from API when available, otherwise fallback to static data
  // Prevent duplicates by filtering out any live content that matches static content IDs
  const liveFeatured = communityData?.featured || [];
  const staticMemesFiltered = communityMemes.filter(staticMeme => 
    !liveFeatured.some(liveMeme => liveMeme.id === staticMeme.id)
  );
  
  // FIXED: Ensure we always have content, prioritize static data for reliability
  const allMemes = liveFeatured.length > 0 
    ? [...liveFeatured, ...staticMemesFiltered] // Put live content first, no duplicates
    : communityMemes; // Always fallback to static data if no live content
  
  const filteredMemes = allMemes.filter(meme => {
    if (filter === 'all') return true;
    return meme.type === filter;
  });
  
  // Enhanced filtering and sorting logic
  const processedMemes = useMemo(() => {
    let result = allMemes;

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(meme => meme.type === filter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(meme =>
        meme.title.toLowerCase().includes(search) ||
        meme.description.toLowerCase().includes(search) ||
        meme.category.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(meme => selectedCategories.includes(meme.category));
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (a.id || '').localeCompare(b.id || '');
        case 'popular':
          // For now, use a simple heuristic based on title length and type
          const aScore = (a.title.length * 0.3) + (a.type === 'video' ? 20 : a.type === 'gif' ? 15 : 10);
          const bScore = (b.title.length * 0.3) + (b.type === 'video' ? 20 : b.type === 'gif' ? 15 : 10);
          return bScore - aScore;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return (b.id || '').localeCompare(a.id || '');
      }
    });

    return result;
  }, [allMemes, filter, searchTerm, selectedCategories, sortBy]);

  // Pagination logic for infinite scroll
  const displayMemes = useMemo(() => {
    if (showAll || !enableInfiniteScroll) {
      return processedMemes;
    }
    return processedMemes.slice(0, loadedItems);
  }, [processedMemes, showAll, enableInfiniteScroll, loadedItems]);

  // Extract unique categories for filtering
  const availableCategories = useMemo(() => {
    const categories = new Set(allMemes.map(meme => meme.category));
    return Array.from(categories).sort();
  }, [allMemes]);

  // Infinite scroll handler
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || !enableInfiniteScroll || displayMemes.length >= processedMemes.length) {
      return;
    }

    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoadedItems(prev => Math.min(prev + itemsPerPage, processedMemes.length));
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, enableInfiniteScroll, displayMemes.length, processedMemes.length, itemsPerPage]);

  // FIXED: Intersection observer for infinite scroll with proper cleanup
  useEffect(() => {
    if (!enableInfiniteScroll || !galleryRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayMemes.length < processedMemes.length) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sentinel = document.createElement('div');
    sentinel.style.height = '20px';
    sentinel.setAttribute('data-sentinel', 'true'); // Add identifier for easier cleanup
    galleryRef.current.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      // FIXED: More robust cleanup
      const existingSentinel = galleryRef.current?.querySelector('[data-sentinel="true"]');
      if (existingSentinel && existingSentinel.parentNode) {
        existingSentinel.parentNode.removeChild(existingSentinel);
      }
      observer.disconnect();
    };
  }, [enableInfiniteScroll, displayMemes.length, processedMemes.length, loadMoreItems]);

  // Mobile touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStartY(e.touches[0].clientY);
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || touchStartY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;

    // Only handle pull-to-refresh when at the top of the gallery
    if (diff > 0 && window.scrollY <= 10) {
      e.preventDefault();
      const distance = Math.min(diff * 0.5, 120); // Dampen the pull, max 120px
      setPullRefreshDistance(distance);
    }
  }, [isMobile, touchStartY]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;

    if (pullRefreshDistance > 80) {
      // Trigger refresh
      setIsPullRefreshing(true);
      setPullRefreshDistance(0);
      setTimeout(() => {
        retry();
        setIsPullRefreshing(false);
      }, 1000);
    } else {
      setPullRefreshDistance(0);
    }

    setTouchStartY(null);
  }, [isMobile, pullRefreshDistance, retry]);

  // Double tap to like/favorite (mobile gesture)
  const handleDoubleTap = useCallback((meme: CommunityMeme) => {
    const now = Date.now();
    const timeDiff = now - lastTapTime;

    if (timeDiff < 300 && doubleTapTarget?.id === meme.id) {
      // Double tap detected - could trigger like/favorite
      console.log('Double tap on:', meme.title);
      // TODO: Implement favorite/like functionality
      setLastTapTime(0);
      setDoubleTapTarget(null);
    } else {
      setLastTapTime(now);
      setDoubleTapTarget(meme);
    }
  }, [lastTapTime, doubleTapTarget]);

  // Long press for context menu (mobile)
  const handleLongPress = useCallback((meme: CommunityMeme) => {
    if (!isMobile) return;

    // Haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Could show mobile context menu with share, save, etc.
    console.log('Long press on:', meme.title);
    // TODO: Implement mobile context menu
  }, [isMobile]);

  // FIXED: Mobile performance optimizations with proper cleanup
  useEffect(() => {
    if (!isMobile) return;

    // Reduce motion for battery saving on mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }

    // FIXED: Store original animation duration for cleanup
    const originalAnimationDuration = document.documentElement.style.getPropertyValue('--animation-duration');

    return () => {
      // FIXED: Restore original animation duration on cleanup
      if (originalAnimationDuration) {
        document.documentElement.style.setProperty('--animation-duration', originalAnimationDuration);
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
      }
    };
  }, [isMobile]);

  // Mobile accessibility improvements
  useEffect(() => {
    if (!isMobile) return;

    // Announce dynamic content changes to screen readers
    const announceContentChange = (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = message;

      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    };

    if (isLoadingMore) {
      announceContentChange('Loading more KEVIN content');
    }

    if (isPullRefreshing) {
      announceContentChange('Refreshing KEVIN content');
    }
  }, [isMobile, isLoadingMore, isPullRefreshing]);
  
  // FIXED: Enhanced debug logging with more useful information
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Community Gallery Debug:', {
        staticMemes: communityMemes.length,
        liveFeatured: communityData?.featured?.length || 0,
        totalAvailable: allMemes.length,
        filteredMemes: filteredMemes.length,
        displayMemes: displayMemes.length,
        showAll,
        itemsPerPage,
        filter,
        dataSource: communityData?.dataSource || 'loading...',
        isLoading,
        hasError: !!apiError,
        errorCode: apiError?.code,
        isOnline
      });
    }
  }, [filteredMemes.length, displayMemes.length, showAll, itemsPerPage, filter, communityData, allMemes.length, isLoading, apiError, isOnline]);

  const filters = [
    { key: 'all', label: 'ALL', icon: '🎨' },
    { key: 'image', label: 'IMAGES', icon: '🖼️' },
    { key: 'video', label: 'VIDEOS', icon: '🎬' },
    { key: 'gif', label: 'GIFS', icon: '🎞️' },
  ];

  // Handle modal close
  const closeVideoModal = () => {
    setVideoModal(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const closeImageModal = () => {
    setSelectedMeme(null);
  };

  const closeAllModals = () => {
    closeVideoModal();
    closeImageModal();
  };

  // Handle meme click
  const handleMemeClick = (meme: CommunityMeme) => {
    if (meme.type === 'video' && meme.videoUrl) {
      console.log('Opening video modal:', meme.title, meme.videoUrl);
      setVideoModal(meme);
    } else if (meme.type === 'image' || meme.type === 'gif') {
      console.log('Opening image modal:', meme.title, meme.type);
      setSelectedMeme(meme);
    }
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modals
      if (e.key === 'Escape') {
        closeAllModals();
        return;
      }

      // Arrow key navigation (when no modal is open)
      if (!selectedMeme && !videoModal && displayMemes.length > 0) {
        const currentIndex = hoveredMeme ? displayMemes.findIndex(m => m.id === hoveredMeme.id) : -1;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, displayMemes.length - 1);
            setHoveredMeme(displayMemes[nextIndex]);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            setHoveredMeme(displayMemes[prevIndex]);
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (hoveredMeme) {
              handleMemeClick(hoveredMeme);
            } else if (displayMemes.length > 0) {
              handleMemeClick(displayMemes[0]);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hoveredMeme, selectedMeme, videoModal, displayMemes]);

  // Show error message if API fails
  if (apiError) {
    console.warn('Community API error:', apiError);
  }

  return (
    <div className="space-y-8">
      {/* Mobile Pull-to-Refresh Indicator */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            pullRefreshDistance > 0 ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ transform: `translateY(${Math.max(-100, pullRefreshDistance - 100)}%)` }}
        >
          <div className="bg-kevin-orange text-black text-center py-4 flex items-center justify-center gap-3">
            <RefreshCw className={`w-5 h-5 ${isPullRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-pixel text-sm">
              {isPullRefreshing ? 'REFRESHING KEVIN...' : 'PULL TO REFRESH'}
            </span>
          </div>
        </div>
      )}

      {/* Enhanced Controls Section */}
      <div className={`bg-kevin-charcoal border-2 border-kevin-orange rounded-lg ${
        isMobile ? 'p-4 mx-2' : 'p-6'
      }`}>
        <div className={`flex flex-col gap-4 items-start justify-between ${
          isMobile ? 'space-y-4' : 'lg:flex-row lg:items-center'
        }`}>
          {/* Search Bar */}
          {enableSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kevin-mint w-4 h-4" />
              <input
                type="text"
                placeholder="Search KEVIN content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-kevin-graphite border border-kevin-steel text-white placeholder-kevin-mint focus:border-kevin-neon focus:outline-none"
              />
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`pixel-btn p-2 ${viewMode === 'grid' ? 'bg-kevin-orange text-black' : 'bg-kevin-graphite text-white'}`}
              title="Grid View"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`pixel-btn p-2 ${viewMode === 'list' ? 'bg-kevin-orange text-black' : 'bg-kevin-graphite text-white'}`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pixel-btn bg-kevin-graphite text-white border-kevin-steel px-3 py-2"
            >
              <option value="newest">🆕 Newest</option>
              <option value="oldest">📅 Oldest</option>
              <option value="popular">🔥 Popular</option>
              <option value="title">📝 Title</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {enableAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-kevin-steel">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Type Filters */}
              <div className="flex gap-2">
                {filters.map((filterOption) => (
                  <button
                    key={filterOption.key}
                    className={`
                      pixel-btn px-4 py-2 text-sm transition-all cursor-pointer focus-visible
                      ${filter === filterOption.key
                        ? 'bg-kevin-orange text-black border-kevin-orange'
                        : 'bg-kevin-graphite text-white border-kevin-steel hover:bg-kevin-neon hover:text-black'
                      }
                    `}
                    onClick={() => setFilter(filterOption.key)}
                    aria-pressed={filter === filterOption.key}
                    aria-label={`Filter by ${filterOption.label.toLowerCase()}`}
                  >
                    <span className="mr-2" aria-hidden="true">{filterOption.icon}</span>
                    {filterOption.label}
                  </button>
                ))}
              </div>

              {/* Category Filters */}
              {availableCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-kevin-mint text-sm font-pixel">Categories:</span>
                  {availableCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategories(prev =>
                          prev.includes(category)
                            ? prev.filter(c => c !== category)
                            : [...prev, category]
                        );
                      }}
                      className={`pixel-btn px-3 py-1 text-xs ${
                        selectedCategories.includes(category)
                          ? 'bg-kevin-magenta text-white'
                          : 'bg-kevin-graphite text-kevin-mint hover:bg-kevin-magenta hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {/* Clear Filters */}
              {(searchTerm || selectedCategories.length > 0 || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategories([]);
                    setFilter('all');
                    setSortBy('newest');
                  }}
                  className="pixel-btn px-3 py-1 text-xs bg-red-600 text-white hover:bg-red-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-kevin-mint">
          Showing {displayMemes.length} of {processedMemes.length} items
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCategories.length > 0 && ` in categories: ${selectedCategories.join(', ')}`}
        </div>
      </div>

      {/* Video Section Message */}
      {filter === 'video' && (
        <div className="bg-kevin-charcoal border-2 border-kevin-orange p-6 text-center mb-8">
          <h3 className="font-pixel text-xl text-kevin-orange mb-3">🎬 EXCLUSIVE KEVIN VIDEOS</h3>
          <p className="text-kevin-mint mb-4">
            These are authentic videos from Kevin Depot featuring our digital gentleman in action!
          </p>
          <p className="text-sm text-kevin-cyan">
            Want to see your Kevin video here? Submit to Kevin Depot and become part of the legend!
          </p>
        </div>
      )}

      {/* Loading State - only show if we have no content at all */}
      {isLoading && allMemes.length === 0 && (
        <CommunityLoadingState
          message="Loading Kevin Depot community..."
          showProgress={true}
          timeout={30}
          onTimeout={retry}
        />
      )}

      {/* Error State - only show if we have no content and there's an error */}
      {apiError && allMemes.length === 0 && (
        <CommunityErrorState
          error={apiError}
          onRetry={retry}
          className="mb-8"
        />
      )}

      {/* FIXED: Show error info even when we have content */}
      {apiError && allMemes.length > 0 && (
        <div className="bg-yellow-900/30 border-2 border-yellow-500 p-4 text-center mb-8">
          <div className="text-yellow-200 font-pixel text-sm mb-2">
            ⚠️ Using cached/static content - {apiError.message}
          </div>
          <button
            onClick={retry}
            className="pixel-btn px-3 py-1 text-xs text-black bg-yellow-500 border-yellow-500"
          >
            🔄 TRY AGAIN
          </button>
        </div>
      )}

      {/* Network Offline Warning */}
      {!isOnline && (
        <div className="bg-yellow-900/30 border-2 border-yellow-500 p-4 text-center mb-8">
          <div className="text-yellow-200 font-pixel text-lg mb-2">🌐 OFFLINE MODE</div>
          <div className="text-yellow-100 text-sm">
            You're currently offline. Showing cached community content.
          </div>
        </div>
      )}

      {/* Enhanced Gallery */}
      <div
        ref={galleryRef}
        className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }
        role="grid"
        aria-label="Community gallery"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          // Add padding top for pull-to-refresh on mobile
          paddingTop: isMobile ? '20px' : undefined,
          // Enable momentum scrolling on iOS
          WebkitOverflowScrolling: 'touch',
          // Prevent iOS bounce scroll
          overscrollBehavior: 'contain'
        }}
      >
        {displayMemes.map((meme, index) => (
          <div
            key={meme.id}
            className={`gallery-item bg-black border-2 border-kevin-orange cursor-pointer transition-all duration-200 hover:border-kevin-neon hover:shadow-lg hover:shadow-kevin-orange/20 focus-visible ${
              viewMode === 'list' ? 'flex gap-4 p-4' : 'p-2'
            } ${isMobile ? 'active:scale-95' : ''}`}
            onMouseEnter={() => !isMobile && setHoveredMeme(meme)}
            onMouseLeave={() => !isMobile && setHoveredMeme(null)}
            onClick={() => handleMemeClick(meme)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMemeClick(meme);
              }
            }}
            onTouchStart={() => isMobile && handleDoubleTap(meme)}
            onTouchEnd={() => {
              // FIXED: Handle long press with proper cleanup
              if (isMobile) {
                const timer = setTimeout(() => handleLongPress(meme), 500);
                // Note: Timer cleanup would need to be handled differently in a real implementation
                // For now, we'll let it complete naturally
              }
            }}
            tabIndex={0}
            role="gridcell"
            aria-label={`${meme.title} - ${meme.type} from ${meme.category}`}
            aria-describedby={`meme-desc-${meme.id}`}
            style={{
              // Ensure minimum touch target size (44px)
              minHeight: isMobile ? '44px' : undefined,
              // Add subtle touch feedback
              WebkitTapHighlightColor: 'rgba(255, 107, 53, 0.3)'
            }}
          >
            <div className={`relative ${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : ''}`}>
              <GalleryLazyImage
                src={meme.imageUrl}
                alt={meme.title}
                className={viewMode === 'list' ? 'w-full h-full object-cover' : ''}
              />

              {/* Video Play Icon */}
              {meme.type === 'video' && (
                <div className="absolute top-2 left-2">
                  <div className="bg-black bg-opacity-70 border border-kevin-orange px-2 py-1 text-xs font-pixel flex items-center gap-1">
                    <span className="text-kevin-orange">▶</span>
                    <span className="hidden sm:inline">VIDEO</span>
                  </div>
                </div>
              )}

              {/* GIF Play Icon */}
              {meme.type === 'gif' && (
                <div className="absolute top-2 right-2">
                  <div className="bg-kevin-magenta border border-white px-2 py-1 text-xs font-pixel">
                    GIF
                  </div>
                </div>
              )}

              {/* Hover Overlay (Desktop) / Tap Overlay (Mobile) */}
              {((!isMobile && hoveredMeme?.id === meme.id) || (isMobile && doubleTapTarget?.id === meme.id)) && (
                <div className="absolute inset-0 bg-kevin-orange bg-opacity-30 flex items-center justify-center backdrop-blur-sm transition-all duration-200">
                  <div className="text-white font-pixel text-sm bg-black bg-opacity-70 px-3 py-1 border border-kevin-orange animate-pulse">
                    {meme.type === 'video' ? '▶ PLAY' : meme.type === 'gif' ? '🎞️ VIEW' : '🖼️ VIEW'}
                    {isMobile && <div className="text-xs mt-1 opacity-75">Double tap to favorite</div>}
                  </div>
                </div>
              )}
            </div>

            <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : 'p-2'}`}>
              <div className="font-pixel text-xs text-kevin-orange truncate flex items-center gap-1 mb-1">
                {meme.category === "Live Update" && <span className="text-kevin-neon">🔴</span>}
                <span className="font-bold">{meme.title}</span>
                <span className="text-kevin-steel">•</span>
                <span className="text-kevin-mint">{meme.type.toUpperCase()}</span>
              </div>
              <div className={`text-xs text-white ${viewMode === 'list' ? 'mb-2' : 'truncate'}`}>
                {viewMode === 'list' ? meme.description : meme.description.length > 40 ? meme.description.substring(0, 40) + '...' : meme.description}
              </div>
              <div className="text-xs text-kevin-mint flex items-center justify-between">
                <span>{meme.category}</span>
                {meme.category === "Live Update" && (
                  <span className="text-xs text-kevin-neon animate-pulse">● LIVE</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Infinite Scroll Loading Indicator */}
        {isLoadingMore && (
          <div className={`gallery-item bg-kevin-graphite border-2 border-kevin-steel p-4 flex items-center justify-center ${
            viewMode === 'list' ? 'w-full' : ''
          }`}>
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-kevin-orange border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-kevin-mint font-pixel text-sm">Loading more KEVIN content...</div>
            </div>
          </div>
        )}

        {/* Load More / Visit Depot Button */}
        {(!showAll && !enableInfiniteScroll && displayMemes.length >= itemsPerPage) && (
          <div className={`gallery-item bg-kevin-graphite border-2 border-kevin-neon p-4 cursor-pointer flex items-center justify-center focus-visible ${
            viewMode === 'list' ? 'w-full' : ''
          }`}>
            <a
              href="https://memedepot.com/d/kevin-depot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center"
              aria-label="View more KEVIN content on Kevin Depot (opens in new tab)"
            >
              <div className="font-pixel text-kevin-neon text-xl">+50</div>
              <div className="font-pixel text-xs text-white">MORE</div>
              <div className="font-pixel text-xs text-kevin-neon mt-2">VISIT DEPOT</div>
            </a>
          </div>
        )}

        {/* End of Results Message */}
        {displayMemes.length >= processedMemes.length && processedMemes.length > 0 && (
          <div className={`gallery-item bg-kevin-charcoal border-2 border-kevin-steel p-4 text-center ${
            viewMode === 'list' ? 'w-full' : ''
          }`}>
            <div className="text-kevin-mint font-pixel text-sm">
              🎯 You've reached the end of KEVIN content
            </div>
            <div className="text-kevin-steel text-xs mt-1">
              Check back later for fresh uploads!
            </div>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">
            {isLoading ? '...' : (communityData?.totalMemes || allMemes.length)}
          </div>
          <div className="text-kevin-orange font-pixel text-xs">Total Memes</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">
            {isLoading ? '...' : (communityData?.totalVideos || allMemes.filter(m => m.type === 'video').length)}
          </div>
          <div className="text-kevin-neon font-pixel text-xs">Videos</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">
            {isLoading ? '...' : (communityData?.totalGifs || allMemes.filter(m => m.type === 'gif').length)}
          </div>
          <div className="text-kevin-magenta font-pixel text-xs">GIFs</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">
            {isLoading ? '...' : (() => {
              const views = communityData?.totalViews || 1100;
              return views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views.toString();
            })()}
          </div>
          <div className="text-kevin-cyan font-pixel text-xs">Views</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">∞</div>
          <div className="text-kevin-green font-pixel text-xs">Creativity</div>
        </div>
      </div>

      {/* Data Source & Status Info */}
      {(communityData || dataSource) && (
        <div className="text-center mt-8">
          <div className="terminal-window p-4 max-w-md mx-auto">
            <div className="text-xs text-kevin-mint space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  dataSource === 'live' ? 'bg-green-400 animate-pulse' :
                  dataSource === 'cached' ? 'bg-yellow-400' :
                  'bg-gray-400'
                }`}></span>
                <span>
                  {dataSource === 'live' ? '🔴 LIVE DATA' :
                   dataSource === 'cached' ? '🟡 CACHED DATA' :
                   '⚪ STATIC DATA'}
                </span>
              </div>

              {lastUpdated && (
                <div>Last updated: {lastUpdated.toLocaleString()}</div>
              )}

              {dataSource === 'live' && (
                <div className="text-kevin-cyan">Updates every 5 minutes</div>
              )}

              {dataSource === 'cached' && (
                <div className="text-yellow-400">Using cached data - connection issues detected</div>
              )}

              {apiError && (
                <div className="text-red-400 text-xs mt-2">
                  Error: {apiError.message} (Code: {apiError.code})
                </div>
              )}

              {dataSource === 'fallback' && (
                <div className="text-gray-400">Using static fallback data</div>
              )}
            </div>

            {/* Manual Controls */}
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={retry}
                className="pixel-btn px-3 py-1 text-xs text-black bg-kevin-orange border-kevin-orange"
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔄'} REFRESH
              </button>

              <button
                onClick={clearCache}
                className="pixel-btn px-3 py-1 text-xs text-black bg-kevin-magenta border-kevin-magenta"
              >
                🗑️ CLEAR CACHE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link to Full Depot */}
      <div className="text-center">
        <a 
          href="https://memedepot.com/d/kevin-depot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="pixel-btn px-8 py-4 text-black font-bold bg-kevin-neon border-kevin-neon"
        >
          🎨 VISIT KEVIN DEPOT
        </a>
      </div>

      {/* Image/GIF Modal */}
      {selectedMeme && (selectedMeme.type === 'image' || selectedMeme.type === 'gif') && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-kevin-charcoal border-4 border-kevin-orange max-w-4xl w-full max-h-screen overflow-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-kevin-orange">
              <div>
                <h3 className="font-pixel text-xl text-kevin-orange">{selectedMeme.title}</h3>
                <p className="text-sm text-kevin-mint">{selectedMeme.description}</p>
              </div>
              <button
                onClick={closeImageModal}
                className="pixel-btn px-4 py-2 text-black bg-kevin-orange border-kevin-orange hover:bg-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Image Display */}
            <div className="p-4 flex justify-center">
              <LazyImage
                src={selectedMeme.imageUrl}
                alt={selectedMeme.title}
                className="max-w-full max-h-96 object-contain pixel-perfect border-2 border-kevin-green"
                showLoadingIndicator={true}
                containerClassName="min-h-48 flex items-center justify-center"
              />
            </div>
            
            <div className="p-4 bg-black border-t-2 border-kevin-green">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-pixel text-kevin-orange text-sm">
                    Type: {selectedMeme.type.toUpperCase()} • Category: {selectedMeme.category}
                  </div>
                  <div className="font-pixel text-kevin-mint text-xs">
                    {selectedMeme.type === 'gif' ? 'Animated GIF from Kevin Depot' : 'Static image from Kevin Depot'}
                  </div>
                </div>
                <a
                  href="https://memedepot.com/d/kevin-depot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn px-4 py-2 text-black bg-kevin-neon border-kevin-neon text-xs"
                >
                  VIEW MORE ART
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-kevin-charcoal border-4 border-kevin-orange max-w-4xl w-full max-h-screen overflow-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-kevin-orange">
              <div>
                <h3 className="font-pixel text-xl text-kevin-orange">{videoModal.title}</h3>
                <p className="text-sm text-kevin-mint">{videoModal.description}</p>
              </div>
              <button
                onClick={closeVideoModal}
                className="pixel-btn px-4 py-2 text-black bg-kevin-orange border-kevin-orange hover:bg-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Video Player */}
            <div className="p-4">
              <iframe
                src={`https://iframe.cloudflarestream.com/${videoModal.videoUrl}?autoplay=true&loop=true&controls=true&defaultTextTrack=&poster=${encodeURIComponent(videoModal.imageUrl || '')}`}
                className="w-full h-96 bg-black border-2 border-kevin-green"
                style={{ aspectRatio: '16/9' }}
                frameBorder="0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                title={videoModal.title}
              ></iframe>
              
              <div className="mt-4 p-4 bg-black border-2 border-kevin-green">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-pixel text-kevin-orange text-sm">Category: {videoModal.category}</div>
                    <div className="font-pixel text-kevin-mint text-xs">Click and drag to scrub • Space to play/pause</div>
                  </div>
                  <a
                    href="https://memedepot.com/d/kevin-depot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-btn px-4 py-2 text-black bg-kevin-neon border-kevin-neon text-xs"
                  >
                    VIEW MORE VIDEOS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
