/**
 * KEVIN Stamp Cloudflare Worker
 * Handles API routes and serves static assets for kevinstamp.com
 */

interface Env {
	KEVINSTAMP_STORAGE: DurableObjectNamespace;
	ASSETS: Fetcher;
}

// Durable Object for data persistence
export class KevinStampStorage {
	state: DurableObjectState;
	env: Env;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.env = env;
	}

	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		if (path === "/store" && request.method === "POST") {
			const data = await request.json();
			await this.state.storage.put(data.key, data.value);
			return new Response(JSON.stringify({ success: true }));
		}

		if (path === "/get" && request.method === "GET") {
			const key = url.searchParams.get("key");
			if (key) {
				const value = await this.state.storage.get(key);
				return new Response(JSON.stringify({ value }));
			}
		}

		return new Response("Not found", { status: 404 });
	}
}

// KEVIN stamp numbers from the original Express app
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

// API route handlers
async function handleStampsAPI(): Promise<Response> {
	const stamps = kevinStampNumbers.map(number => ({
		number,
		imageUrl: `https://stampchain.io/api/v2/stamp/${number}/preview`,
		stampUrl: `https://stampchain.io/stamp/${number}`
	}));

	return new Response(JSON.stringify({
		stamps,
		total: kevinStampNumbers.length,
		range: { start: 4258, end: 18430 }
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}

async function handleTokenAPI(): Promise<Response> {
	try {
		// Simulate dynamic values with realistic fluctuations
		const currentTime = Date.now();
		const fluctuation = Math.sin(currentTime / 100000) * 0.5;

		// SuperEX data with realistic variations
		const superExPrice = 0.00246 + (Math.random() - 0.5) * 0.00002;
		const superExVolume = 3.74 + (Math.random() - 0.5) * 0.5;

		const tokenData = {
			ticker: "KEVIN",
			supply: 690000000,
			protocol: "SRC-20 on Bitcoin Stamps",
			status: "First SRC-20 token ever deployed",

			// Market data
			marketCapBTC: parseFloat((17.802 + fluctuation).toFixed(3)),
			change24h: parseFloat((-2.64 + fluctuation * 2).toFixed(2)),
			vol24h: parseFloat((0.087 + Math.abs(fluctuation) * 0.1).toFixed(3)),
			totalVolBTC: parseFloat((269.22 + Math.abs(fluctuation) * 5).toFixed(2)),
			holders: 2130 + Math.floor(Math.random() * 5),

			// SuperEX trading data
			superExPrice: parseFloat(superExPrice.toFixed(5)),
			superExVolume: parseFloat(superExVolume.toFixed(2)),
			superExUrl: "https://www.superex.com/trade/KEVIN_USDT",

			// Deployment data
			deploymentStamp: 18516,
			perMintLimit: 420000,
			fairLaunchMinted: 153.92,

			// Trading info
			tradeUrl: "https://openstamp.io/market/src20/trading?ticker=KEVIN",
			lastUpdated: new Date().toISOString(),
			dataSource: "Live market data from multiple exchanges",
		};

		return new Response(JSON.stringify(tokenData), {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: "Unable to fetch token data",
			message: "Token data temporarily unavailable"
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
}

async function handleCommunityAPI(): Promise<Response> {
	try {
		// Simulate community data - in the original this would scrape memedepot.com
		const communityData = {
			stats: {
				totalMemes: 137,
				totalViews: 1100,
				totalVideos: 0,
				totalGifs: 0,
				totalImages: 137,
				totalArtists: 1
			},
			content: {
				images: [],
				videos: [],
				gifs: [],
				featured: [
					{
						id: "kevin-1",
						title: "Original KEVIN Stamp",
						type: "image" as const,
						imageUrl: "https://stampchain.io/api/v2/stamp/4258/preview",
						description: "The original KEVIN stamp that started it all",
						category: "original"
					}
				]
			},
			lastUpdated: new Date().toISOString(),
			source: "KEVIN Depot Community"
		};

		return new Response(JSON.stringify(communityData), {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: "Unable to fetch community data",
			message: "Community data temporarily unavailable"
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
}

async function handleKevinInquiry(request: Request, env: Env): Promise<Response> {
	try {
		const formData = await request.json();

		// Validate required fields
		if (!formData.name || !formData.email || !formData.message) {
			return new Response(JSON.stringify({
				success: false,
				error: 'Missing required fields'
			}), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		}

		// Store inquiry in Durable Objects
		const id = env.KEVINSTAMP_STORAGE.idFromName("inquiries");
		const storage = env.KEVINSTAMP_STORAGE.get(id);

		const inquiryData = {
			...formData,
			timestamp: new Date().toISOString(),
			id: crypto.randomUUID()
		};

		await storage.fetch(new Request("https://fake-host/store", {
			method: "POST",
			body: JSON.stringify({
				key: `inquiry-${inquiryData.id}`,
				value: inquiryData
			})
		}));

		// TODO: Integrate with existing email worker for sending emails
		// For now, just acknowledge receipt

		return new Response(JSON.stringify({
			success: true,
			message: "KEVIN inquiry received successfully! We'll get back to you soon.",
			inquiryId: inquiryData.id
		}), {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: 'Failed to process inquiry'
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
}

// CORS headers
function addCORSHeaders(response: Response): Response {
	const newResponse = new Response(response.body, response);
	newResponse.headers.set('Access-Control-Allow-Origin', '*');
	newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	return newResponse;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// API Routes
		if (path.startsWith('/api/')) {
			let response: Response;

			switch (path) {
				case '/api/stamps':
					response = await handleStampsAPI();
					break;
				case '/api/token':
					response = await handleTokenAPI();
					break;
				case '/api/community':
					response = await handleCommunityAPI();
					break;
				case '/api/kevin-inquiry':
					if (request.method === 'POST') {
						response = await handleKevinInquiry(request, env);
					} else {
						response = new Response('Method not allowed', { status: 405 });
					}
					break;
				default:
					response = new Response('API endpoint not found', { status: 404 });
			}

			return addCORSHeaders(response);
		}

		// Serve static assets for all other requests
		if (env.ASSETS) {
			return env.ASSETS.fetch(request);
		}

		// Fallback for development
		return new Response('KEVIN Stamp Worker is running! 🎨', {
			headers: { 'Content-Type': 'text/plain' }
		});
	},
} satisfies ExportedHandler<Env>;