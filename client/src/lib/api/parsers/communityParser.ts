import { CommunityData } from '@shared/schema';

export interface ParsedCommunityData {
  stats: {
    totalMemes: number;
    totalViews: number;
    totalArtists: number;
    totalVideos: number;
    totalGifs: number;
    totalImages: number;
  };
  content: {
    images: ImageContent[];
    videos: VideoContent[];
    gifs: GifContent[];
    featured: any[];
  };
  metadata: {
    lastUpdated: Date;
    dataSource: string;
    version: string;
    parsingMethod: 'dom' | 'regex' | 'fallback';
  };
}

export interface ImageContent {
  url: string;
  thumbnailUrl: string;
  id: string;
  alt?: string;
}

export interface VideoContent {
  url: string;
  thumbnailUrl: string;
  id: string;
  duration?: string;
  platform: 'cloudflare' | 'youtube' | 'other';
}

export interface GifContent {
  url: string;
  thumbnailUrl: string;
  id: string;
}

export class CommunityDataParser {
  private config = {
    maxImages: 10,
    maxVideos: 5,
    maxGifs: 3,
    thumbnailWidth: 400
  };

  parse(html: string): ParsedCommunityData {
    const startTime = Date.now();

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const stats = this.extractStats(doc);
      const content = this.extractContent(doc);

      return {
        stats,
        content,
        metadata: {
          lastUpdated: new Date(),
          dataSource: 'Kevin Depot',
          version: '2.0',
          parsingMethod: 'dom'
        }
      };
    } catch (error) {
      console.warn('DOM parsing failed, falling back to regex:', error);

      // Fallback to regex parsing if DOM parsing fails
      return this.fallbackRegexParse(html);
    }
  }

  private extractStats(doc: Document) {
    const stats = {
      totalMemes: 133, // Default fallback
      totalViews: 904, // Default fallback
      totalArtists: 1, // Kevin Depot owner
      totalVideos: 14,
      totalGifs: 8,
      totalImages: 45
    };

    try {
      // Multiple selector strategies for robustness
      const statExtractionStrategies = [
        // Strategy 1: Data attributes
        () => this.extractStatsFromDataAttributes(doc),

        // Strategy 2: Specific class names
        () => this.extractStatsFromClasses(doc),

        // Strategy 3: Text content patterns
        () => this.extractStatsFromText(doc),

        // Strategy 4: Meta tags
        () => this.extractStatsFromMeta(doc)
      ];

      for (const strategy of statExtractionStrategies) {
        try {
          const extracted = strategy();
          if (extracted.totalMemes !== 133 || extracted.totalViews !== 904) {
            Object.assign(stats, extracted);
            break;
          }
        } catch (e) {
          // Continue to next strategy
          console.debug('Stat extraction strategy failed:', e);
        }
      }

      // Count actual content found
      const content = this.extractContent(doc);
      stats.totalVideos = content.videos.length;
      stats.totalGifs = content.gifs.length;
      stats.totalImages = content.images.length;
      stats.totalMemes = stats.totalImages + stats.totalVideos + stats.totalGifs;

    } catch (error) {
      console.warn('Stats extraction failed:', error);
    }

    return stats;
  }

  private extractStatsFromDataAttributes(doc: Document) {
    const stats = {
      totalMemes: 133,
      totalViews: 904,
      totalArtists: 1
    };

    // Look for data attributes
    const statElements = doc.querySelectorAll('[data-stat], [data-count], [data-metric]');

    statElements.forEach(element => {
      const statType = element.getAttribute('data-stat') ||
                      element.getAttribute('data-count') ||
                      element.getAttribute('data-metric');
      const value = element.textContent?.trim();

      if (statType && value) {
        const numValue = parseInt(value.replace(/[^\d]/g, ''));
        if (!isNaN(numValue)) {
          switch (statType.toLowerCase()) {
            case 'memes':
            case 'total-memes':
              stats.totalMemes = numValue;
              break;
            case 'views':
            case 'total-views':
              stats.totalViews = numValue;
              break;
            case 'artists':
            case 'creators':
              stats.totalArtists = numValue;
              break;
          }
        }
      }
    });

    return stats;
  }

  private extractStatsFromClasses(doc: Document) {
    const stats = {
      totalMemes: 133,
      totalViews: 904,
      totalArtists: 1
    };

    // Look for common stat class patterns
    const patterns = [
      { selector: '.stat-memes, .memes-count, .total-memes', key: 'totalMemes' },
      { selector: '.stat-views, .views-count, .total-views', key: 'totalViews' },
      { selector: '.stat-artists, .artists-count, .creators', key: 'totalArtists' }
    ];

    patterns.forEach(({ selector, key }) => {
      const element = doc.querySelector(selector);
      if (element) {
        const text = element.textContent?.trim();
        if (text) {
          const numValue = parseInt(text.replace(/[^\d]/g, ''));
          if (!isNaN(numValue)) {
            (stats as any)[key] = numValue;
          }
        }
      }
    });

    return stats;
  }

  private extractStatsFromText(doc: Document) {
    const stats = {
      totalMemes: 133,
      totalViews: 904,
      totalArtists: 1
    };

    // Look for text patterns in the document
    const bodyText = doc.body?.textContent || '';

    // Extract numbers followed by keywords
    const patterns = [
      { regex: /(\d+)\s*Memes?/i, key: 'totalMemes' },
      { regex: /(\d+)\s*Views?/i, key: 'totalViews' },
      { regex: /(\d+)\s*Artists?/i, key: 'totalArtists' },
      { regex: /(\d+)\s*Creators?/i, key: 'totalArtists' }
    ];

    patterns.forEach(({ regex, key }) => {
      const match = bodyText.match(regex);
      if (match) {
        const numValue = parseInt(match[1]);
        if (!isNaN(numValue)) {
          (stats as any)[key] = numValue;
        }
      }
    });

    return stats;
  }

  private extractStatsFromMeta(doc: Document) {
    const stats = {
      totalMemes: 133,
      totalViews: 904,
      totalArtists: 1
    };

    // Check meta tags for stats
    const metaSelectors = [
      'meta[name*="memes"]',
      'meta[name*="views"]',
      'meta[name*="artists"]',
      'meta[property*="memes"]',
      'meta[property*="views"]',
      'meta[property*="artists"]'
    ];

    metaSelectors.forEach(selector => {
      const meta = doc.querySelector(selector) as HTMLMetaElement;
      if (meta) {
        const content = meta.content;
        const name = meta.name || meta.getAttribute('property') || '';

        if (content) {
          const numValue = parseInt(content.replace(/[^\d]/g, ''));
          if (!isNaN(numValue)) {
            if (name.includes('memes')) (stats as any).totalMemes = numValue;
          if (name.includes('views')) (stats as any).totalViews = numValue;
          if (name.includes('artists')) (stats as any).totalArtists = numValue;
          }
        }
      }
    });

    return stats;
  }

  private extractContent(doc: Document) {
    const images: ImageContent[] = [];
    const videos: VideoContent[] = [];
    const gifs: GifContent[] = [];
    const featured: any[] = [];

    try {
      // Extract images
      images.push(...this.extractImages(doc));

      // Extract videos
      videos.push(...this.extractVideos(doc));

      // Extract GIFs
      gifs.push(...this.extractGifs(doc));

      // Create featured content from extracted items
      featured.push(
        ...images.slice(0, 6).map((img, i) => this.createFeaturedImage(img, i)),
        ...videos.slice(0, 2).map((vid, i) => this.createFeaturedVideo(vid, i)),
        ...gifs.slice(0, 2).map((gif, i) => this.createFeaturedGif(gif, i))
      );

    } catch (error) {
      console.warn('Content extraction failed:', error);
    }

    return { images, videos, gifs, featured };
  }

  private extractImages(doc: Document): ImageContent[] {
    const images: ImageContent[] = [];

    // Multiple strategies for finding images
    const imageSelectors = [
      'img[src*="cdn-cgi/imagedelivery"]',
      'img[src*="memedepot.com"]',
      '.gallery-item img',
      '.meme-item img',
      '[data-type="image"] img',
      '.content img'
    ];

    const seenUrls = new Set<string>();

    imageSelectors.forEach(selector => {
      try {
        const elements = doc.querySelectorAll(selector);
        elements.forEach((img, index) => {
          const src = img.getAttribute('src');
          if (src && !seenUrls.has(src) && !src.includes('avatar') && !src.includes('logo')) {
            seenUrls.add(src);

            // Extract image ID from URL
            const imageId = this.extractImageId(src);

            images.push({
              url: src,
              thumbnailUrl: src.replace('/width=3840', `/width=${this.config.thumbnailWidth}`)
                               .replace('/width=1920', `/width=${this.config.thumbnailWidth}`),
              id: imageId,
              alt: img.getAttribute('alt') || `Kevin content ${index + 1}`
            });
          }
        });
      } catch (e) {
        console.debug('Image selector failed:', selector, e);
      }
    });

    return images.slice(0, this.config.maxImages);
  }

  private extractVideos(doc: Document): VideoContent[] {
    const videos: VideoContent[] = [];

    // Strategies for finding videos
    const videoSelectors = [
      'img[src*="cloudflarestream.com"]',
      'iframe[src*="cloudflarestream.com"]',
      '[data-type="video"] img',
      '[data-type="video"] iframe'
    ];

    const seenUrls = new Set<string>();

    videoSelectors.forEach(selector => {
      try {
        const elements = doc.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const src = el.getAttribute('src') || '';
          if (src && src.includes('cloudflarestream.com') && !seenUrls.has(src)) {
            seenUrls.add(src);

            const videoId = this.extractVideoId(src);
            const platform = this.detectVideoPlatform(src);

            videos.push({
              url: src,
              thumbnailUrl: src, // Cloudflare thumbnails are already small
              id: videoId,
              platform,
              duration: el.getAttribute('data-duration') || undefined
            });
          }
        });
      } catch (e) {
        console.debug('Video selector failed:', selector, e);
      }
    });

    return videos.slice(0, this.config.maxVideos);
  }

  private extractGifs(doc: Document): GifContent[] {
    const gifs: GifContent[] = [];

    // Find GIFs within images
    const allImages = doc.querySelectorAll('img');
    allImages.forEach((img, index) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('.gif') || src.includes('.GIF')) {
        const gifId = this.extractImageId(src);

        gifs.push({
          url: src,
          thumbnailUrl: src, // GIFs can serve as their own thumbnails
          id: gifId
        });
      }
    });

    return gifs.slice(0, this.config.maxGifs);
  }

  private extractImageId(url: string): string {
    // Try multiple patterns to extract image ID
    const patterns = [
      /\/([a-f0-9-]{8,})\/(?:width|public|$)/,
      /\/([a-f0-9-]{8,})\.(jpg|jpeg|png|gif|webp)/i,
      /\/([a-f0-9-]{8,})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Fallback: create hash from URL
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private extractVideoId(url: string): string {
    // Extract Cloudflare Stream video ID
    const match = url.match(/([a-f0-9-]+)\/thumbnails/);
    return match ? match[1] : url.split('/').pop() || 'unknown';
  }

  private detectVideoPlatform(url: string): VideoContent['platform'] {
    if (url.includes('cloudflarestream.com')) return 'cloudflare';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return 'other';
  }

  private createFeaturedImage(img: ImageContent, index: number) {
    const titles = [
      '🔴 LATEST KEVIN',
      '🆕 FRESH UPLOAD',
      '⚡ NEW KEVIN DROP',
      '🎨 COMMUNITY PICK',
      '🔥 HOT KEVIN',
      '✨ KEVIN SPECIAL'
    ];

    return {
      id: `live-kevin-${Date.now()}-${index}`,
      title: `${titles[index % titles.length]} #${index + 1}`,
      type: "image" as const,
      imageUrl: img.thumbnailUrl,
      description: "Live from Kevin Depot",
      category: "Live Update"
    };
  }

  private createFeaturedVideo(vid: VideoContent, index: number) {
    const titles = [
      "🎬 LATEST KEVIN VIDEO",
      "🎥 KEVIN IN ACTION"
    ];

    return {
      id: `live-video-${Date.now()}-${index}`,
      title: titles[index] || `KEVIN VIDEO #${index + 1}`,
      type: "video" as const,
      imageUrl: vid.thumbnailUrl,
      videoUrl: vid.id,
      description: "Live video from Kevin Depot",
      category: "Community"
    };
  }

  private createFeaturedGif(gif: GifContent, index: number) {
    return {
      id: `live-gif-${Date.now()}-${index}`,
      title: `🎞️ KEVIN GIF ${index + 1}`,
      type: "gif" as const,
      imageUrl: gif.thumbnailUrl,
      description: "Live GIF from Kevin Depot",
      category: "Community"
    };
  }

  private fallbackRegexParse(html: string): ParsedCommunityData {
    // Fallback to regex-based parsing if DOM parsing completely fails
    console.warn('Using regex fallback parsing - this may be less reliable');

    const stats = {
      totalMemes: 133,
      totalViews: 904,
      totalArtists: 1,
      totalVideos: 14,
      totalGifs: 8,
      totalImages: 45
    };

    // Basic regex extraction
    const memeMatch = html.match(/(\d+)\s*Memes?/i);
    const viewMatch = html.match(/(\d+)\s*Views?/i);

    if (memeMatch) stats.totalMemes = parseInt(memeMatch[1]);
    if (viewMatch) stats.totalViews = parseInt(viewMatch[1]);

    return {
      stats,
      content: {
        images: [],
        videos: [],
        gifs: [],
        featured: []
      },
      metadata: {
        lastUpdated: new Date(),
        dataSource: 'Kevin Depot (regex fallback)',
        version: '1.0',
        parsingMethod: 'regex'
      }
    };
  }
}

// Export singleton instance
export const communityParser = new CommunityDataParser();
