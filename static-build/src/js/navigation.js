/**
 * Pixel Navigation - Vanilla JavaScript
 * KEVIN-themed navigation with pixel styling and responsive design
 * Preserves all KEVIN cultural elements and mobile functionality
 */
class PixelNavigation {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.isMenuOpen = false;
    this.currentLanguage = 'en'; // Default language
    
    // Navigation items with KEVIN cultural preservation
    this.navItems = [
      { path: '/', label: 'Home', icon: '🏠' },
      { path: '/lore.html', label: 'Lore', icon: '📖' },
      { path: '/stamps.html', label: 'Stamps', icon: '📊' },
      { path: '/community.html', label: 'Community', icon: '🎨' },
      { path: '/token.html', label: 'Token', icon: '💰' },
    ];

    this.init();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html')) return '/';
    return path;
  }

  init() {
    this.createNavigation();
    this.bindEvents();
  }

  createNavigation() {
    const nav = document.createElement('nav');
    nav.className = 'fixed top-0 w-full z-50 bg-kevin-charcoal border-b-2 border-kevin-orange backdrop-blur-sm';
    nav.innerHTML = `
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo with KEVIN ALL CAPS preservation -->
          <a href="/" class="flex items-center space-x-4 cursor-pointer">
            <div class="text-2xl font-pixel font-bold text-kevin-orange animate-pixel-bounce">
              K3V1N
            </div>
            <div class="text-kevin-neon text-sm hidden sm:block">
              [PIXEL_POWER.EXE]
            </div>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-4" id="desktop-nav">
            ${this.renderNavItems()}
            
            <!-- Language Toggle -->
            <div class="pixel-btn px-3 py-2 text-xs cursor-pointer" id="language-toggle">
              🌐 EN
            </div>
            
            <!-- Lazy Kevins Coming Soon Button with cultural preservation -->
            <div class="pixel-btn px-3 py-2 text-xs lazy-kevin-flash border-kevin-magenta cursor-pointer hover:animate-none relative overflow-hidden">
              <div class="relative z-10 font-bold">
                🚀 LAZY KEVINS SOON
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden pixel-btn px-3 py-2" id="mobile-menu-btn">
            <div class="w-4 h-4 flex flex-col justify-center space-y-1">
              <div class="w-full h-0.5 bg-black"></div>
              <div class="w-full h-0.5 bg-black"></div>
              <div class="w-full h-0.5 bg-black"></div>
            </div>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div class="md:hidden mt-4 terminal-window hidden" id="mobile-menu">
          <div class="space-y-2">
            ${this.renderMobileNavItems()}
            
            <!-- Mobile Lazy Kevins Button -->
            <div class="px-4 py-2 font-pixel text-xs">
              <div class="lazy-kevin-flash px-2 py-1 inline-block relative overflow-hidden">
                <span class="relative z-10 font-bold">🚀 LAZY KEVINS SOON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert navigation at the beginning of body
    document.body.insertBefore(nav, document.body.firstChild);
  }

  renderNavItems() {
    return this.navItems.map(item => `
      <a href="${item.path}" class="nav-item" data-path="${item.path}">
        <div class="pixel-btn px-4 py-2 text-sm transition-colors cursor-pointer ${
          this.currentPage === item.path 
            ? 'bg-kevin-neon text-black border-kevin-neon' 
            : 'bg-kevin-graphite text-white border-kevin-steel hover:bg-kevin-orange hover:text-black'
        }">
          <span class="mr-2">${item.icon}</span>
          ${item.label}
        </div>
      </a>
    `).join('');
  }

  renderMobileNavItems() {
    return this.navItems.map(item => `
      <a href="${item.path}" class="mobile-nav-item" data-path="${item.path}">
        <div class="block px-4 py-2 cursor-pointer font-pixel text-sm ${
          this.currentPage === item.path 
            ? 'text-kevin-orange' 
            : 'text-kevin-mint hover:text-kevin-orange'
        }">
          <span class="mr-2">${item.icon}</span>
          ${item.label}
        </div>
      </a>
    `).join('');
  }

  bindEvents() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        this.isMenuOpen = !this.isMenuOpen;
        mobileMenu.classList.toggle('hidden', !this.isMenuOpen);
      });

      // Close mobile menu when clicking nav items
      mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-nav-item')) {
          this.isMenuOpen = false;
          mobileMenu.classList.add('hidden');
        }
      });
    }

    // Language toggle (placeholder - could be connected to actual i18n)
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      languageToggle.addEventListener('click', () => {
        // Simple language cycling (could be expanded)
        const languages = ['EN', 'ES', 'FR', 'ZH', 'TR'];
        const currentIndex = languages.indexOf(this.currentLanguage.toUpperCase());
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex];
        
        this.currentLanguage = nextLang.toLowerCase();
        languageToggle.textContent = `🌐 ${nextLang}`;
        
        // Could trigger actual language change here
        console.log(`Language switched to: ${nextLang}`);
      });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.isMenuOpen = false;
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    });

    // Update active nav item on navigation
    window.addEventListener('popstate', () => {
      this.currentPage = this.getCurrentPage();
      this.updateActiveNavItems();
    });
  }

  updateActiveNavItems() {
    // Update desktop nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      const path = item.getAttribute('data-path');
      const btn = item.querySelector('.pixel-btn');
      if (path === this.currentPage) {
        btn.className = btn.className.replace(
          'bg-kevin-graphite text-white border-kevin-steel',
          'bg-kevin-neon text-black border-kevin-neon'
        );
      } else {
        btn.className = btn.className.replace(
          'bg-kevin-neon text-black border-kevin-neon',
          'bg-kevin-graphite text-white border-kevin-steel hover:bg-kevin-orange hover:text-black'
        );
      }
    });

    // Update mobile nav items
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      const path = item.getAttribute('data-path');
      const div = item.querySelector('div');
      if (path === this.currentPage) {
        div.className = div.className.replace(
          'text-kevin-mint hover:text-kevin-orange',
          'text-kevin-orange'
        );
      } else {
        div.className = div.className.replace(
          'text-kevin-orange',
          'text-kevin-mint hover:text-kevin-orange'
        );
      }
    });
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pixelNavigation = new PixelNavigation();
});

// Export for manual initialization if needed
window.PixelNavigation = PixelNavigation;