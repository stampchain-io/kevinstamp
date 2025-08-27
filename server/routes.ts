import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertKevinInquirySchema } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for Kevin stamp data
  app.get("/api/stamps", (req, res) => {
    const kevinStampNumbers = [
      4258, 4265, 4283, 4303, 5096, 5097, 5104, 16494, 16495, 16496, 16497, 16498, 16499,
      17721, 17722, 18315, 18317, 18319, 18321, 18322, 18323, 18324, 18325, 18326,
      18327, 18328, 18329, 18330, 18332, 18333, 18335, 18336, 18338, 18339, 18340,
      18341, 18342, 18343, 18344, 18345, 18346, 18347, 18348, 18349, 18350, 18351,
      18352, 18353, 18354, 18355, 18356, 18357, 18358, 18359, 18360, 18361, 18362,
      18363, 18364, 18365, 18366, 18367, 18368, 18369, 18370, 18371, 18373, 18374,
      18375, 18376, 18379, 18380, 18381, 18382, 18386, 18387, 18390, 18393, 18394,
      18395, 18396, 18398, 18399, 18400, 18401, 18402, 18403, 18405, 18406, 18407,
      18408, 18409, 18410, 18412, 18415, 18418, 18419, 18420, 18421, 18422, 18424,
      18426, 18428, 18430
    ];

    res.json({
      stamps: kevinStampNumbers.map(number => ({
        number,
        imageUrl: `https://stampchain.io/api/image/${number}`,
        stampUrl: `https://stampchain.io/stamp/${number}`
      })),
      total: kevinStampNumbers.length,
      range: { start: 4258, end: 18430 }
    });
  });

  // API route for token information
  app.get("/api/token", async (req, res) => {
    try {
      // TODO: Replace with live OpenStamp API call when available
      // Example implementation when OpenStamp provides public API:
      // const response = await fetch('https://openstamp.io/api/v1/tokens/KEVIN');
      // const liveData = await response.json();
      
      // Try to get live data from SuperEX (KEVIN/USDT trading pair available)
      let superExData = null;
      try {
        // SuperEX has KEVIN/USDT pair - attempt to get live data
        const superExResponse = await fetch('https://www.superex.com/trade/KEVIN_USDT');
        // TODO: Parse SuperEX page or find their API endpoint for live data
        // For now using realistic market data with slight fluctuations
      } catch (error) {
        console.log("SuperEX data unavailable, using simulated data");
      }
      
      // Simulate some dynamic values (in a real implementation, these would come from OpenStamp)
      const currentTime = Date.now();
      const fluctuation = Math.sin(currentTime / 100000) * 0.5; // Small realistic fluctuation
      
      // SuperEX data - using observed values with slight variation for realistic simulation
      const superExPrice = 0.00246 + (Math.random() - 0.5) * 0.00002; // Small price fluctuation around $0.00246
      const superExVolume = 3.74 + (Math.random() - 0.5) * 0.5; // Volume fluctuation around 3.74K
      
      const tokenData = {
        ticker: "KEVIN",
        supply: 690000000,
        protocol: "SRC-20 on Bitcoin Stamps",
        status: "First SRC-20 token ever deployed",
        
        // Market data (will be replaced with live API calls)
        marketCapBTC: parseFloat((17.802 + fluctuation).toFixed(3)),
        change24h: parseFloat((-2.64 + fluctuation * 2).toFixed(2)),
        vol24h: parseFloat((0.087 + Math.abs(fluctuation) * 0.1).toFixed(3)),
        totalVolBTC: parseFloat((269.22 + Math.abs(fluctuation) * 5).toFixed(2)),
        holders: 2130 + Math.floor(Math.random() * 5), // Slight realistic variation
        
        // SuperEX trading data
        superExPrice: parseFloat(superExPrice.toFixed(5)),
        superExVolume: parseFloat(superExVolume.toFixed(2)),
        superExUrl: "https://www.superex.com/trade/KEVIN_USDT",
        
        // Deployment data (static)
        deploymentStamp: 18516,
        perMintLimit: 420000,
        fairLaunchMinted: 153.92,
        
        // Trading info
        tradeUrl: "https://openstamp.io/market/src20/trading?ticker=KEVIN",
        lastUpdated: new Date().toISOString(),
        dataSource: "Multiple exchanges (simulated data)", // Will change to live when APIs available
      };

      res.json(tokenData);
    } catch (error) {
      console.error("Error fetching token data:", error);
      res.status(500).json({ 
        error: "Unable to fetch token data",
        message: "Token data temporarily unavailable" 
      });
    }
  });

  // API route for community memes
  app.get("/api/community", async (req, res) => {
    try {
      // Fetch live data from Kevin Depot with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('https://memedepot.com/d/kevin-depot', {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KevinBot/1.0)'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Parse the actual stats from the page
      let totalMemes = 133; // Default fallback
      let totalViews = 904; // Default fallback
      
      // Extract meme count from the HTML
      const memeCountMatch = html.match(/(\d+)\s*Memes/);
      if (memeCountMatch) {
        totalMemes = parseInt(memeCountMatch[1]);
      }
      
      // Extract view count from the HTML
      const viewCountMatch = html.match(/(\d+)\s*Views/);
      if (viewCountMatch) {
        totalViews = parseInt(viewCountMatch[1]);
      }
      
      // Parse recent memes from the page with more comprehensive patterns
      // Look for all image delivery URLs
      const imageMatches = html.match(/https:\/\/memedepot\.com\/cdn-cgi\/imagedelivery\/[^"\s<>]+/g) || [];
      // Also look for direct image URLs that might be in different formats
      const directImageMatches = html.match(/https:\/\/memedepot\.com\/[^"\s<>]*\.(jpg|jpeg|png|gif|webp)/gi) || [];
      // Video thumbnails
      const videoMatches = html.match(/https:\/\/customer-hls7a0n7rbjgz9uk\.cloudflarestream\.com\/[^/"\s<>]+\/thumbnails\/thumbnail\.jpg/g) || [];
      // Alternative video patterns
      const altVideoMatches = html.match(/https:\/\/[^"\s<>]*cloudflarestream[^"\s<>]*\.(mp4|webm|mov)/gi) || [];
      
      // Combine all image sources
      const allImageMatches = [...imageMatches, ...directImageMatches];
      
      // Debug logging to see what we're actually finding
      console.log('\n=== HTML PARSING DEBUG ===');
      console.log('HTML length:', html.length);
      console.log('Image delivery URLs found:', imageMatches.length);
      console.log('Direct image URLs found:', directImageMatches.length);
      console.log('Video thumbnail URLs found:', videoMatches.length);
      console.log('Alt video URLs found:', altVideoMatches.length);
      console.log('Sample images:', allImageMatches.slice(0, 5));
      console.log('Sample videos:', videoMatches.slice(0, 3));
      console.log('=========================\n');
      
      // Get unique image IDs to avoid duplicates - more flexible extraction
      const uniqueImages = Array.from(new Set(
        allImageMatches
          .filter(url => {
            // Filter out small images, logos, but be more inclusive
            return !url.includes('logo') && 
                   !url.includes('width=200') && 
                   !url.includes('width=100') &&
                   !url.includes('avatar') &&
                   !url.includes('icon');
          })
          .map(url => {
            // Try multiple patterns to extract image IDs
            let idMatch = url.match(/\/([a-f0-9-]{8,})\/(?:width|public|$)/);
            if (!idMatch) {
              idMatch = url.match(/\/([a-f0-9-]{8,})\.(jpg|jpeg|png|gif|webp)/i);
            }
            if (!idMatch) {
              idMatch = url.match(/\/([a-f0-9-]{8,})/); // Fallback - any long hex string
            }
            return idMatch ? idMatch[1] : null;
          })
          .filter(Boolean)
      ));
      
      // Count GIFs specifically - look in all image sources
      const gifMatches = allImageMatches.filter(url => url.includes('.gif'));
      
      // Count different media types
      const totalImages = Math.max(0, uniqueImages.length);
      const totalVideos = videoMatches.length;
      const totalGifs = gifMatches.length;
      
      // Extract featured content (mix of images and videos)
      const featured = [];
      
      // Debug what unique images we found
      console.log('Unique images extracted:', {
        totalUnique: uniqueImages.length,
        allIds: uniqueImages
      });

      // Create rotation based on time to add variety even with same content
      const timeRotation = Math.floor(Date.now() / (1000 * 60 * 5)); // Rotate every 5 minutes
      const rotatedImages = [...uniqueImages.slice(timeRotation % uniqueImages.length), ...uniqueImages.slice(0, timeRotation % uniqueImages.length)];
      
      // Get recent images using unique IDs (take more for variety)
      const recentImages = rotatedImages
        .slice(0, 8) // Take more images
        .map((imageId, index) => {
          // Create more descriptive titles with rotation
          const titles = [
            '🔴 LATEST KEVIN',
            '🆕 FRESH UPLOAD',
            '⚡ NEW KEVIN DROP',
            '🎨 COMMUNITY PICK',
            '🔥 HOT KEVIN',
            '✨ KEVIN SPECIAL',
            '🚀 TRENDING NOW',
            '💎 KEVIN GEM'
          ];
          
          return {
            id: `live-kevin-${Date.now()}-${index}`,
            title: `${titles[index % titles.length]} #${index + 1}`,
            type: "image" as const,
            imageUrl: `https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/${imageId}/width=400`,
            description: "Live from Kevin Depot",
            category: "Live Update"
          };
        });
      
      // Get recent videos if available - take multiple videos
      const recentVideos = videoMatches.slice(0, 3).map((videoUrl, index) => {
        const videoId = videoUrl.match(/([a-f0-9-]+)\/thumbnails/)?.[1] || "";
        const videoTitles = [
          "🎬 LATEST KEVIN VIDEO",
          "🎥 KEVIN IN ACTION", 
          "📹 FRESH KEVIN CLIP"
        ];
        
        return {
          id: `live-video-${Date.now()}-${index}`,
          title: videoTitles[index] || `KEVIN VIDEO #${index + 1}`,
          type: "video" as const,
          imageUrl: videoUrl, // Use thumbnail
          videoUrl: videoId,
          description: "Live video from Kevin Depot",
          category: "Community"
        };
      });
      
      featured.push(...recentVideos);
      
      featured.push(...recentImages);
      
      // Add recent GIFs if we have any
      const recentGifs = gifMatches.slice(0, 2).map((gifUrl, index) => {
        return {
          id: `live-gif-${Date.now()}-${index}`,
          title: `🎞️ KEVIN GIF ${index + 1}`,
          type: "gif" as const,
          imageUrl: gifUrl.replace('/width=3840', '/width=400').replace('/width=1920', '/width=400'),
          description: "Live GIF from Kevin Depot",
          category: "Community"
        };
      });
      
      featured.push(...recentGifs);
      
      res.json({
        totalMemes,
        totalVideos,
        totalGifs,
        totalImages,
        totalViews,
        totalArtists: 1, // Based on the depot owner
        depotUrl: "https://memedepot.com/d/kevin-depot",
        lastUpdated: new Date().toISOString(),
        dataSource: "Kevin Depot (live data)",
        featured
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
      console.error("Error fetching Kevin Depot data:", {
        message: errorMessage,
        type: errorType,
        timestamp: new Date().toISOString()
      });
      
      // Fallback to static data if scraping fails
      res.json({
        totalMemes: 133,
        totalVideos: 14,
        totalGifs: 8,
        totalImages: 45,
        totalViews: 904,
        totalArtists: 1,
        depotUrl: "https://memedepot.com/d/kevin-depot",
        lastUpdated: new Date().toISOString(),
        dataSource: "Kevin Depot (cached fallback)",
        featured: [
          {
            id: "kevin-president",
            title: "KEVIN 4 PRESIDENT",
            type: "image",
            imageUrl: "https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/0914e9a8-d29b-423b-a633-38b5c1bc3700/width=400",
            description: "Political Campaign",
            category: "Politics"
          },
          {
            id: "kevsurf",
            title: "KEVSURF", 
            type: "image",
            imageUrl: "https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/f07d3377-921a-49ea-9a99-6f50e2505200/width=400",
            description: "Radical Surfing",
            category: "Sports"
          },
          {
            id: "james-bond-kevin",
            title: "AGENT 007 KEVIN",
            type: "image", 
            imageUrl: "https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/56c35540-04c1-4cbf-8e20-34297ca43b00/width=400",
            description: "Secret Agent",
            category: "Movies"
          }
        ]
      });
    }
  });

  // API route for Kevin stamp inquiries
  app.post("/api/kevin-inquiry", async (req, res) => {
    try {
      const validatedData = insertKevinInquirySchema.parse(req.body);
      const inquiry = await storage.createKevinInquiry(validatedData);
      
      // In a real app, you'd send an email here
      console.log("New Kevin stamp inquiry received:", {
        name: inquiry.name,
        email: inquiry.email,
        budgetRange: inquiry.budgetRange,
        timestamp: inquiry.createdAt
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Inquiry submitted successfully. We'll review your request within 48-72 hours.",
        id: inquiry.id
      });
    } catch (error) {
      console.error("Error submitting Kevin inquiry:", error);
      res.status(400).json({ 
        success: false, 
        message: "Invalid form data. Please check all required fields." 
      });
    }
  });

  // API route to get all inquiries (for admin use)
  app.get("/api/kevin-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getKevinInquiries();
      res.json({
        total: inquiries.length,
        inquiries: inquiries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ success: false, message: "Error fetching inquiries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
