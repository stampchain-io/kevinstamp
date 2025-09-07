#!/usr/bin/env node

/**
 * Cloudflare Pages Deployment Verification Script
 * Verifies the static build is ready for Cloudflare Pages deployment
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

class CloudflareDeploymentVerifier {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
    this.projectRoot = '/Users/Shared/repos/StampchainWorkspace/kevinstamp';
    this.staticBuildRoot = join(this.projectRoot, 'static-build');
    this.distDir = join(this.staticBuildRoot, 'dist');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().substring(11, 19);
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async verifyStaticBuild() {
    this.log('Verifying static build directory...', 'info');
    
    try {
      const stats = await fs.stat(this.distDir);
      
      if (!stats.isDirectory()) {
        throw new Error('static-build/dist is not a directory');
      }

      this.successes.push('Static build directory exists');
      this.log('Static build directory exists at static-build/dist/', 'success');

      // Check for essential files
      const requiredFiles = [
        'index.html',
        'lore.html',
        'stamps.html',
        'token.html',
        'community.html',
        '_headers',
        '_redirects',
        'robots.txt',
        'sitemap.xml'
      ];

      let foundFiles = 0;
      for (const file of requiredFiles) {
        try {
          await fs.access(join(this.distDir, file));
          this.log(`Found required file: ${file}`, 'success');
          foundFiles++;
        } catch (error) {
          this.errors.push(`Missing required file: ${file}`);
          this.log(`Missing required file: ${file}`, 'error');
        }
      }

      this.successes.push(`Found ${foundFiles}/${requiredFiles.length} required files`);

      // Check HTML files for KEVIN cultural elements
      const indexPath = join(this.distDir, 'index.html');
      try {
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        if (indexContent.includes('KEVIN')) {
          this.log('KEVIN cultural elements preserved in index.html', 'success');
          this.successes.push('KEVIN cultural elements preserved');
        } else {
          this.warnings.push('KEVIN cultural elements might be missing');
          this.log('KEVIN cultural elements might be missing', 'warning');
        }
      } catch (error) {
        this.errors.push(`Could not verify index.html content: ${error.message}`);
      }

    } catch (error) {
      this.errors.push(`Static build verification failed: ${error.message}`);
      this.log(`Static build verification failed: ${error.message}`, 'error');
    }
  }

  async verifyGitRepository() {
    this.log('Verifying Git repository configuration...', 'info');
    
    return new Promise((resolve) => {
      const git = spawn('git', ['remote', '-v'], { cwd: this.projectRoot });
      let output = '';
      
      git.stdout.on('data', (data) => {
        output += data.toString();
      });

      git.on('close', (code) => {
        if (code === 0) {
          if (output.includes('stampchain-io/kevinstamp')) {
            this.log('Git repository correctly configured: stampchain-io/kevinstamp', 'success');
            this.successes.push('GitHub repository connected');
          } else {
            this.errors.push('Git repository not pointing to stampchain-io/kevinstamp');
            this.log('Git repository not pointing to stampchain-io/kevinstamp', 'error');
          }
        } else {
          this.errors.push('Git repository not initialized or accessible');
          this.log('Git repository not initialized or accessible', 'error');
        }
        resolve();
      });
    });
  }

  async verifyBuildCommand() {
    this.log('Verifying build command in static-build package.json...', 'info');
    
    try {
      const packageJsonPath = join(this.staticBuildRoot, 'package.json');
      const packageContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.scripts && packageJson.scripts['build:static']) {
        this.log('Build command "build:static" found in package.json', 'success');
        this.successes.push('Build command configured');
        return;
      } else {
        this.errors.push('Build command "build:static" not found in package.json');
        this.log('Build command "build:static" not found in package.json', 'error');
      }
    } catch (error) {
      this.errors.push(`Package.json verification failed: ${error.message}`);
      this.log(`Package.json verification failed: ${error.message}`, 'error');
    }
  }

  async verifySecurityHeaders() {
    this.log('Verifying security headers configuration...', 'info');
    
    try {
      const headersPath = join(this.distDir, '_headers');
      const headersContent = await fs.readFile(headersPath, 'utf-8');
      
      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options', 
        'X-XSS-Protection',
        'Referrer-Policy',
        'Content-Security-Policy'
      ];
      
      let foundHeaders = 0;
      for (const header of requiredHeaders) {
        if (headersContent.includes(header)) {
          this.log(`Security header found: ${header}`, 'success');
          foundHeaders++;
        } else {
          this.warnings.push(`Security header missing: ${header}`);
          this.log(`Security header missing: ${header}`, 'warning');
        }
      }
      
      this.successes.push(`Found ${foundHeaders}/${requiredHeaders.length} security headers`);
      
    } catch (error) {
      this.errors.push(`Security headers verification failed: ${error.message}`);
      this.log(`Security headers verification failed: ${error.message}`, 'error');
    }
  }

  async verifyRedirectsConfig() {
    this.log('Verifying redirects configuration...', 'info');
    
    try {
      const redirectsPath = join(this.distDir, '_redirects');
      await fs.access(redirectsPath);
      this.log('Redirects file exists', 'success');
      this.successes.push('Redirects configuration present');
      
      const redirectsContent = await fs.readFile(redirectsPath, 'utf-8');
      this.log(`Redirects configuration: ${redirectsContent.trim()}`, 'info');
      
    } catch (error) {
      this.warnings.push('_redirects file not found - this is optional but recommended');
      this.log('_redirects file not found - this is optional but recommended', 'warning');
    }
  }

  async verifyAssets() {
    this.log('Verifying CSS and JavaScript assets...', 'info');
    
    try {
      // Check CSS directory
      const cssDir = join(this.distDir, 'css');
      const cssFiles = await fs.readdir(cssDir);
      
      if (cssFiles.length > 0) {
        this.log(`Found ${cssFiles.length} CSS file(s)`, 'success');
        this.successes.push(`CSS assets present (${cssFiles.length} files)`);
      } else {
        this.warnings.push('No CSS files found');
      }

      // Check JS directory
      const jsDir = join(this.distDir, 'js');
      const jsFiles = await fs.readdir(jsDir);
      
      if (jsFiles.length > 0) {
        this.log(`Found ${jsFiles.length} JavaScript file(s)`, 'success');
        this.successes.push(`JavaScript assets present (${jsFiles.length} files)`);
      } else {
        this.warnings.push('No JavaScript files found');
      }

      // Check images directory
      try {
        const imagesDir = join(this.distDir, 'images');
        const imageFiles = await fs.readdir(imagesDir);
        
        if (imageFiles.length > 0) {
          this.log(`Found ${imageFiles.length} image file(s)`, 'success');
          this.successes.push(`Image assets present (${imageFiles.length} files)`);
        }
      } catch (error) {
        this.warnings.push('No images directory found');
      }

    } catch (error) {
      this.errors.push(`Asset verification failed: ${error.message}`);
      this.log(`Asset verification failed: ${error.message}`, 'error');
    }
  }

  generateCloudflareConfig() {
    this.log('Generating Cloudflare Pages configuration summary...', 'info');
    
    const config = {
      repository: 'stampchain-io/kevinstamp',
      production_branch: 'main',
      build_command: 'cd static-build && npm ci && npm run build:static',
      build_output_directory: 'static-build/dist',
      framework_preset: 'None',
      environment_variables: 'None required'
    };

    console.log('\n📋 Cloudflare Pages Configuration:');
    console.log('==========================================');
    Object.entries(config).forEach(([key, value]) => {
      console.log(`${key.replace(/_/g, ' ').toUpperCase()}: ${value}`);
    });
    console.log('==========================================\n');

    this.successes.push('Configuration summary generated');
  }

  async runAllChecks() {
    this.log('🚀 Starting Cloudflare Pages deployment verification...', 'info');
    console.log('');
    
    await this.verifyStaticBuild();
    await this.verifyGitRepository(); 
    await this.verifyBuildCommand();
    await this.verifySecurityHeaders();
    await this.verifyRedirectsConfig();
    await this.verifyAssets();
    this.generateCloudflareConfig();
    
    console.log('');
    this.log('📊 Verification Summary:', 'info');
    this.log(`✅ Successful checks: ${this.successes.length}`, 'success');
    this.log(`⚠️ Warnings: ${this.warnings.length}`, 'warning');
    this.log(`❌ Errors: ${this.errors.length}`, 'error');
    
    if (this.successes.length > 0) {
      console.log('');
      this.log('✅ Successful Verifications:', 'success');
      this.successes.forEach(success => console.log(`     ✓ ${success}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('');
      this.log('⚠️ Warnings (non-blocking):', 'warning');
      this.warnings.forEach(warning => console.log(`     ⚠ ${warning}`));
    }
    
    if (this.errors.length > 0) {
      console.log('');
      this.log('❌ Errors that need attention:', 'error');
      this.errors.forEach(error => console.log(`     ✗ ${error}`));
      console.log('');
      this.log('❌ Deployment not ready - please fix errors above', 'error');
      return false;
    }
    
    console.log('');
    this.log('🎉 Verification completed successfully!', 'success');
    this.log('✅ Ready for Cloudflare Pages deployment', 'success');
    this.log('📖 Review CLOUDFLARE_PAGES_DEPLOYMENT.md for setup instructions', 'info');
    
    return true;
  }
}

// Run verification
const verifier = new CloudflareDeploymentVerifier();
verifier.runAllChecks().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});