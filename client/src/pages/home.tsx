import PixelHero from "../components/pixel-hero";
import StampsGallery from "../components/stamps-gallery";
import CommunityGallery from "../components/community-gallery";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useLanguage } from "../lib/language-context";

export default function Home() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      motivation: formData.get("motivation") as string,
      budgetRange: formData.get("budgetRange") as string,
    };

    try {
      const response = await apiRequest("POST", "/api/kevin-inquiry", inquiryData);

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage("✓ " + result.message);
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await response.json();
        setSubmitMessage("✗ " + error.message);
      }
    } catch (error) {
      setSubmitMessage("✗ Error submitting form. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-kevin-charcoal text-white">
      {/* Hero Section */}
      <PixelHero />
      {/* Kevin Saga Section */}
      <section className="py-20 bg-kevin-graphite relative" aria-labelledby="kevin-saga-heading">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 id="kevin-saga-heading" className="font-pixel font-black text-5xl text-kevin-orange mb-4">{t.home.title}</h1>
            <div className="w-24 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-xl text-kevin-mint max-w-3xl mx-auto">
              Discover the <strong>ultimate Bitcoin mystery</strong> - 104 self-replicating stamps that created a <strong>digital legend</strong>.
              From <strong>blockchain phenomena</strong> to global <strong>OG memes</strong>, KEVIN represents the pinnacle of <strong>Bitcoin lore</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <div className="terminal-window">
                <h3 className="font-pixel text-2xl text-kevin-orange mb-4">&gt; {t.home.heroDescription}</h3>
                <p className="mb-4">{t.home.originDescription}</p>
                <p className="mb-4 text-kevin-orange">{t.home.machineEvolution}</p>
                <p className="mb-4">{t.home.storyDetails}</p>
                <p className="text-kevin-neon">{t.home.mysteryQuote}</p>
                <div className="mt-6 text-kevin-magenta">
                  &gt; {t.home.ghostBorn}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              {/* Timeline visualization */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-black border-2 border-kevin-orange">
                  <div className="w-8 h-8 bg-kevin-orange border-2 border-white pixel-perfect"></div>
                  <div>
                    <div className="font-pixel text-kevin-orange">STAMP #4258</div>
                    <div className="text-sm">{t.lore.ghostMachine.original}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-black border-2 border-kevin-magenta">
                  <div className="w-8 h-8 bg-kevin-magenta border-2 border-white pixel-perfect animate-pixel-glitch"></div>
                  <div>
                    <div className="font-pixel text-kevin-magenta">{t.stamps.anomaly}</div>
                    <div className="text-sm">{t.home.mysterySelfReplication}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-black border-2 border-kevin-neon">
                  <div className="w-8 h-8 bg-kevin-neon border-2 border-white pixel-perfect"></div>
                  <div>
                    <div className="font-pixel text-kevin-neon">STAMP #18430</div>
                    <div className="text-sm">{t.lore.legend.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* LORE Section - New Epic Feature */}
      <section className="py-20 bg-gradient-to-b from-purple-950 via-black to-purple-950 relative" aria-labelledby="lore-section-heading">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 id="lore-section-heading" className="font-pixel font-black text-6xl text-kevin-orange mb-4 animate-pixel-glow">
              KEVIN <span className="text-purple-400">LORE</span> - The Ultimate <strong>Bitcoin Mystery</strong>
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-kevin-orange to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-kevin-mint font-terminal max-w-4xl mx-auto">
              {t.lore.subtitle} - Uncover the <strong>blockchain phenomena</strong> that created a <strong>digital legend</strong> and birthed the first <strong>SRC-20 token</strong>
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-8" role="list">
              <div className="bg-black bg-opacity-50 border-2 border-kevin-green p-6 text-center" role="listitem">
                <div className="text-4xl mb-4" aria-hidden="true">🌟</div>
                <h3 className="font-pixel text-xl text-kevin-orange mb-3">{t.home.originsTitle}</h3>
                <p className="text-sm text-kevin-mint">
                  {t.home.originsSub} - Birth of <strong>digital artifacts</strong> on the <strong>Bitcoin blockchain</strong>
                </p>
              </div>

              <div className="bg-black bg-opacity-50 border-2 border-kevin-orange p-6 text-center" role="listitem">
                <div className="text-4xl mb-4" aria-hidden="true">👻</div>
                <h3 className="font-pixel text-xl text-kevin-orange mb-3">{t.home.mysteryTitle}</h3>
                <p className="text-sm text-kevin-mint">
                  {t.home.mysterySub} - The ultimate <strong>blockchain mystery</strong> that created a <strong>digital legend</strong>
                </p>
              </div>

              <div className="bg-black bg-opacity-50 border-2 border-purple-500 p-6 text-center" role="listitem">
                <div className="text-4xl mb-4" aria-hidden="true">🪙</div>
                <h3 className="font-pixel text-xl text-kevin-orange mb-3">{t.home.firstSrc20Token}</h3>
                <p className="text-sm text-kevin-mint">
                  {t.home.legendSub} - Pioneering <strong>SRC-20 protocol</strong> and <strong>meme token</strong> innovation
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/lore">
              <div className="pixel-btn px-10 py-5 text-black font-bold text-xl bg-gradient-to-r from-kevin-orange to-purple-600 border-kevin-orange cursor-pointer hover:from-purple-600 hover:to-kevin-orange transition-all">
                📖 {t.lore.title}
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* Preview: 91 Kevin Stamps */}
      <section className="py-20 bg-kevin-charcoal relative" aria-labelledby="stamps-gallery-heading">
        <div className="retro-grid absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 id="stamps-gallery-heading" className="font-pixel font-black text-5xl text-kevin-orange mb-4">
              104 <strong>KEVIN Stamps</strong> - Self-Replicating <strong>Digital Artifacts</strong>
            </h2>
            <div className="w-24 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-kevin-mint font-terminal max-w-2xl mx-auto">
              {t.stamps.subtitle} - Witness the <strong>blockchain phenomenon</strong> that created 104 identical yet legendary <strong>Bitcoin stamps</strong>
            </p>
          </div>

          <StampsGallery showAll={false} itemsPerPage={16} />

          <div className="text-center mt-12">
            <Link href="/stamps">
              <div className="pixel-btn px-8 py-4 text-black font-bold cursor-pointer">
                🎯 {t.stamps.title}
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* Preview: Community Gallery */}
      <section className="py-20 bg-kevin-graphite relative" aria-labelledby="community-gallery-heading">
        <div className="scanlines absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 id="community-gallery-heading" className="font-pixel font-black text-5xl text-kevin-orange mb-4">
              <strong>KEVIN Community</strong> - Global <strong>OG Memes</strong> & <strong>Digital Artifacts</strong>
            </h2>
            <div className="w-24 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-kevin-mint font-terminal max-w-2xl mx-auto">
              {t.community.subtitle} - Explore the wildest <strong>KEVIN creations</strong> from believers worldwide, featuring legendary <strong>meme culture</strong> and <strong>digital art</strong>
            </p>
          </div>

          <CommunityGallery showAll={false} itemsPerPage={16} />

          <div className="text-center mt-12">
            <Link href="/community">
              <div className="pixel-btn px-8 py-4 text-black font-bold bg-kevin-neon border-kevin-neon cursor-pointer">
                🎨 {t.community.title}
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* Token Preview */}
      <section className="py-20 bg-kevin-charcoal relative">
        <div className="retro-grid absolute inset-0 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-pixel font-black text-5xl text-kevin-orange mb-4">{t.token.title}</h2>
            <div className="w-24 h-1 bg-kevin-orange mx-auto mb-8"></div>
          </div>

          {/* Token Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12" role="list" aria-label="KEVIN token statistics">
            <div className="bg-black border-2 border-kevin-orange p-6 text-center" role="listitem">
              <div className="meme-counter text-3xl" aria-label="690 million total supply">690M</div>
              <div className="font-pixel text-kevin-orange text-sm mt-2">{t.token.description}</div>
            </div>
            <div className="bg-black border-2 border-kevin-neon p-6 text-center" role="listitem">
              <div className="meme-counter text-3xl" aria-label="17.8 BTC market capitalization">17.8</div>
              <div className="font-pixel text-kevin-neon text-sm mt-2">{t.token.marketCap}</div>
            </div>
            <div className="bg-black border-2 border-kevin-magenta p-6 text-center" role="listitem">
              <div className="meme-counter text-3xl" aria-label="2.1 thousand token holders">2.1K</div>
              <div className="font-pixel text-kevin-magenta text-sm mt-2">{t.token.holders}</div>
            </div>
            <div className="bg-black border-2 border-kevin-cyan p-6 text-center" role="listitem">
              <div className="meme-counter text-3xl" aria-label="269 BTC trading volume">269</div>
              <div className="font-pixel text-kevin-cyan text-sm mt-2">{t.token.volume}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/token">
                <div className="pixel-btn px-8 py-4 text-black font-bold cursor-pointer">
                  📊 {t.token.title}
                </div>
              </Link>
              <a 
                href="https://openstamp.io/market/src20/trading?ticker=KEVIN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="pixel-btn px-8 py-4 text-black font-bold bg-kevin-orange border-kevin-orange"
              >
                💰 {t.token.title}
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Kevin in Media Section */}
      <section className="py-20 bg-black relative" aria-labelledby="kevin-media-heading">
        <div className="scanlines absolute inset-0 opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 id="kevin-media-heading" className="font-pixel font-black text-5xl text-kevin-orange mb-4 animate-pixel-glow">
              KEVIN IN MEDIA - From <strong>Blockchain Mystery</strong> to <strong>Digital Legend</strong>
            </h2>
            <div className="w-24 h-1 bg-kevin-orange mx-auto mb-8"></div>
            <p className="text-xl text-kevin-mint font-terminal max-w-3xl mx-auto">
              KEVIN transcends the blockchain - Witness the <strong>ghost in the machine</strong> making legendary television appearances and becoming a global <strong>digital celebrity</strong>
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-b from-red-600 to-red-800 border-2 border-red-400 p-6 text-center">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="font-pixel text-xl text-white mb-3">EXIT VALLEY CRYPTO</h3>
                <p className="text-sm text-red-100 mb-4">Animated crypto sitcom featuring Kevin and legends saving the world from tyranny</p>
                <a 
                  href="https://youtu.be/rH80shM2f5s?si=viGXviwb4m7eNSKv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pixel-btn px-4 py-2 text-black font-bold bg-white border-white hover:bg-red-100 transition-colors"
                >
                  WATCH NOW
                </a>
              </div>
              
              <div className="bg-gradient-to-b from-blue-600 to-blue-800 border-2 border-blue-400 p-6 text-center">
                <div className="text-5xl mb-4">🎭</div>
                <h3 className="font-pixel text-xl text-white mb-3">ARWYN & FRIENDS</h3>
                <p className="text-sm text-blue-100 mb-4">Kevin's adventures with the Bitcoin Stamps crew in this epic series</p>
                <a 
                  href="https://www.youtube.com/watch?v=PipH4h3unHs&t=63s" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pixel-btn px-4 py-2 text-black font-bold bg-white border-white hover:bg-blue-100 transition-colors"
                >
                  WATCH NOW
                </a>
              </div>
              
              <div className="bg-gradient-to-b from-purple-600 to-purple-800 border-2 border-purple-400 p-6 text-center">
                <div className="text-5xl mb-4">📺</div>
                <h3 className="font-pixel text-xl text-white mb-3">KEVIN TV</h3>
                <p className="text-sm text-purple-100 mb-4">"We Are All Kevin" - Official YouTube channel for all Kevin content</p>
                <a
                  href="https://www.youtube.com/@thekevinstamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn px-4 py-2 text-black font-bold bg-white border-white hover:bg-purple-100 transition-colors"
                >
                  SUBSCRIBE
                </a>
              </div>
            </div>

            {/* YouTube Video Previews */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-black border-2 border-red-400 p-4">
                <h4 className="font-pixel text-red-400 text-lg mb-4 text-center">EXIT VALLEY CRYPTO - PREVIEW</h4>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/rH80shM2f5s"
                    title="Exit Valley Crypto"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              
              <div className="bg-black border-2 border-blue-400 p-4">
                <h4 className="font-pixel text-blue-400 text-lg mb-4 text-center">ARWYN & FRIENDS - PREVIEW</h4>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/PipH4h3unHs?start=63"
                    title="Arwyn & Friends"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-kevin-graphite border-2 border-kevin-orange p-6 inline-block">
                <h3 className="font-pixel text-2xl text-kevin-orange mb-2">Kevin: From Blockchain to Hollywood</h3>
                <p className="text-kevin-mint">A digital legend transcending into mainstream entertainment</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Exclusive Kevin Stamp Inquiry */}
      <section className="py-20 bg-gradient-to-b from-purple-950 via-black to-purple-950 relative">
        <div className="scanlines absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-pixel font-black text-4xl text-kevin-orange mb-4 animate-pixel-glow">COLLECT A KEVIN STAMP</h2>
              <div className="w-24 h-1 bg-kevin-orange mx-auto mb-6"></div>
              <p className="text-lg text-kevin-mint font-terminal mb-2">Exclusive • By Consultation Only • Next Generation Finance</p>
              <p className="text-sm text-purple-300">Kevin stamps represent officially guided collateral for sophisticated collectors</p>
            </div>

            <div className="bg-black bg-opacity-80 border-2 border-kevin-orange p-8 rounded-lg">
              <div className="mb-8">
                <div className="terminal-window inline-block mb-4">
                  <div className="font-pixel text-kevin-neon text-lg">
                    &gt; EXCLUSIVE_ACCESS.REQUEST
                  </div>
                </div>
                <p className="text-white leading-relaxed mb-6">
                  Kevin stamps are not publicly traded commodities. They are curated investments 
                  in Bitcoin history, available exclusively through private consultation. Each acquisition 
                  is carefully considered and personally guided.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleInquirySubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-pixel text-kevin-orange text-sm mb-2">
                      {t.home.contactForm.name} *
                    </label>
                    <input 
                      type="text"
                      name="name"
                      className="w-full bg-kevin-graphite border border-kevin-steel px-4 py-3 text-white font-mono focus:border-kevin-orange focus:outline-none"
                      placeholder={t.home.contactForm.placeholder.name}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-kevin-orange text-sm mb-2">
                      {t.home.contactForm.email} *
                    </label>
                    <input 
                      type="email"
                      name="email"
                      className="w-full bg-kevin-graphite border border-kevin-steel px-4 py-3 text-white font-mono focus:border-kevin-orange focus:outline-none"
                      placeholder={t.home.contactForm.placeholder.email}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-pixel text-kevin-orange text-sm mb-2">
                    {t.home.contactForm.message} *
                  </label>
                  <textarea 
                    name="motivation"
                    className="w-full bg-kevin-graphite border border-kevin-steel px-4 py-3 text-white font-mono focus:border-kevin-orange focus:outline-none h-24 resize-none"
                    placeholder={t.home.contactForm.placeholder.message}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block font-pixel text-kevin-orange text-sm mb-2">
                    INVESTMENT RANGE (BTC) *
                  </label>
                  <select name="budgetRange" className="w-full bg-kevin-graphite border border-kevin-steel px-4 py-3 text-white font-mono focus:border-kevin-orange focus:outline-none" required>
                    <option value="">Select your budget range</option>
                    <option value="1-2">1 - 2 BTC</option>
                    <option value="2-5">2 - 5 BTC</option>
                    <option value="5-10">5 - 10 BTC</option>
                    <option value="10+">10+ BTC (Elite Collector)</option>
                  </select>
                </div>

                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mt-1 bg-kevin-graphite border border-kevin-steel"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-white leading-relaxed">
                    I understand that Kevin stamps are exclusive collectibles available by 
                    consultation only. This inquiry does not guarantee acquisition rights.
                  </label>
                </div>

                {submitMessage && (
                  <div className={`text-center p-4 rounded border ${
                    submitMessage.startsWith('✓') 
                      ? 'bg-green-900 border-green-500 text-green-100' 
                      : 'bg-red-900 border-red-500 text-red-100'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                <div className="text-center pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`pixel-btn px-10 py-4 text-black font-bold text-lg transition-all ${
                      isSubmitting 
                        ? 'bg-gray-500 border-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-kevin-orange to-purple-600 border-kevin-orange hover:from-purple-600 hover:to-kevin-orange'
                    }`}
                  >
                    {isSubmitting ? "🔄 SUBMITTING..." : "🎯 SUBMIT RSVP REQUEST"}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-kevin-graphite text-center">
                <p className="text-xs text-kevin-steel">
                  All inquiries are reviewed personally. Response time: 48-72 hours.
                  <br />
                  Not investment advice. Kevin collecting is for sophisticated enthusiasts only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-black border-t-2 border-kevin-orange py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="font-pixel text-2xl text-kevin-orange mb-4">K3V1N</div>
              <div className="text-white text-sm leading-relaxed">
                The Ghost in the Machine<br />
                Feature, not a bug<br />
                Living legend on Bitcoin
              </div>
            </div>
            <div>
              <div className="font-pixel text-xl text-white mb-4 font-bold bg-black bg-opacity-80 px-2 py-1 rounded">LINKS</div>
              <div className="space-y-2 text-sm">
                <a href="https://stampchain.io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">Stampchain.io</a>
                <a href="https://openstamp.io/market/src20/trading?ticker=KEVIN" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">Trade KEVIN</a>
                <a href="https://memedepot.com/d/kevin-depot" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">Kevin Depot</a>
                <a href="https://kevin6942.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">Kevin Fan Site</a>
                <a href="https://twitter.com/stampchain" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">Twitter @stampchain</a>
                <a href="https://t.me/thekevinstamp" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">Telegram @thekevinstamp</a>
                <a href="https://github.com/stampchain-io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kevin-orange block font-bold bg-black bg-opacity-70 px-2 py-1 rounded">GitHub - Bitcoin Stamps</a>
                <Link href="/stamps"><div className="text-white hover:text-kevin-orange cursor-pointer font-bold bg-black bg-opacity-70 px-2 py-1 rounded">91 Stamps Gallery</div></Link>
              </div>
            </div>
            <div>
              <div className="font-pixel text-xl text-white mb-4 font-bold bg-black bg-opacity-50 px-2 py-1 rounded">LEGAL</div>
              <div className="text-sm text-white leading-relaxed font-semibold bg-black bg-opacity-30 px-2 py-1 rounded">
                Not investment advice.<br />
                Kevin is a meme.<br />
                DYOR. Ghost responsibly.
              </div>
            </div>
          </div>
          
          <div className="border-t border-kevin-graphite mt-8 pt-8 text-center">
            <div className="terminal-window inline-block bg-black bg-opacity-70 px-4 py-3 rounded border border-kevin-orange">
              <div className="font-pixel text-kevin-neon font-bold">
                &gt; KEVIN@BITCOIN:~$ echo "FEATURE_NOT_BUG" | hash256
              </div>
              <div className="text-white mt-2 font-semibold">
                0x4b6576696e20697320746865206768... [HASH_CONTINUES_FOREVER]
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
