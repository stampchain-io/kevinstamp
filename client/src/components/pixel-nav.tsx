import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function PixelNav() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "HOME", icon: "🏠" },
    { path: "/lore", label: "LORE", icon: "📖" },
    { path: "/stamps", label: "STAMPS", icon: "📊" },
    { path: "/community", label: "MEMES", icon: "🎨" },
    { path: "/token", label: "TOKEN", icon: "💰" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-kevin-charcoal border-b-2 border-kevin-orange backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="text-2xl font-pixel font-bold text-kevin-orange animate-pixel-bounce">
                K3V1N
              </div>
              <div className="text-kevin-neon text-sm hidden sm:block">
                [PIXEL_POWER.EXE]
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div className={`
                  pixel-btn px-4 py-2 text-sm transition-colors cursor-pointer
                  ${location === item.path 
                    ? 'bg-kevin-neon text-black border-kevin-neon' 
                    : 'bg-kevin-graphite text-white border-kevin-steel hover:bg-kevin-orange hover:text-black'
                  }
                `}>
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            ))}
            
            {/* Lazy Kevins Coming Soon Button */}
            <div className="pixel-btn px-3 py-2 text-xs lazy-kevin-flash border-kevin-magenta cursor-pointer hover:animate-none relative overflow-hidden">
              <div className="relative z-10 font-bold">
                🚀 LAZY KEVINS
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden pixel-btn px-3 py-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-4 h-4 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-black"></div>
              <div className="w-full h-0.5 bg-black"></div>
              <div className="w-full h-0.5 bg-black"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 terminal-window">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`
                      block px-4 py-2 cursor-pointer font-pixel text-sm
                      ${location === item.path 
                        ? 'text-kevin-orange' 
                        : 'text-kevin-mint hover:text-kevin-orange'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              ))}
              
              {/* Mobile Lazy Kevins Button */}
              <div className="px-4 py-2 font-pixel text-xs">
                <div className="lazy-kevin-flash px-2 py-1 inline-block relative overflow-hidden">
                  <span className="relative z-10 font-bold">🚀 LAZY KEVINS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
