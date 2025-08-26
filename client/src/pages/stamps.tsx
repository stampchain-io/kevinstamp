import StampsGallery from "../components/stamps-gallery";
import TerminalText from "../components/terminal-text";
import { useLanguage } from "../lib/language-context";

export default function Stamps() {
  const { t } = useLanguage();
  const terminalLines = [
    "> SCANNING BITCOIN BLOCKCHAIN...",
    "Searching for Kevin signatures...", 
    "Found 104 matching stamps",
    "Range: #4258 to #18430",
    "Status: LEGENDARY COLLECTION COMPLETE"
  ];

  return (
    <div className="min-h-screen bg-kevin-charcoal text-white pt-20">
      {/* Header */}
      <section className="py-20 bg-kevin-graphite relative">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-pixel font-black text-6xl text-kevin-orange mb-4">
              {t.stamps.title}
            </h1>
            <div className="w-32 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-xl text-kevin-mint font-terminal mb-8">
              {t.stamps.subtitle}
            </p>
            
            <TerminalText 
              lines={terminalLines}
              typeSpeed={30}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-kevin-charcoal relative">
        <div className="retro-grid absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Gallery Description */}
          <div className="terminal-window max-w-4xl mx-auto mb-12">
            <h2 className="font-pixel text-2xl text-kevin-orange mb-4">
              &gt; THE_ANOMALY.DAT
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-kevin-neon mb-2">Original Stamp: #4258</div>
                <div className="text-white mb-2">Final Stamp: #18430</div>
                <div className="text-white mb-2">Total Count: 104 stamps</div>
                <div className="text-kevin-orange mb-2">Status: Byte-perfect duplicates</div>
              </div>
              <div>
                <div className="text-kevin-neon mb-2">Cause: Unknown machine error</div>
                <div className="text-white mb-2">Pattern: Irregular intervals</div>
                <div className="text-white mb-2">Trigger: Self-replication protocol</div>
                <div className="text-kevin-orange mb-2">Result: Bitcoin legend born</div>
              </div>
            </div>
          </div>

          <StampsGallery showAll={true} />

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-black border-2 border-kevin-orange p-8 max-w-2xl mx-auto">
              <h3 className="font-pixel text-2xl text-kevin-orange mb-4">
                EXPERIENCE THE LEGEND
              </h3>
              <p className="text-white mb-6">
                Each stamp links directly to stampchain.io where you can view the full blockchain data, 
                transaction history, and technical details of these mysterious artifacts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://stampchain.io/stamp/4258" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pixel-btn px-8 py-4 text-black font-bold"
                >
                  🎯 VIEW ORIGINAL #4258
                </a>
                <a 
                  href="https://openstamp.io/market/src20/trading?ticker=KEVIN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pixel-btn px-8 py-4 text-black font-bold bg-kevin-neon border-kevin-neon"
                >
                  💰 TRADE KEVIN TOKEN
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
