import { kevinStampNumbers, getStampImageUrl, getStampUrl } from "../data/stamp-numbers";
import { useState } from "react";

interface StampsGalleryProps {
  showAll?: boolean;
  itemsPerPage?: number;
}

export default function StampsGallery({ showAll = false, itemsPerPage = 16 }: StampsGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStamp, setSelectedStamp] = useState<number | null>(null);

  const displayStamps = showAll 
    ? kevinStampNumbers 
    : kevinStampNumbers.slice(0, itemsPerPage);

  const totalPages = Math.ceil(kevinStampNumbers.length / itemsPerPage);

  const handleStampClick = (stampNumber: number) => {
    window.open(getStampUrl(stampNumber), '_blank');
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-8">
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {displayStamps.map((stampNumber, index) => (
          <div
            key={stampNumber}
            className="gallery-item bg-black border-2 border-kevin-orange p-2 cursor-pointer"
            onClick={() => handleStampClick(stampNumber)}
            onMouseEnter={() => setSelectedStamp(stampNumber)}
            onMouseLeave={() => setSelectedStamp(null)}
          >
            <div className="relative">
              <img 
                src={getStampImageUrl(stampNumber)}
                alt={`Kevin Stamp #${stampNumber}`}
                className="w-full pixel-perfect"
                loading="lazy"
              />
              {selectedStamp === stampNumber && (
                <div className="absolute inset-0 bg-kevin-orange bg-opacity-20 flex items-center justify-center">
                  <div className="text-white font-pixel text-xs">CLICK</div>
                </div>
              )}
            </div>
            <div className="text-center mt-2 font-pixel text-xs text-kevin-orange">
              #{stampNumber}
            </div>
          </div>
        ))}

        {/* Load More Button */}
        {!showAll && displayStamps.length < kevinStampNumbers.length && (
          <div 
            className="gallery-item bg-kevin-graphite border-2 border-kevin-neon p-4 cursor-pointer flex items-center justify-center"
            onClick={handleLoadMore}
          >
            <div className="text-center">
              <div className="font-pixel text-kevin-neon text-xl">
                +{kevinStampNumbers.length - displayStamps.length}
              </div>
              <div className="font-pixel text-xs text-white">MORE</div>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Stats */}
      <div className="terminal-window text-center">
        <div className="font-pixel text-kevin-neon mb-2">
          &gt; SCANNING BLOCKCHAIN FOR KEVIN SIGNATURES...
        </div>
        <div className="text-white">
          Displaying {displayStamps.length} of {kevinStampNumbers.length} Kevin stamps
        </div>
        <div className="text-kevin-orange">
          Each stamp is byte-perfect yet uniquely numbered
        </div>
        <div className="text-kevin-mint mt-2">
          Click any stamp to view on STAMPCHAIN.IO
        </div>
      </div>

      {/* Pagination Info */}
      {!showAll && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-black border-2 border-kevin-orange p-4">
            <div className="font-pixel text-kevin-orange">
              PAGE {currentPage} / {totalPages}
            </div>
            <div className="text-white">
              {displayStamps.length} stamps loaded
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
