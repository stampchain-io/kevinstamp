import { Link } from "wouter";

export default function LorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-kevin-green font-mono">
      {/* Header */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 pixel-text animate-pixel-glow leading-tight">
            THE KEVIN SAGA
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-kevin-orange animate-pulse">
            Origins • Mystery • Legend
          </p>
        </div>

        {/* Origins Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-kevin-orange border-b-2 border-kevin-orange pb-2">
            🌟 ORIGINS: THE BIRTH OF BITCOIN ART
          </h2>

          <div className="bg-black border-2 border-kevin-green p-6 md:p-8 rounded-lg mb-8">
            <p className="text-lg leading-relaxed mb-6 text-white font-semibold">
              Bitcoin Stamps emerged from the Counterparty protocol, where many
              of the original Bitcoin pioneers gathered from 2016 onwards to
              create art and tokens on Bitcoin. The first person to create a
              wallet capable of holding what would become Rare Pepes and then
              NFTs was Joe Looney, who went on to be called the "Godfather of
              NFTs."
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-900 bg-opacity-30 p-4 rounded border border-kevin-orange">
                <h3 className="text-xl font-bold text-kevin-orange mb-3">
                  JOELOONEYBIN
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>Artist: DanDarkPill</li>
                  <li>Series: #8, Card: #38</li>
                  <li>Supply: 100</li>
                  <li>Floor: 4.357Ξ</li>
                  <li>Market cap: $53.5k</li>
                </ul>
              </div>

              <div className="bg-purple-900 bg-opacity-30 p-4 rounded border border-kevin-orange">
                <h3 className="text-xl font-bold text-kevin-orange mb-3">
                  FLOONEYBIN
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>Artist: Booo_Urns</li>
                  <li>Series: #6, Card: #10</li>
                  <li>Supply: 70</li>
                  <li>Floor: 0.336Ξ</li>
                  <li>Market cap: $82.87k</li>
                </ul>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white font-semibold">
              It was in this secret cabal, of which Mike in Space was a member,
              that he met Arwyn. After Mike had the idea to pursue truly
              immutable data storage on Bitcoin, Arwyn began building with him
              and introduced his friend Kevin - the subject of this website and
              where our story truly begins.
            </p>
          </div>
        </div>

        {/* The Ghost in the Machine */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-kevin-orange border-b-2 border-kevin-orange pb-2">
            👻 THE GHOST IN THE MACHINE
          </h2>

          <div className="bg-black border-2 border-kevin-green p-6 md:p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex-shrink-0">
                <img
                  src="https://stampchain.io/content/6c7ff116f4ac8fe76d763946e9d917ca270f3b95c3b3949a478635fa617324ca.png"
                  alt="Kevin - The Original"
                  className="pixel-perfect w-32 h-32 border-4 border-kevin-orange bg-black animate-pixel-float"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-kevin-orange mb-4">
                  Stamp #4258: The Original
                </h3>
                <p className="text-lg leading-relaxed mb-4 text-white font-semibold">
                  When stampchain.io was launched and things were going well,
                  Arwyn created Stamp #4258 - a portrait of our glorious new DEV
                  Kevin, intended as a one-off commemorative gift. But that's
                  where the magic started.
                </p>
                <p className="text-lg leading-relaxed text-white font-semibold">
                  For reasons unknown, the stamping machine took on a mind of
                  its own. Instead of creating just one stamp, it began printing
                  Kevin again and again, periodically re-stamping the same
                  image.
                </p>
              </div>
            </div>

            <div className="bg-purple-900 bg-opacity-50 p-6 rounded-lg border border-kevin-orange mb-6">
              <h3 className="text-xl font-bold text-kevin-orange mb-4 text-center">
                🔥 THE KEVIN MANIFESTATION 🔥
              </h3>
              <div className="text-center space-y-2">
                <p className="text-lg">From Stamp #4258 to Stamp #18430</p>
                <p className="text-3xl font-bold text-kevin-orange">
                  91 KEVIN STAMPS
                </p>
                <p className="text-lg">
                  All byte-perfect duplicates, yet each one unique and legendary
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-6 text-white font-semibold">
              To this day, nobody knows what caused these stamps to start
              minting themselves, and nobody knows why they stopped. This was a
              unique moment - the birth of a ghost in the machine. Any stamp
              could have been chosen to cause this error in the minting process,
              but it was the Kevin stamp - based on the creator of the stamping
              machine himself - that issued itself into existence and folklore.
            </p>

            <div className="text-center p-6 bg-gradient-to-r from-kevin-orange to-purple-600 rounded-lg">
              <p className="text-2xl font-bold text-black mb-2">
                THE LEGENDARY QUOTE
              </p>
              <p className="text-xl font-bold text-black italic">
                "Kevin is a feature, not a bug. Kevin is the ghost in the
                machine."
              </p>
            </div>
          </div>
        </div>

        {/* KEVIN Token Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-kevin-orange border-b-2 border-kevin-orange pb-2">
            🪙 KEVIN: THE FIRST SRC-20 TOKEN
          </h2>

          <div className="bg-black border-2 border-kevin-green p-6 md:p-8 rounded-lg">
            <p className="text-lg leading-relaxed mb-6 text-white font-semibold">
              When development began on the SRC-20 protocol, creating tokens
              wasn't initially a priority. The team was merely investigating the
              technology, experimenting to discover what was possible. Testing
              was needed with a couple of tokens, so it was decided to test with
              and "KEVIN" to see if the protocol worked.
            </p>

            <div className="bg-purple-900 bg-opacity-50 p-6 rounded-lg border border-kevin-orange mb-6">
              <h3 className="text-xl font-bold text-kevin-orange mb-4 text-center">
                ⚡ THE BLOCKCHAIN GODS INTERVENE ⚡
              </h3>
              <p className="text-lg leading-relaxed text-center">
                Mysteriously the very first SRC token ever
                deployed was a actually a KEVIN pre-mint token that somehow got
                picked on the blockchain before anything else.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-900 bg-opacity-30 p-4 rounded border border-kevin-orange">
                <h3 className="text-xl font-bold text-kevin-orange mb-3">
                  TOKEN DETAILS
                </h3>
                <ul className="space-y-2">
                  <li>
                    <span className="text-kevin-orange">Deployed:</span> Stamp
                    #18516
                  </li>
                  <li>
                    <span className="text-kevin-orange">Max Supply:</span>{" "}
                    690,000,000
                  </li>
                  <li>
                    <span className="text-kevin-orange">Per Mint:</span> 420,000
                  </li>
                  <li>
                    <span className="text-kevin-orange">Status:</span> First
                    SRC-20 Ever
                  </li>
                  <li>
                    <span className="text-kevin-orange">Minted:</span> 153.92%
                    (Overminted!)
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900 bg-opacity-30 p-4 rounded border border-kevin-orange">
                <h3 className="text-xl font-bold text-kevin-orange mb-3">
                  MARKET STATS
                </h3>
                <ul className="space-y-2">
                  <li>
                    <span className="text-kevin-orange">Market Cap:</span>{" "}
                    17.802 BTC
                  </li>
                  <li>
                    <span className="text-kevin-orange">Total Volume:</span>{" "}
                    269.22 BTC
                  </li>
                  <li>
                    <span className="text-kevin-orange">Holders:</span> 2,130
                  </li>
                  <li>
                    <span className="text-kevin-orange">Protocol:</span> SRC-20
                  </li>
                  <li>
                    <Link
                      href="/token"
                      className="text-kevin-orange hover:text-white underline"
                    >
                      View Live Stats →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* The Legend Continues */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-kevin-orange border-b-2 border-kevin-orange pb-2">
            🎬 THE LEGEND CONTINUES
          </h2>

          <div className="bg-black border-2 border-kevin-green p-6 md:p-8 rounded-lg">
            <p className="text-lg leading-relaxed mb-6 text-white font-semibold">
              KEVIN has evolved into a global meme. A digital celebrity was
              created - one who embodies the best of what we can all be, that
              Satoshi within ourselves. A digital gentleman and James Bond, the
              pinnacle of Bitcoin spirit. Kevin has been memed around the world
              and is growing rapidly into his future destiny.
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-kevin-orange p-6 rounded-lg text-center mb-6">
              <h3 className="text-2xl font-bold text-black mb-4">
                KEVIN ON TELEVISION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-black">
                    "EXIT VALLEY CRYPTO"
                  </p>
                  <p className="text-sm text-black">
                    Animated crypto sitcom featuring legends saving the world
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">
                    "ARWYN & FRIENDS"
                  </p>
                  <p className="text-sm text-black">
                    Kevin's adventures with the Bitcoin Stamps crew
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-bold text-black">
                    📺 KEVIN TV - "WE ARE ALL KEVIN"
                  </p>
                  <p className="text-sm text-black">
                    Official YouTube channel for all Kevin content
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <a 
                href="https://youtu.be/rH80shM2f5s?si=viGXviwb4m7eNSKv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-3 rounded-lg font-bold text-center hover:bg-red-700 transition-colors"
              >
                🎬 Exit Valley Crypto
              </a>
              <a 
                href="https://www.youtube.com/watch?v=PipH4h3unHs&t=63s" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-center hover:bg-blue-700 transition-colors"
              >
                🎭 Arwyn & Friends
              </a>
              <a 
                href="https://www.youtube.com/@weareallkevin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-purple-600 text-white px-4 py-3 rounded-lg font-bold text-center hover:bg-purple-700 transition-colors"
              >
                📺 KEVIN TV Channel
              </a>
            </div>

            <div className="text-center">
              <Link
                href="/community"
                className="inline-block bg-kevin-orange text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition-colors"
              >
                Explore Kevin's Community →
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/stamps"
              className="bg-purple-900 text-kevin-green px-6 py-3 rounded border border-kevin-green hover:bg-kevin-green hover:text-black transition-colors"
            >
              View The 91 Stamps
            </Link>
            <Link
              href="/community"
              className="bg-purple-900 text-kevin-green px-6 py-3 rounded border border-kevin-green hover:bg-kevin-green hover:text-black transition-colors"
            >
              Community Gallery
            </Link>
            <Link
              href="/token"
              className="bg-purple-900 text-kevin-green px-6 py-3 rounded border border-kevin-green hover:bg-kevin-green hover:text-black transition-colors"
            >
              KEVIN Token Stats
            </Link>
            <Link
              href="/"
              className="bg-purple-900 text-kevin-green px-6 py-3 rounded border border-kevin-green hover:bg-kevin-green hover:text-black transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
