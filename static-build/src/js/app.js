/**
 * KEVIN Static Site - Main Application Controller
 * Orchestrates all static components with KEVIN cultural preservation
 * Maintains functionality equivalent to original React application
 */
import { LanguageManager } from './translations.js';

/**
 * Main application class for KEVIN static site
 * Preserves all cultural elements and interactive functionality
 */
class KevinApp {
  constructor() {
    this.languageManager = null;
    this.matrixRain = null;
    this.navigation = null;
    this.isSubmitting = false;
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize language manager
      this.languageManager = window.languageManager || new LanguageManager();
      
      // Initialize components
      this.initializeComponents();
      this.bindEvents();
      
      // Update content with current language
      this.languageManager.updatePageContent();
      
      console.log('🔥 KEVIN Static App Initialized - Ghost in the Machine Active 🔥');
    } catch (error) {
      console.error('Error initializing KEVIN app:', error);
    }
  }

  initializeComponents() {
    // Matrix Rain is auto-initialized by its module
    this.matrixRain = window.matrixRain;
    
    // Navigation is auto-initialized by its module  
    this.navigation = window.pixelNavigation;
    
    // Initialize form handlers
    this.initializeContactForm();
    
    // Initialize performance monitoring (placeholder)
    this.initializePerformanceTracking();
    
    // Initialize scroll animations
    this.initializeScrollAnimations();
  }

  initializeContactForm() {
    const form = document.getElementById('kevin-inquiry-form');
    const messageDiv = document.getElementById('form-message');

    if (form && messageDiv) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
          submitButton.textContent = this.languageManager.t('buttons.submitting');
          submitButton.disabled = true;
          
          const formData = new FormData(form);
          const inquiryData = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            budgetRange: formData.get('budgetRange'),
            timestamp: new Date().toISOString(),
            source: 'kevin-static-site'
          };
          
          // For static version, we'll show a success message
          // In production, this would connect to a serverless function or API
          await this.simulateApiCall(inquiryData);
          
          messageDiv.innerHTML = `<span class="text-kevin-neon">✓ Thank you for your inquiry! We'll be in touch about exclusive KEVIN stamp opportunities.</span>`;
          form.reset();
          
          // Track form submission (placeholder for analytics)
          this.trackEvent('form_submit', 'kevin_inquiry');
          
        } catch (error) {
          console.error('Form submission error:', error);
          messageDiv.innerHTML = `<span class="text-red-500">✗ Error submitting form. Please try again or contact us directly.</span>`;
        } finally {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          this.isSubmitting = false;
          
          // Clear message after 10 seconds
          setTimeout(() => {
            messageDiv.innerHTML = '';
          }, 10000);
        }
      });
    }
  }

  async simulateApiCall(data) {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, this would be a real API call:
    // const response = await fetch('/api/kevin-inquiry', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    
    console.log('KEVIN inquiry submitted:', data);
  }

  bindEvents() {
    // Listen for language changes
    window.addEventListener('languageChanged', (e) => {
      console.log('Language changed to:', e.detail.language);
      this.updateUIForLanguage(e.detail.language);
    });

    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Handle keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
      // Press 'K' to trigger KEVIN easter egg
      if (e.key.toLowerCase() === 'k' && !e.target.matches('input, textarea, select')) {
        this.kevinEasterEgg();
      }
    });

    // Handle scroll events for animations
    window.addEventListener('scroll', () => {
      this.handleScrollAnimations();
    });

    // Handle resize events
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  updateUIForLanguage(language) {
    // Update HTML lang attribute
    document.documentElement.lang = language;
    
    // Update form placeholders that use data-translate-placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      element.placeholder = this.languageManager.t(key);
    });
    
    // Update page title if needed
    const titleKey = document.querySelector('[data-page-title]')?.getAttribute('data-page-title');
    if (titleKey) {
      document.title = this.languageManager.t(titleKey);
    }
  }

  initializePerformanceTracking() {
    // Track page load performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('🚀 KEVIN Site Performance:', {
            loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
            firstPaint: this.getFirstPaintTime()
          });
        }
      }
    });

    // Monitor for Core Web Vitals
    this.observeWebVitals();
  }

  getFirstPaintTime() {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? Math.round(firstPaint.startTime) : null;
    } catch (error) {
      return null;
    }
  }

  observeWebVitals() {
    // Observe Largest Contentful Paint (LCP)
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcpEntry = entries[entries.length - 1];
        console.log('📊 LCP:', Math.round(lcpEntry.startTime));
      });
      observer.observe({entryTypes: ['largest-contentful-paint']});
    } catch (error) {
      // Not supported in this browser
    }
  }

  initializeScrollAnimations() {
    // Initialize Intersection Observer for fade-in animations
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            this.scrollObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe elements that should animate on scroll
      document.querySelectorAll('.terminal-window, .pixel-btn').forEach(el => {
        this.scrollObserver.observe(el);
      });
    }
  }

  handleScrollAnimations() {
    // Add parallax effect to hero section
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('section[aria-labelledby="hero-heading"]');
    
    if (heroSection && scrolled < window.innerHeight) {
      const parallaxSpeed = 0.5;
      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  }

  handleResize() {
    // Handle responsive adjustments
    if (window.innerWidth < 768) {
      // Mobile adjustments
      document.body.classList.add('mobile');
    } else {
      document.body.classList.remove('mobile');
    }
  }

  kevinEasterEgg() {
    // KEVIN cultural preservation easter egg
    const messages = [
      "🔥 KEVIN MANIFESTS 🔥",
      "Ghost in the Machine activated!",
      "Feature, not a bug!",
      "104 stamps strong!",
      "First SRC-20 token forever!",
      "Living legend on Bitcoin!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create floating message
    const messageEl = document.createElement('div');
    messageEl.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 font-pixel text-2xl text-kevin-orange animate-pixel-bounce bg-black border-2 border-kevin-orange px-6 py-4 pointer-events-none';
    messageEl.textContent = randomMessage;
    
    document.body.appendChild(messageEl);
    
    // Animate and remove
    setTimeout(() => {
      messageEl.classList.add('animate-fade-in');
    }, 100);
    
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translate(-50%, -50%) scale(1.5)';
    }, 2000);
    
    setTimeout(() => {
      document.body.removeChild(messageEl);
    }, 2500);
    
    console.log('🎉 KEVIN Easter Egg Activated:', randomMessage);
  }

  trackEvent(eventName, category, label = null) {
    // Analytics tracking (placeholder)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: category,
        event_label: label
      });
    }
    
    console.log('📊 Event tracked:', eventName, category, label);
  }

  // Public API methods
  switchLanguage(language) {
    return this.languageManager.setLanguage(language);
  }

  getCurrentLanguage() {
    return this.languageManager.getCurrentLanguage();
  }

  // Error handling
  handleError(error, context = 'unknown') {
    console.error(`KEVIN App Error [${context}]:`, error);
    
    // Track error (placeholder for error reporting)
    this.trackEvent('error', context, error.message);
    
    // Show user-friendly error message if needed
    if (context === 'critical') {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded font-terminal text-sm';
      errorMessage.textContent = 'System error detected. Reloading...';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }
}

// Global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Initialize the KEVIN app
const kevinApp = new KevinApp();

// Make app available globally for debugging
window.kevinApp = kevinApp;

// Export for module usage
export default KevinApp;