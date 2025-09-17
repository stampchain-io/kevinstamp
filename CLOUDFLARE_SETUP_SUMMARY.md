# Cloudflare Pages Setup Summary

## Repository Configuration
- **GitHub Repository**: stampchain-io/kevinstamp
- **Production Branch**: main
- **Build Command**: cd static-build && npm ci && npm run build:static
- **Build Output Directory**: static-build/dist

## Required Cloudflare Settings

### Build & Deploy
1. Framework preset: None
2. Build command: `cd static-build && npm ci && npm run build:static`
3. Build output directory: `static-build/dist`
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

```bash
# Test site loading
curl -I https://kevinstamp.com

# Check SSL certificate
openssl s_client -connect kevinstamp.com:443 -servername kevinstamp.com

# Test compression
curl -H "Accept-Encoding: gzip,deflate,br" -v https://kevinstamp.com
```

## Expected Performance Metrics
- **Load Time**: < 1.5 seconds
- **PageSpeed Score**: 90+
- **SSL Grade**: A+
- **Compression**: Brotli enabled
