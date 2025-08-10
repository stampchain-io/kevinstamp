import { useState } from "react";
import { communityMemes, filterMemesByType, type CommunityMeme } from "../data/community-memes";

interface CommunityGalleryProps {
  showAll?: boolean;
  itemsPerPage?: number;
}

export default function CommunityGallery({ showAll = false, itemsPerPage = 8 }: CommunityGalleryProps) {
  const [filter, setFilter] = useState('all');
  const [selectedMeme, setSelectedMeme] = useState<CommunityMeme | null>(null);

  const filteredMemes = filterMemesByType(filter);
  const displayMemes = showAll ? filteredMemes : filteredMemes.slice(0, itemsPerPage);

  const filters = [
    { key: 'all', label: 'ALL', icon: '🎨' },
    { key: 'image', label: 'IMAGES', icon: '🖼️' },
    { key: 'video', label: 'VIDEOS', icon: '🎬' },
    { key: 'gif', label: 'GIFS', icon: '🎞️' },
  ];

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

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayMemes.map((meme) => (
          <div
            key={meme.id}
            className="gallery-item bg-black border-2 border-kevin-orange p-2 cursor-pointer"
            onMouseEnter={() => setSelectedMeme(meme)}
            onMouseLeave={() => setSelectedMeme(null)}
          >
            <div className="relative">
              <img 
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-32 object-cover pixel-perfect"
                loading="lazy"
              />
              
              {/* Video Play Icon */}
              {meme.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-kevin-cyan border-2 border-white flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-black border-y-2 border-y-transparent ml-1"></div>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              {selectedMeme?.id === meme.id && (
                <div className="absolute inset-0 bg-kevin-orange bg-opacity-20 flex items-center justify-center">
                  <div className="text-white font-pixel text-xs">VIEW</div>
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
          <div className="meme-counter text-2xl">67</div>
          <div className="text-kevin-orange font-pixel text-xs">Total Memes</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">727</div>
          <div className="text-kevin-neon font-pixel text-xs">Views</div>
        </div>
        <div className="terminal-window p-4 text-center">
          <div className="meme-counter text-2xl">12</div>
          <div className="text-kevin-magenta font-pixel text-xs">Artists</div>
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
    </div>
  );
}
