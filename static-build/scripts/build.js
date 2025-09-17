#!/usr/bin/env node

/**
 * KEVIN Static Site Build Script
 * Builds optimized static HTML/CSS/JS with cultural preservation
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

/**
 * Build configuration for KEVIN static site
 */
const buildConfig = {
  minifyCSS: true,
  minifyJS: true,
  optimizeImages: true,
  generateSitemap: true,
  copyAssets: true,
  validateHTML: true
};

class KevinStaticBuilder {
  constructor() {
    this.startTime = Date.now();
    this.errors = [];
    this.warnings = [];
  }

  async build() {
    try {
      console.log('🔥 Starting KEVIN Static Site Build Process 🔥');
      console.log('🚀 Ghost in the Machine - Building Legend...\n');

      // Clean and prepare
      await this.clean();
      await this.prepare();

      // Build steps
      await this.buildCSS();
      await this.bundleJavaScript();
      await this.copyAssets();
      await this.copyHTMLTemplates();
      await this.generatePages();
      
      // Optimization steps
      await this.optimizeAssets();
      await this.generateMetaFiles();
      
      // Validation
      await this.validate();
      
      this.logResults();

    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  }

  async clean() {
    console.log('🧹 Cleaning dist directory...');
    try {
      // Clean only specific directories, preserve HTML files during build
      const dirsToClean = ['css', 'js', 'images'];
      for (const dir of dirsToClean) {
        const dirPath = path.join(distDir, dir);
        await fs.rm(dirPath, { recursive: true, force: true });
      }
      
      // Clean only generated files, not the template
      const filesToClean = ['robots.txt', 'sitemap.xml'];
      for (const file of filesToClean) {
        const filePath = path.join(distDir, file);
        try {
          await fs.rm(filePath, { force: true });
        } catch (error) {
          // File might not exist, continue
        }
      }
    } catch (error) {
      console.warn('Warning: Could not clean dist directory');
    }
  }

  async prepare() {
    console.log('📁 Preparing build directories...');
    await fs.mkdir(path.join(distDir, 'css'), { recursive: true });
    await fs.mkdir(path.join(distDir, 'js'), { recursive: true });
    await fs.mkdir(path.join(distDir, 'images'), { recursive: true });
  }

  async buildCSS() {
    console.log('🎨 Building CSS with Tailwind...');
    try {
      // Build CSS using Tailwind CLI
      execSync(`npx tailwindcss -i ${path.join(srcDir, 'css/styles.css')} -o ${path.join(distDir, 'css/styles.min.css')} --minify`, {
        cwd: rootDir,
        stdio: 'inherit'
      });
      
      // Verify CSS was created
      const cssPath = path.join(distDir, 'css/styles.min.css');
      const stats = await fs.stat(cssPath);
      console.log(`✅ CSS built successfully (${Math.round(stats.size / 1024)}KB)`);
      
    } catch (error) {
      throw new Error(`CSS build failed: ${error.message}`);
    }
  }

  async bundleJavaScript() {
    console.log('📦 Bundling JavaScript modules...');
    try {
      const jsFiles = [
        'translations.js',
        'matrix-rain.js', 
        'navigation.js',
        'app.js'
      ];

      // Copy JS files to dist (modern browsers support ES modules)
      for (const file of jsFiles) {
        const srcPath = path.join(srcDir, 'js', file);
        const destPath = path.join(distDir, 'js', file);
        
        let content = await fs.readFile(srcPath, 'utf8');
        
        // Update import paths for production
        content = content.replace(/from ['"]\.\//g, "from './");
        
        await fs.writeFile(destPath, content);
      }
      
      console.log('✅ JavaScript modules copied successfully');
      
    } catch (error) {
      throw new Error(`JavaScript bundling failed: ${error.message}`);
    }
  }

  async copyAssets() {
    console.log('📋 Copying assets...');
    try {
      // Copy public directory contents to dist
      if (await this.exists(publicDir)) {
        const publicFiles = await fs.readdir(publicDir);
        for (const file of publicFiles) {
          const srcPath = path.join(publicDir, file);
          const destPath = path.join(distDir, file);
          await fs.copyFile(srcPath, destPath);
        }
        console.log(`✅ Copied ${publicFiles.length} asset files`);
      }
    } catch (error) {
      this.warnings.push(`Asset copying warning: ${error.message}`);
    }
  }

  async copyHTMLTemplates() {
    console.log('📄 Ensuring HTML templates are available...');
    // The index.html should already be in dist, just verify it exists
    const indexPath = path.join(distDir, 'index.html');
    if (!(await this.exists(indexPath))) {
      throw new Error('index.html template missing from dist directory. Please ensure it exists before building.');
    }
    console.log('✅ HTML template verified');
  }

  async generatePages() {
    console.log('📄 Generating additional pages...');
    
    // Read the main index.html template
    const indexPath = path.join(distDir, 'index.html');
    let indexTemplate = '';
    
    try {
      indexTemplate = await fs.readFile(indexPath, 'utf8');
    } catch (error) {
      throw new Error('index.html template not found in dist directory');
    }

    // Generate additional pages based on React app structure
    const pages = [
      { name: 'lore', title: 'The KEVIN Saga - Lore', heading: 'The KEVIN Saga' },
      { name: 'stamps', title: '104 KEVIN Stamps Collection', heading: '104 KEVIN Stamps' },
      { name: 'community', title: 'KEVIN Community Gallery', heading: 'Community Gallery' },
      { name: 'token', title: 'KEVIN Token - First SRC-20', heading: 'KEVIN Token' }
    ];

    for (const page of pages) {
      const pageContent = this.generatePageContent(indexTemplate, page);
      await fs.writeFile(path.join(distDir, `${page.name}.html`), pageContent);
    }

    console.log(`✅ Generated ${pages.length} additional pages`);
  }

  generatePageContent(template, page) {
    // Create page-specific content while preserving KEVIN cultural elements
    const pageContent = template
      .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
      .replace(/data-translate="home\.title"[^>]*>.*?<\/h1>/, `data-translate="home.title">${page.heading}</h1>`)
      .replace(/<main class="pt-16">[\s\S]*?<\/main>/, `
        <main class="pt-16">
          <section class="min-h-screen bg-kevin-charcoal text-white flex items-center justify-center relative">
            <div class="scanlines absolute inset-0 opacity-30"></div>
            <div class="container mx-auto px-4 text-center relative z-10">
              <div class="animate-fade-in">
                <div class="mb-8">
                  <img src="/kevin-original.png" alt="KEVIN - The Ghost in the Machine" class="w-32 h-32 mx-auto mb-4 pixel-perfect animate-pixel-float" loading="eager" />
                </div>
                
                <h1 class="font-pixel font-black text-5xl md:text-7xl text-kevin-orange mb-6 animate-pixel-bounce">
                  ${page.heading}
                </h1>
                
                <div class="terminal-window max-w-2xl mx-auto text-left mb-8">
                  <div class="font-terminal text-kevin-orange mb-2">&gt; LOADING_${page.name.toUpperCase()}.LOG</div>
                  <div class="font-terminal text-sm">
                    <div>&gt; Initializing ${page.name} protocol...</div>
                    <div>&gt; Loading KEVIN cultural elements...</div>
                    <div>&gt; Ghost in the machine active...</div>
                    <div class="text-kevin-neon">&gt; Status: <span class="animate-pulse">LEGENDARY</span></div>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="/" class="pixel-btn px-8 py-4 text-lg hover:animate-glow">
                    🏠 BACK TO HOME
                  </a>
                  <a href="/stamps.html" class="pixel-btn px-8 py-4 text-lg border-kevin-neon bg-kevin-neon text-black hover:bg-kevin-orange">
                    📊 VIEW 104 STAMPS
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      `);

    return pageContent;
  }

  async optimizeAssets() {
    console.log('⚡ Optimizing assets...');
    
    // Add cache headers via meta tags
    const htmlFiles = await this.getFiles(distDir, '.html');
    
    for (const file of htmlFiles) {
      let content = await fs.readFile(file, 'utf8');
      
      // Add cache control meta tags
      const cacheMetaTags = `
    <!-- Cache Control -->
    <meta http-equiv="Cache-Control" content="public, max-age=31536000">
    <meta http-equiv="Expires" content="${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}">
      `;
      
      content = content.replace('</head>', `${cacheMetaTags}\n  </head>`);
      await fs.writeFile(file, content);
    }
    
    console.log('✅ Asset optimization complete');
  }

  async generateMetaFiles() {
    console.log('🗂️ Generating meta files...');
    
    // Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /

# KEVIN is the ghost in the machine
Sitemap: https://kevinstamp.io/sitemap.xml

# Preserve cultural heritage
User-agent: *
Allow: /kevin-original.png
Allow: /stamps.html
Allow: /lore.html
Allow: /community.html
Allow: /token.html
`;
    
    await fs.writeFile(path.join(distDir, 'robots.txt'), robotsTxt);
    
    // Generate sitemap.xml
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kevinstamp.io/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://kevinstamp.io/lore.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://kevinstamp.io/stamps.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kevinstamp.io/community.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://kevinstamp.io/token.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    
    await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
    
    console.log('✅ Meta files generated');
  }

  async validate() {
    console.log('🔍 Validating build...');
    
    // Check critical files exist
    const criticalFiles = [
      'index.html',
      'css/styles.min.css',
      'js/app.js',
      'js/matrix-rain.js',
      'js/navigation.js',
      'js/translations.js'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(distDir, file);
      try {
        await fs.access(filePath);
      } catch (error) {
        this.errors.push(`Critical file missing: ${file}`);
      }
    }
    
    // Check for KEVIN cultural preservation in main HTML
    const indexContent = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
    
    const culturalChecks = [
      { check: indexContent.includes('KEVIN'), message: 'KEVIN ALL CAPS preservation check' },
      { check: indexContent.includes('Ghost in the Machine'), message: 'Ghost in the Machine terminology' },
      { check: indexContent.includes('First SRC-20 Token'), message: 'SRC-20 token heritage' },
      { check: indexContent.includes('104'), message: '104 stamps reference' },
      { check: indexContent.includes('Bitcoin Legend'), message: 'Bitcoin Legend status' }
    ];
    
    culturalChecks.forEach(({ check, message }) => {
      if (!check) {
        this.errors.push(`Cultural preservation failed: ${message}`);
      }
    });
    
    if (this.errors.length === 0) {
      console.log('✅ Build validation passed');
    }
  }

  logResults() {
    const duration = Date.now() - this.startTime;
    
    console.log('\n🎉 KEVIN Static Site Build Complete! 🎉');
    console.log('👻 Ghost in the Machine Successfully Deployed');
    console.log('🔥 Living Legend Status: ACTIVE\n');
    
    console.log(`⏱️  Build time: ${duration}ms`);
    console.log(`📁 Output directory: ${distDir}`);
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`   ${error}`));
      process.exit(1);
    }
    
    console.log('\n🚀 Ready for deployment to Cloudflare Pages!');
    console.log('💰 KEVIN Token: First SRC-20 Forever!');
    console.log('🎬 Feature, Not a Bug - The Legend Lives On!\n');
  }

  // Helper methods
  async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFiles(dir, extension) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.getFiles(fullPath, extension));
      } else if (entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
}

// Run the build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new KevinStaticBuilder();
  builder.build();
}

export default KevinStaticBuilder;