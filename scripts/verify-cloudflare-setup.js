#!/usr/bin/env node

/**
 * Cloudflare Pages Setup Verification Script
 * Verifies all deployment pipeline configurations are correct
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CloudflareSetupVerifier {
  constructor() {
    this.checks = [];
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async verifyStaticBuild() {
    this.log('Verifying static build exists...', 'info');
    
    try {
      const distPath = join(__dirname, '../dist');
      const stats = await fs.stat(distPath);
      
      if (!stats.isDirectory()) {
        throw new Error('dist is not a directory');
      }

      // Check for essential files
      const requiredFiles = [
        'index.html',
        'css/styles.min.css',
        'js/main.min.js',
        '_headers',
        '_redirects',
        'robots.txt',
        'sitemap.xml'
      ];

      for (const file of requiredFiles) {
        try {
          await fs.access(join(distPath, file));
          this.log(`Found required file: ${file}`, 'success');
        } catch (error) {
          this.errors.push(`Missing required file: ${file}`);
          this.log(`Missing required file: ${file}`, 'error');
        }
      }

      // Check HTML files for KEVIN cultural elements
      const indexContent = await fs.readFile(join(distPath, 'index.html'), 'utf-8');
      if (indexContent.includes('KEVIN')) {
        this.log('KEVIN cultural elements preserved in index.html', 'success');
      } else {
        this.warnings.push('KEVIN cultural elements might be missing');
        this.log('KEVIN cultural elements might be missing', 'warning');
      }

    } catch (error) {
      this.errors.push(`Static build verification failed: ${error.message}`);
      this.log(`Static build verification failed: ${error.message}`, 'error');
    }
  }

  async verifyGitRepository() {
    this.log('Verifying Git repository configuration...', 'info');
    
    return new Promise((resolve) => {
      const git = spawn('git', ['remote', '-v'], { cwd: dirname(__dirname) });
      let output = '';
      
      git.stdout.on('data', (data) => {
        output += data.toString();
      });

      git.on('close', (code) => {
        if (code === 0) {
          if (output.includes('stampchain-io/kevinstamp')) {
            this.log('Git repository correctly configured: stampchain-io/kevinstamp', 'success');
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
    this.log('Verifying build command...', 'info');
    
    try {
      const packageJsonPath = join(__dirname, '../package.json');
      const packageContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.scripts && packageJson.scripts['build:static']) {
        this.log('Build command "build:static" found in package.json', 'success');
        
        // Test build command
        this.log('Testing build command execution...', 'info');
        
        return new Promise((resolve) => {
          const npm = spawn('npm', ['run', 'build:static'], { 
            cwd: dirname(__dirname),
            stdio: 'pipe'
          });
          
          let buildOutput = '';
          npm.stdout.on('data', (data) => {
            buildOutput += data.toString();
          });
          
          npm.stderr.on('data', (data) => {
            buildOutput += data.toString();
          });
          
          npm.on('close', (code) => {
            if (code === 0) {
              this.log('Build command executed successfully', 'success');
            } else {
              this.errors.push(`Build command failed with code ${code}`);
              this.log(`Build command failed: ${buildOutput}`, 'error');
            }
            resolve();
          });
        });
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
      const headersPath = join(__dirname, '../dist/_headers');
      const headersContent = await fs.readFile(headersPath, 'utf-8');
      
      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Content-Security-Policy'
      ];
      
      for (const header of requiredHeaders) {
        if (headersContent.includes(header)) {
          this.log(`Security header found: ${header}`, 'success');
        } else {
          this.warnings.push(`Security header missing: ${header}`);
          this.log(`Security header missing: ${header}`, 'warning');
        }
      }
      
    } catch (error) {
      this.errors.push(`Security headers verification failed: ${error.message}`);
      this.log(`Security headers verification failed: ${error.message}`, 'error');
    }
  }

  async verifyRedirectsConfig() {
    this.log('Verifying redirects configuration...', 'info');
    
    try {
      const redirectsPath = join(__dirname, '../dist/_redirects');
      await fs.access(redirectsPath);
      this.log('Redirects file exists', 'success');
      
      const redirectsContent = await fs.readFile(redirectsPath, 'utf-8');
      this.log(`Redirects configuration: ${redirectsContent.trim()}`, 'info');
      
    } catch (error) {
      this.warnings.push('_redirects file not found - this is optional but recommended');
      this.log('_redirects file not found - this is optional but recommended', 'warning');
    }
  }

  async generateCloudflareSetupGuide() {
    this.log('Generating Cloudflare setup guide...', 'info');
    
    const setupGuide = `# Cloudflare Pages Setup Summary

## Repository Configuration
- **GitHub Repository**: stampchain-io/kevinstamp
- **Production Branch**: main
- **Build Command**: cd static-build && npm ci && npm run build:static
- **Build Output Directory**: static-build/dist

## Required Cloudflare Settings

### Build & Deploy
1. Framework preset: None
2. Build command: \`cd static-build && npm ci && npm run build:static\`
3. Build output directory: \`static-build/dist\`
4. Root directory: / (default)

### Performance Settings
1. **Compression**: Enable Brotli + Gzip
2. **Minification**: Enable Auto Minify (HTML, CSS, JS)
3. **Image Optimization**: Enable Polish (Lossy)
4. **Rocket Loader**: Enable for JS optimization

### SSL/Security Settings
1. **SSL Mode**: Full (strict)
2. **Always Use HTTPS**: Enable
3. **Automatic HTTPS Rewrites**: Enable
4. **Security Level**: Medium or High

### Custom Domain Setup
1. **Primary Domain**: kevinstamp.com
2. **DNS Records**:
   - CNAME kevinstamp → kevinstamp.pages.dev
   - CNAME www → kevinstamp.pages.dev

## Verification Commands

After deployment, verify with these commands:

\`\`\`bash
# Test site loading
curl -I https://kevinstamp.com

# Check SSL certificate
openssl s_client -connect kevinstamp.com:443 -servername kevinstamp.com

# Test compression
curl -H "Accept-Encoding: gzip,deflate,br" -v https://kevinstamp.com
\`\`\`

## Expected Performance Metrics
- **Load Time**: < 1.5 seconds
- **PageSpeed Score**: 90+
- **SSL Grade**: A+
- **Compression**: Brotli enabled
`;

    try {
      const outputPath = join(__dirname, '../CLOUDFLARE_SETUP_SUMMARY.md');
      await fs.writeFile(outputPath, setupGuide);
      this.log('Setup guide written to CLOUDFLARE_SETUP_SUMMARY.md', 'success');
    } catch (error) {
      this.log(`Failed to write setup guide: ${error.message}`, 'error');
    }
  }

  async runAllChecks() {
    this.log('🚀 Starting Cloudflare Pages deployment verification...', 'info');
    this.log('', 'info');
    
    await this.verifyStaticBuild();
    await this.verifyGitRepository();
    await this.verifyBuildCommand();
    await this.verifySecurityHeaders();
    await this.verifyRedirectsConfig();
    await this.generateCloudflareSetupGuide();
    
    this.log('', 'info');
    this.log('📊 Verification Summary:', 'info');
    this.log(`✅ Checks passed: ${this.checks.length}`, 'info');
    this.log(`⚠️ Warnings: ${this.warnings.length}`, 'info');
    this.log(`❌ Errors: ${this.errors.length}`, 'info');
    
    if (this.warnings.length > 0) {
      this.log('', 'info');
      this.log('⚠️ Warnings:', 'warning');
      this.warnings.forEach(warning => this.log(`  - ${warning}`, 'warning'));
    }
    
    if (this.errors.length > 0) {
      this.log('', 'info');
      this.log('❌ Errors that need attention:', 'error');
      this.errors.forEach(error => this.log(`  - ${error}`, 'error'));
      process.exit(1);
    }
    
    this.log('', 'info');
    this.log('🎉 Verification completed! Ready for Cloudflare Pages deployment.', 'success');
    this.log('📖 Review CLOUDFLARE_PAGES_DEPLOYMENT.md for detailed setup instructions.', 'info');
  }
}

// Run verification if called directly
if (process.argv[1] === __filename) {
  const verifier = new CloudflareSetupVerifier();
  verifier.runAllChecks().catch(console.error);
}

export default CloudflareSetupVerifier;