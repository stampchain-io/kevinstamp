import TerminalText from "../components/terminal-text";
import { useQuery } from "@tanstack/react-query";
import { TokenData } from "../../shared/schema";

export default function Token() {
  const { data: tokenData, isLoading, error } = useQuery<TokenData>({
    queryKey: ["/api/token"],
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });

  const terminalLines = [
    "> QUERYING SRC-20 PROTOCOL...",
    "Loading KEVIN token data...",
    "Protocol: Bitcoin Stamps SRC-20",
    "Status: FIRST TOKEN EVER DEPLOYED",
    tokenData ? `Market status: ${tokenData.dataSource}` : "Market status: LOADING..."
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kevin-charcoal text-white pt-20 flex items-center justify-center">
        <div className="terminal-window p-8 text-center">
          <div className="font-pixel text-kevin-orange text-xl mb-4">Loading KEVIN Token Data...</div>
          <div className="text-kevin-neon">Connecting to OpenStamp API...</div>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-kevin-charcoal text-white pt-20 flex items-center justify-center">
        <div className="terminal-window p-8 text-center">
          <div className="font-pixel text-red-400 text-xl mb-4">Error Loading Token Data</div>
          <div className="text-white">Unable to connect to market data source.</div>
        </div>
      </div>
    );
  }

  const tokenStats = [
    { 
      label: "TOTAL SUPPLY", 
      value: tokenData.supply.toLocaleString(), 
      unit: "KEVIN", 
      color: "kevin-orange" 
    },
    { 
      label: "MARKET CAP", 
      value: tokenData.marketCapBTC.toString(), 
      unit: "BTC", 
      color: "kevin-neon" 
    },
    { 
      label: "HOLDERS", 
      value: tokenData.holders.toLocaleString(), 
      unit: "Wallets", 
      color: "kevin-magenta" 
    },
    { 
      label: "TOTAL VOLUME", 
      value: tokenData.totalVolBTC.toString(), 
      unit: "BTC", 
      color: "kevin-cyan" 
    },
  ];

  const deploymentInfo = [
    { label: "Deployment Stamp", value: `#${tokenData.deploymentStamp}` },
    { label: "Per Mint Limit", value: `${tokenData.perMintLimit.toLocaleString()} KEVIN` },
    { label: "Fair Launch Status", value: `${tokenData.fairLaunchMinted}% minted` },
    { label: "Protocol", value: tokenData.protocol },
    { 
      label: "24H Change", 
      value: `${tokenData.change24h > 0 ? '+' : ''}${tokenData.change24h}%` 
    },
    { label: "24H Volume", value: `${tokenData.vol24h} BTC` },
  ];

  return (
    <div className="min-h-screen bg-kevin-charcoal text-white pt-20">
      {/* Header */}
      <section className="py-20 bg-kevin-graphite relative">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-pixel font-black text-6xl text-kevin-orange mb-4">
              KEVIN TOKEN
            </h1>
            <div className="w-32 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-xl text-kevin-mint font-terminal mb-8">
              First SRC-20 token ever deployed on Bitcoin Stamps
            </p>
            
            <TerminalText 
              lines={terminalLines}
              typeSpeed={50}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Token Stats */}
      <section className="py-20 bg-kevin-charcoal relative">
        <div className="retro-grid absolute inset-0 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Main Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {tokenStats.map((stat, index) => (
              <div key={index} className={`bg-black border-2 border-${stat.color} p-6 text-center`}>
                <div className="meme-counter text-4xl mb-2">{stat.value}</div>
                <div className={`font-pixel text-${stat.color} text-sm mb-1`}>{stat.label}</div>
                <div className="text-xs text-white">{stat.unit}</div>
              </div>
            ))}
          </div>

          {/* Deployment Details */}
          <div className="terminal-window max-w-4xl mx-auto mb-12">
            <h2 className="font-pixel text-xl sm:text-2xl text-kevin-orange mb-6 break-words">
              &gt; TOKEN_DEPLOYMENT.DAT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="font-pixel text-base sm:text-lg text-kevin-neon mb-4">DEPLOYMENT INFO</h3>
                <div className="space-y-3">
                  {deploymentInfo.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-white text-sm break-words">{item.label}:</span>
                      <span className="text-kevin-orange font-pixel text-xs sm:text-sm break-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-pixel text-base sm:text-lg text-kevin-neon mb-4">MARKET DATA</h3>
                <div className="space-y-3">
                  {deploymentInfo.slice(3).map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-white text-sm break-words">{item.label}:</span>
                      <span className="text-kevin-orange font-pixel text-xs sm:text-sm break-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trading Section */}
          <div className="bg-black border-2 border-kevin-orange p-8 max-w-4xl mx-auto text-center">
            <h3 className="font-pixel text-2xl text-kevin-orange mb-6">
              TRADE KEVIN TOKEN
            </h3>
            <p className="text-white mb-8">
              KEVIN token is available for trading on multiple platforms with different trading pairs.
            </p>
            
            {/* Trading Platforms Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* OpenStamp */}
              <div className="bg-kevin-graphite border border-kevin-steel p-6">
                <div className="text-kevin-neon font-pixel text-lg mb-2">OPENSTAMP</div>
                <div className="text-white text-sm mb-3">KEVIN/BTC Trading Pair</div>
                <div className="text-kevin-orange text-xs mb-4">Original SRC-20 Marketplace</div>
                <a 
                  href={tokenData.tradeUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pixel-btn px-6 py-3 text-black font-bold bg-kevin-orange border-kevin-orange inline-block"
                >
                  TRADE ON OPENSTAMP
                </a>
              </div>

              {/* SuperEX */}
              <div className="bg-kevin-graphite border border-kevin-steel p-6">
                <div className="text-kevin-cyan font-pixel text-lg mb-2">SUPEREX</div>
                <div className="text-white text-sm mb-1">KEVIN/USDT Trading Pair</div>
                <div className="text-kevin-mint text-xs mb-1">
                  Current Price: ${tokenData.superExPrice?.toFixed(5) || '0.00246'}
                </div>
                <div className="text-kevin-mint text-xs mb-1">
                  24h Volume: {tokenData.superExVolume?.toFixed(2) || '3.74'}K USDT
                </div>
                <div className="text-kevin-magenta text-xs mb-4">Web 3.0 Exchange</div>
                <a 
                  href={tokenData.superExUrl || "https://www.superex.com/trade/KEVIN_USDT"}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pixel-btn px-6 py-3 text-black font-bold bg-kevin-cyan border-kevin-cyan inline-block"
                >
                  TRADE ON SUPEREX
                </a>
              </div>
            </div>
            
            <div className="text-center text-sm text-kevin-steel mb-4">
              *Not investment advice. DYOR. Ghost trading only.
            </div>

            <div className="text-center text-xs text-kevin-mint border-t border-kevin-steel pt-4">
              <div className="mb-1">Data Source: {tokenData.dataSource}</div>
              <div>Last Updated: {new Date(tokenData.lastUpdated).toLocaleString()}</div>
              <div className="mt-1 text-kevin-cyan">Refreshing every 30 seconds</div>
            </div>
          </div>

          {/* Protocol Information */}
          <div className="terminal-window max-w-4xl mx-auto mt-12">
            <h3 className="font-pixel text-xl text-kevin-orange mb-4">
              &gt; SRC20_PROTOCOL.INFO
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-kevin-neon font-pixel mb-2">WHAT IS SRC-20?</div>
                <div className="text-white">
                  SRC-20 is the first multi-fungible token standard built directly on Bitcoin's UTXO model 
                  through Bitcoin Stamps, enabling true fungible tokens on the Bitcoin blockchain with 
                  guaranteed immutability and permanent storage.
                </div>
              </div>
              <div>
                <div className="text-kevin-magenta font-pixel mb-2">KEVIN'S SIGNIFICANCE</div>
                <div className="text-white">
                  KEVIN was the very first SRC-20 token ever deployed, making it the genesis multi-fungible 
                  token on Bitcoin's UTXO. Created during experimental testing, it became a historic milestone 
                  and community phenomenon as the first of its kind.
                </div>
              </div>
              <div>
                <div className="text-kevin-cyan font-pixel mb-2">FAIR LAUNCH</div>
                <div className="text-white">
                  KEVIN had a completely fair launch with no pre-mine. All tokens were minted 
                  by the community through the standard SRC-20 minting process.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Context */}
      <section className="py-20 bg-kevin-graphite relative">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-pixel font-black text-4xl text-kevin-orange mb-4">
              KEVIN IN HISTORY
            </h2>
            <div className="w-24 h-1 bg-kevin-orange mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-black border-2 border-kevin-neon p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-4 h-4 bg-kevin-neon"></div>
                  <div className="font-pixel text-kevin-neon">THE BEGINNING</div>
                </div>
                <div className="text-white">
                  When SRC-20 development began, creating tokens wasn't the priority. The team 
                  was investigating the technology and needed test tokens. They chose "STAMP" and "KEVIN" 
                  for testing, but due to blockchain timing, KEVIN deployed first.
                </div>
              </div>

              <div className="bg-black border-2 border-kevin-magenta p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-4 h-4 bg-kevin-magenta"></div>
                  <div className="font-pixel text-kevin-magenta">THE ANOMALY</div>
                </div>
                <div className="text-white">
                  Mysteriously, the very first SRC-20 token ever deployed was a KEVIN pre-mint 
                  that somehow appeared on the blockchain before anything else. This cemented KEVIN's 
                  place as the true genesis token.
                </div>
              </div>

              <div className="bg-black border-2 border-kevin-orange p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-4 h-4 bg-kevin-orange"></div>
                  <div className="font-pixel text-kevin-orange">THE LEGEND</div>
                </div>
                <div className="text-white">
                  Both KEVIN and STAMP became huge successes, but KEVIN's mysterious origins 
                  and the 91 stamp anomaly created an unstoppable cultural phenomenon. 
                  Kevin truly is a feature, not a bug.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
