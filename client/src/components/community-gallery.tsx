import { useState, useRef, useEffect } from "react";
import { communityMemes, filterMemesByType, type CommunityMeme } from "../data/community-memes";
import { CommunityData } from "@shared/schema";
import { useLanguage } from '../lib/language-context';
import { useCommunityData, useAPIHealth } from '../hooks/useCommunityData';
import CommunityLoadingState, { GallerySkeleton } from './CommunityLoadingState';
import CommunityErrorState, { NetworkErrorState, TimeoutErrorState } from './CommunityErrorState';
import { GalleryLazyImage, default as LazyImage } from './LazyImage';

interface CommunityGalleryProps {
  showAll?: boolean;
  itemsPerPage?: number;
}

export default function CommunityGallery({ showAll = false, itemsPerPage = 16 }: CommunityGalleryProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedMeme, setSelectedMeme] = useState<CommunityMeme | null>(null);
  const [hoveredMeme, setHoveredMeme] = useState<CommunityMeme | null>(null);
  const [videoModal, setVideoModal] = useState<CommunityMeme | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
  const allMemes = liveFeatured.length > 0 
    ? [...liveFeatured, ...staticMemesFiltered] // Put live content first, no duplicates
    : communityMemes;
  
  const filteredMemes = allMemes.filter(meme => {
    if (filter === 'all') return true;
    return meme.type === filter;
  });
  
  const displayMemes = showAll ? filteredMemes : filteredMemes.slice(0, itemsPerPage);
  
  // Debug logging
  useEffect(() => {
    console.log('Community Gallery Debug:', {
      staticMemes: communityMemes.length,
      liveFeatured: communityData?.featured?.length || 0,
      totalAvailable: allMemes.length,
      filteredMemes: filteredMemes.length,
      displayMemes: displayMemes.length,
      showAll,
      itemsPerPage,
      filter,
      dataSource: communityData?.dataSource || 'loading...'
    });
  }, [filteredMemes.length, displayMemes.length, showAll, itemsPerPage, filter, communityData, allMemes.length]);

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
      {/* Filter Tabs */}
              <div className="flex justify-center">
          <div
            className="flex flex-wrap gap-4"
            role="group"
            aria-label="Filter community content"
          >
            {filters.map((filterOption) => (
              <button
                key={filterOption.key}
                className={`
                  pixel-btn px-6 py-2 text-sm transition-all cursor-pointer focus-visible
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

      {/* Loading State */}
      {isLoading && (
        <CommunityLoadingState
          message="Loading Kevin Depot community..."
          showProgress={true}
          timeout={30}
          onTimeout={retry}
        />
      )}

      {/* Error State */}
      {apiError && (
        <CommunityErrorState
          error={apiError}
          onRetry={retry}
          className="mb-8"
        />
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

      {/* Gallery Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        role="grid"
        aria-label="Community gallery"
      >
        {displayMemes.map((meme, index) => (
          <div
            key={meme.id}
            className="gallery-item bg-black border-2 border-kevin-orange p-2 cursor-pointer transition-all duration-200 hover:border-kevin-neon hover:shadow-lg hover:shadow-kevin-orange/20 focus-visible"
            onMouseEnter={() => setHoveredMeme(meme)}
            onMouseLeave={() => setHoveredMeme(null)}
            onClick={() => handleMemeClick(meme)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMemeClick(meme);
              }
            }}
            tabIndex={0}
            role="gridcell"
            aria-label={`${meme.title} - ${meme.type} from ${meme.category}`}
            aria-describedby={`meme-desc-${meme.id}`}
          >
            <div className="relative">
              <GalleryLazyImage
                src={meme.imageUrl}
                alt={meme.title}
              />
              
              {/* Video Play Icon */}
              {meme.type === 'video' && (
                <div className="absolute top-2 left-2">
                  <div className="bg-black bg-opacity-70 border border-kevin-orange px-2 py-1 text-xs font-pixel flex items-center gap-1">
                    <span className="text-kevin-orange">▶</span>
                    VIDEO
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

              {/* Hover Overlay */}
              {hoveredMeme?.id === meme.id && (
                <div className="absolute inset-0 bg-kevin-orange bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-white font-pixel text-sm bg-black bg-opacity-70 px-3 py-1 border border-kevin-orange">
                    {meme.type === 'video' ? t.buttons.playVideo : meme.type === 'gif' ? t.buttons.viewGif : t.buttons.viewImage}
                  </div>
                </div>
              )}
            </div>

            <div className="p-2">
              <div className="font-pixel text-xs text-kevin-orange truncate flex items-center gap-1">
                {meme.category === "Live Update" && <span className="text-kevin-neon">🔴</span>}
                {meme.title}
              </div>
              <div className="text-xs text-white truncate">
                {meme.description}
              </div>
              <div className="text-xs text-kevin-mint">
                {meme.category}
              </div>
            </div>
          </div>
        ))}

        {/* Load More / Visit Depot Button */}
        {!showAll && displayMemes.length >= itemsPerPage && (
          <div className="gallery-item bg-kevin-graphite border-2 border-kevin-neon p-4 cursor-pointer flex items-center justify-center focus-visible">
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
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
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
          <div className="meme-counter text-2xl">∞</div>
          <div className="text-kevin-cyan font-pixel text-xs">Creativity</div>
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
