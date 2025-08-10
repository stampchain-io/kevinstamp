import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for Kevin stamp data
  app.get("/api/stamps", (req, res) => {
    const kevinStampNumbers = [
      4258, 4265, 4283, 4303, 5096, 5104, 16494, 16495, 16496, 16497, 16498, 16499,
      17721, 17722, 18315, 18317, 18319, 18321, 18322, 18323, 18324, 18325, 18326,
      18327, 18328, 18329, 18330, 18332, 18335, 18336, 18338, 18341, 18342, 18343,
      18344, 18345, 18346, 18347, 18348, 18349, 18350, 18351, 18353, 18354, 18355,
      18356, 18357, 18358, 18360, 18361, 18362, 18364, 18365, 18366, 18367, 18368,
      18369, 18371, 18373, 18374, 18375, 18376, 18379, 18380, 18381, 18382, 18386,
      18387, 18390, 18393, 18394, 18395, 18396, 18398, 18399, 18400, 18401, 18402,
      18403, 18407, 18408, 18409, 18410, 18415, 18418, 18419, 18420, 18421, 18422,
      18424, 18426, 18430
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
  app.get("/api/token", (req, res) => {
    res.json({
      ticker: "KEVIN",
      supply: 690000000,
      protocol: "SRC-20 on Bitcoin Stamps",
      status: "First SRC-20 token ever deployed",
      marketCapBTC: 17.802,
      change24h: -2.64,
      vol24h: 0,
      totalVolBTC: 269.22,
      holders: 2130,
      deploymentStamp: 18516,
      perMintLimit: 420000,
      fairLaunchMinted: 153.92,
      tradeUrl: "https://openstamp.io/market/src20/trading?ticker=KEVIN"
    });
  });

  // API route for community memes
  app.get("/api/community", (req, res) => {
    res.json({
      totalMemes: 67,
      totalViews: 727,
      totalArtists: 12,
      depotUrl: "https://memedepot.com/d/kevin-depot",
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
  });

  const httpServer = createServer(app);
  return httpServer;
}
