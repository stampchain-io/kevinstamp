import CommunityGallery from "../components/community-gallery";
import TerminalText from "../components/terminal-text";
import { useLanguage } from "../lib/language-context";

export default function Community() {
  const { t } = useLanguage();
  const terminalLines = [
    "> CONNECTING TO KEVIN DEPOT...",
    "Scanning community creations...",
    "Found 67 memes across all formats",
    "Artists detected: 12 creative minds",
    "Status: EPIC CREATIVITY LEVELS ACHIEVED"
  ];

  return (
    <div className="min-h-screen bg-kevin-charcoal text-white pt-20">
      {/* Header */}
      <section className="py-20 bg-kevin-graphite relative">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="font-pixel font-black text-6xl text-kevin-orange mb-4">
              {t.community.title}
            </h1>
            <div className="w-32 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-xl text-kevin-mint font-terminal mb-8">
              {t.community.subtitle}
            </p>
            
            <TerminalText 
              lines={terminalLines}
              typeSpeed={40}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Featured Highlights */}
      <section className="py-12 bg-kevin-charcoal relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="terminal-window max-w-4xl mx-auto mb-12">
            <h2 className="font-pixel text-2xl text-kevin-orange mb-4">
              &gt; FEATURED_HIGHLIGHTS.LOG
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-kevin-neon font-pixel text-lg mb-2">KEVIN 4 PRESIDENT</div>
                <div className="text-white text-sm">Political campaign memes showcasing Kevin's leadership potential</div>
              </div>
              <div className="text-center">
                <div className="text-kevin-magenta font-pixel text-lg mb-2">AGENT 007 KEVIN</div>
                <div className="text-white text-sm">Spy-themed artwork featuring Kevin as a secret agent</div>
              </div>
              <div className="text-center">
                <div className="text-kevin-cyan font-pixel text-lg mb-2">ANIMATED KEVIN</div>
                <div className="text-white text-sm">Dynamic videos and GIFs bringing Kevin to life</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-kevin-charcoal relative">
        <div className="retro-grid absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <CommunityGallery showAll={true} />

          {/* Kevin Depot Info */}
          <div className="text-center mt-16">
            <div className="bg-black border-2 border-kevin-neon p-8 max-w-2xl mx-auto">
              <h3 className="font-pixel text-2xl text-kevin-neon mb-4">
                KEVIN DEPOT HQ
              </h3>
              <p className="text-white mb-6">
                The official community hub hosted on MemeDepot where Kevin believers share their 
                wildest creations. From political campaigns to surfer Kevin, the creativity knows no bounds.
              </p>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-kevin-orange font-pixel">DEPOT STATS</div>
                    <div className="text-white">67 Total Memes</div>
                    <div className="text-white">727 Total Views</div>
                  </div>
                  <div>
                    <div className="text-kevin-cyan font-pixel">CATEGORIES</div>
                    <div className="text-white">Images, Videos, GIFs</div>
                    <div className="text-white">All formats welcome</div>
                  </div>
                </div>
              </div>
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

          {/* Community Guidelines */}
          <div className="terminal-window max-w-4xl mx-auto mt-12">
            <h3 className="font-pixel text-xl text-kevin-orange mb-4">
              &gt; COMMUNITY_GUIDELINES.TXT
            </h3>
            <div className="space-y-2 text-sm">
              <div className="text-kevin-neon">• All Kevin memes welcome - images, videos, GIFs, art</div>
              <div className="text-white">• Keep it creative and respectful to the Kevin spirit</div>
              <div className="text-white">• Share your creations on Kevin Depot for maximum visibility</div>
              <div className="text-kevin-magenta">• Remember: Kevin is a feature, not a bug! 🚀</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
