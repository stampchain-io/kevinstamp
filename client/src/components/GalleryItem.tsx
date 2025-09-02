import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { GalleryLazyImage } from './LazyImage';

interface GalleryItemProps {
  meme: {
    id: string;
    title: string;
    type: 'image' | 'video' | 'gif';
    imageUrl: string;
    videoUrl?: string;
    description: string;
    category: string;
  };
  onClick: (meme: any) => void;
  isHovered?: boolean;
  onHover?: (meme: any | null) => void;
  className?: string;
}

export default function GalleryItem({
  meme,
  onClick,
  isHovered = false,
  onHover,
  className
}: GalleryItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    // Add a small delay for visual feedback
    setTimeout(() => {
      onClick(meme);
      setIsAnimating(false);
    }, 150);
  };

  const handleMouseEnter = () => {
    onHover?.(meme);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  return (
    <div
      className={cn(
        "gallery-item bg-black border-2 border-kevin-orange p-2 cursor-pointer transition-all duration-300 hover:border-kevin-neon hover:shadow-lg hover:shadow-kevin-orange/20",
        isAnimating && "animate-pulse scale-95",
        "group", // For group hover effects
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-sm">
        {/* Lazy loaded image with smooth transitions */}
        <div className="transition-transform duration-300 group-hover:scale-105">
          <GalleryLazyImage
            src={meme.imageUrl}
            alt={meme.title}
          />
        </div>

        {/* Video Play Icon with animation */}
        {meme.type === 'video' && (
          <div className="absolute top-2 left-2 animate-fade-in">
            <div className="bg-black bg-opacity-70 border border-kevin-orange px-2 py-1 text-xs font-pixel flex items-center gap-1 transition-all duration-200 group-hover:bg-opacity-90 group-hover:scale-105">
              <span className="text-kevin-orange transition-colors duration-200 group-hover:text-kevin-neon">▶</span>
              <span className="text-white">VIDEO</span>
            </div>
          </div>
        )}

        {/* GIF Play Icon with animation */}
        {meme.type === 'gif' && (
          <div className="absolute top-2 right-2 animate-fade-in">
            <div className="bg-kevin-magenta border border-white px-2 py-1 text-xs font-pixel transition-all duration-200 group-hover:scale-105 group-hover:bg-opacity-90">
              GIF
            </div>
          </div>
        )}

        {/* Hover Overlay with smooth animation */}
        <div className={cn(
          "absolute inset-0 bg-kevin-orange bg-opacity-0 flex items-center justify-center backdrop-blur-sm transition-all duration-300",
          isHovered && "bg-opacity-30"
        )}>
          <div className={cn(
            "text-white font-pixel text-sm bg-black bg-opacity-0 px-3 py-1 border border-transparent transition-all duration-300 transform translate-y-2",
            isHovered && "bg-opacity-70 border-kevin-orange translate-y-0"
          )}>
            {meme.type === 'video' ? '▶ PLAY VIDEO' :
             meme.type === 'gif' ? '🎞️ VIEW GIF' :
             '🖼️ VIEW IMAGE'}
          </div>
        </div>

        {/* Loading shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content with smooth transitions */}
      <div className="p-2 transition-all duration-200 group-hover:bg-black/20">
        <div className="font-pixel text-xs text-kevin-orange truncate flex items-center gap-1 transition-colors duration-200 group-hover:text-kevin-neon">
          {meme.category === "Live Update" && (
            <span className="text-kevin-neon animate-pulse">🔴</span>
          )}
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            {meme.title}
          </span>
        </div>
        <div className="text-xs text-white truncate transition-all duration-200 group-hover:text-gray-300">
          {meme.description}
        </div>
        <div className="text-xs text-kevin-mint transition-all duration-200 group-hover:text-kevin-neon">
          {meme.category}
        </div>
      </div>

      {/* Click ripple effect */}
      {isAnimating && (
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
      )}
    </div>
  );
}

// Specialized component for load more button
export function LoadMoreGalleryItem({ onClick, className }: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "gallery-item bg-kevin-graphite border-2 border-kevin-neon p-4 cursor-pointer flex items-center justify-center transition-all duration-300 hover:border-kevin-orange hover:bg-kevin-charcoal group",
        className
      )}
      onClick={onClick}
    >
      <div className="text-center transition-transform duration-200 group-hover:scale-105">
        <div className="font-pixel text-kevin-neon text-xl mb-2 group-hover:text-kevin-orange transition-colors duration-200">
          +50
        </div>
        <div className="font-pixel text-xs text-white mb-1 group-hover:text-gray-300 transition-colors duration-200">
          MORE
        </div>
        <div className="font-pixel text-xs text-kevin-neon group-hover:text-kevin-orange transition-colors duration-200">
          VISIT DEPOT
        </div>

        {/* Animated arrow */}
        <div className="mt-2 text-kevin-orange opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <span className="text-lg">→</span>
        </div>
      </div>

      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-kevin-neon/0 to-kevin-orange/0 group-hover:from-kevin-neon/10 group-hover:to-kevin-orange/10 transition-all duration-300 rounded-sm"></div>
    </div>
  );
}
