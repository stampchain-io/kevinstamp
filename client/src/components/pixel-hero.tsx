import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function PixelHero() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const terminalLines = [
    "> KEVIN@BITCOIN:~$ cat ghost_status.txt",
    "STATUS: ACTIVE",
    "LOCATION: EVERYWHERE ON BLOCKCHAIN", 
    "ANOMALY: SELF-REPLICATING STAMPS DETECTED",
    'MESSAGE: "I AM A FEATURE, NOT A BUG"'
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative retro-grid pt-20">
      <div className="scanlines absolute inset-0"></div>
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        
        {/* Floating Kevin */}
        <div className="mb-12 flex justify-center">
          <div className="relative animate-pixel-float">
            {/* Main Kevin Image */}
            <div className="relative">
              <img 
                src="https://stampchain.io/api/image/4258" 
                alt="Kevin - The Ghost in the Machine" 
                className={`
                  pixel-perfect w-32 h-32 border-4 border-kevin-orange bg-black scanlines relative z-10
                  ${glitchActive ? 'animate-pixel-glitch' : ''}
                `}
              />
              
              {/* Glitch duplicate layers */}
              <img 
                src="https://stampchain.io/api/image/4258" 
                alt="" 
                className="pixel-perfect w-32 h-32 absolute top-0 left-0 opacity-30 animate-pixel-glitch"
                style={{ filter: 'hue-rotate(120deg)' }}
              />
            </div>
            
            {/* Speech Bubble */}
            <div className="speech-bubble absolute -right-40 -top-8 hidden lg:block">
              <div className="font-pixel text-black text-sm">FEATURE NOT BUG!</div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-8">
          <h1 className="font-pixel font-black text-6xl md:text-8xl mb-4">
            <span className="text-kevin-orange animate-pixel-glitch inline-block">K</span>
            <span className="text-white">E</span>
            <span className="text-kevin-neon">V</span>
            <span className="text-kevin-magenta">I</span>
            <span className="text-kevin-cyan">N</span>
          </h1>
          <div className="text-2xl md:text-3xl font-terminal text-kevin-neon mb-4">
            &gt; PIXEL_POWER.EXE LOADING<span className="animate-terminal-cursor">_</span>
          </div>
          <div className="text-xl text-white font-pixel">
            THE GHOST IN THE MACHINE
          </div>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
          <div className="text-center border-2 border-kevin-orange bg-black p-4">
            <div className="meme-counter text-4xl">91</div>
            <div className="text-kevin-orange font-pixel text-sm">STAMPS</div>
          </div>
          <div className="text-center border-2 border-kevin-neon bg-black p-4">
            <div className="meme-counter text-4xl">67</div>
            <div className="text-kevin-neon font-pixel text-sm">MEMES</div>
          </div>
          <div className="text-center border-2 border-kevin-magenta bg-black p-4">
            <div className="meme-counter text-4xl">690M</div>
            <div className="text-kevin-magenta font-pixel text-sm">SUPPLY</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link href="/stamps">
            <div className="pixel-btn px-8 py-4 text-black font-bold cursor-pointer">
              VIEW 91 STAMPS
            </div>
          </Link>
          <a 
            href="https://openstamp.io/market/src20/trading?ticker=KEVIN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pixel-btn px-8 py-4 text-black font-bold bg-kevin-neon border-kevin-neon"
          >
            TRADE KEVIN
          </a>
        </div>

        {/* Terminal Message */}
        <div className="terminal-window max-w-2xl mx-auto text-left">
          <div className="mb-2">KEVIN@BITCOIN:~$ cat ghost_status.txt</div>
          <div className="text-white">STATUS: ACTIVE</div>
          <div className="text-white">LOCATION: EVERYWHERE ON BLOCKCHAIN</div>
          <div className="text-kevin-orange">ANOMALY: SELF-REPLICATING STAMPS DETECTED</div>
          <div className="text-kevin-neon">MESSAGE: "I AM A FEATURE, NOT A BUG"</div>
          <div className="mt-2">KEVIN@BITCOIN:~$ <span className="animate-terminal-cursor">_</span></div>
        </div>
      </div>
    </section>
  );
}
