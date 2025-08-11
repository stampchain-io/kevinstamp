import { useState, useRef, useEffect } from "react";
import { communityMemes, filterMemesByType, type CommunityMeme } from "../data/community-memes";

interface CommunityGalleryProps {
  showAll?: boolean;
  itemsPerPage?: number;
}

export default function CommunityGallery({ showAll = false, itemsPerPage = 8 }: CommunityGalleryProps) {
  const [filter, setFilter] = useState('all');
  const [selectedMeme, setSelectedMeme] = useState<CommunityMeme | null>(null);
  const [hoveredMeme, setHoveredMeme] = useState<CommunityMeme | null>(null);
  const [videoModal, setVideoModal] = useState<CommunityMeme | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filteredMemes = filterMemesByType(filter);
  const displayMemes = showAll ? filteredMemes : filteredMemes.slice(0, itemsPerPage);

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

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-4">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              className={`
                pixel-btn px-6 py-2 text-sm transition-all cursor-pointer
                ${filter === filterOption.key
                  ? 'bg-kevin-orange text-black border-kevin-orange'
                  : 'bg-kevin-graphite text-white border-kevin-steel hover:bg-kevin-neon hover:text-black'
                }
              `}
              onClick={() => setFilter(filterOption.key)}
            >
              <span className="mr-2">{filterOption.icon}</span>
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayMemes.map((meme) => (
          <div
            key={meme.id}
            className="gallery-item bg-black border-2 border-kevin-orange p-2 cursor-pointer transition-all duration-200 hover:border-kevin-neon hover:shadow-lg hover:shadow-kevin-orange/20"
            onMouseEnter={() => setHoveredMeme(meme)}
            onMouseLeave={() => setHoveredMeme(null)}
            onClick={() => handleMemeClick(meme)}
          >
            <div className="relative">
              <img 
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-32 object-contain pixel-perfect transition-transform duration-200 hover:scale-105 bg-kevin-charcoal"
                loading="lazy"
                style={{ imageRendering: 'pixelated' }}
              />
              


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
                    {meme.type === 'video' ? 'PLAY VIDEO' : meme.type === 'gif' ? 'VIEW GIF' : 'VIEW IMAGE'}
                  </div>
                </div>
              )}
            </div>

            <div className="p-2">
              <div className="font-pixel text-xs text-kevin-orange truncate">
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
          <div className="gallery-item bg-kevin-graphite border-2 border-kevin-neon p-4 cursor-pointer flex items-center justify-center">
            <a 
              href="https://memedepot.com/d/kevin-depot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-center"
            >
              <div className="font-pixel text-kevin-neon text-xl">+60</div>
              <div className="font-pixel text-xs text-white">MORE</div>
              <div className="font-pixel text-xs text-kevin-neon mt-2">VISIT DEPOT</div>
            </a>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">{communityMemes.length}</div>
          <div className="text-kevin-orange font-pixel text-xs">Total Memes</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">{communityMemes.filter(m => m.type === 'video').length}</div>
          <div className="text-kevin-neon font-pixel text-xs">Videos</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">{communityMemes.filter(m => m.type === 'gif').length}</div>
          <div className="text-kevin-magenta font-pixel text-xs">GIFs</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">∞</div>
          <div className="text-kevin-cyan font-pixel text-xs">Creativity</div>
        </div>
      </div>

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
              <img
                src={selectedMeme.imageUrl}
                alt={selectedMeme.title}
                className="max-w-full max-h-96 object-contain pixel-perfect border-2 border-kevin-green"
                style={{ imageRendering: 'pixelated' }}
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
