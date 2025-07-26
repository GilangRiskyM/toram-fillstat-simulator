# =============================================================================

# 📋 GITHUB PAGES SETUP GUIDE

# Panduan deployment Toram Fill Stats Simulator ke GitHub Pages

# =============================================================================

## 🌐 GitHub Pages vs .htaccess

**GitHub Pages:**

- ❌ Tidak mendukung .htaccess (server statis)
- ❌ Tidak mendukung PHP, server-side scripting
- ✅ Mendukung Jekyll static site generator
- ✅ HTTPS otomatis dan CDN global
- ✅ Gratis dan reliable

**File yang diperlukan untuk GitHub Pages:**

- ✅ `_config.yml` - Jekyll configuration (sudah dibuat)
- ✅ `index.html` - Landing page (sudah ada)
- ✅ `fillstat-simulator.html` - Main simulator (sudah ada)
- ✅ File JavaScript (math.js, t4stat.js, interface-integration.js)

## 🚀 Deployment Steps

### 1. Repository Setup

```bash
git init
git add .
git commit -m "Initial commit: Toram Fill Stats Simulator"
git remote add origin https://github.com/username/toram-fillstat.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main", Folder: "/ (root)"
5. Save

### 3. Access Your Site

- URL: `https://username.github.io/toram-fillstat/`
- Custom domain (optional): Add CNAME file

## 📁 File Structure untuk GitHub Pages

```
toram-fillstat/
├── _config.yml              # Jekyll configuration
├── index.html               # Landing page
├── fillstat-simulator.html  # Main simulator
├── math.js                  # Math utilities
├── t4stat.js               # Core fillstat logic
├── interface-integration.js # UI integration
├── README.md               # Documentation
└── .gitignore              # Git ignore rules
```

## 🔧 Alternatif untuk .htaccess Features

### Clean URLs

GitHub Pages otomatis mendukung:

- `username.github.io/repo/` → index.html
- `username.github.io/repo/fillstat-simulator` → fillstat-simulator.html

### Custom 404 Page

Buat file `404.html` di root:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Not Found</title>
    <meta http-equiv="refresh" content="3;url=/" />
  </head>
  <body>
    <h1>Halaman tidak ditemukan</h1>
    <p>Redirect otomatis dalam 3 detik...</p>
  </body>
</html>
```

### Security Headers

Tambahkan di `<head>` setiap halaman:

```html
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

### Performance

- ✅ GitHub Pages otomatis mengaktifkan Gzip
- ✅ Global CDN untuk loading cepat
- ✅ Otomatis minify dengan Jekyll

## 📈 SEO untuk GitHub Pages

Dengan `jekyll-seo-tag` plugin:

```html
<!-- Di <head> section -->
{% seo %}
```

Manual meta tags:

```html
<meta name="description" content="Simulator fillstat Toram Online" />
<meta name="keywords" content="toram, fillstat, simulator, indonesia" />
<link rel="canonical" href="https://username.github.io/toram-fillstat/" />
```

## 🔗 Custom Domain (Optional)

1. Buat file `CNAME` di root repository:

```
toram-simulator.yourdomain.com
```

2. Setup DNS A records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## 🛠️ Advanced Features

### Progressive Web App (PWA)

Tambahkan `manifest.json`:

```json
{
  "name": "Toram Fill Stats Simulator",
  "short_name": "Toram Fillstat",
  "description": "Simulator fillstat untuk Toram Online",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Service Worker untuk Offline Support

```javascript
// sw.js
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("toram-v1").then(function (cache) {
      return cache.addAll([
        "/",
        "/fillstat-simulator.html",
        "/math.js",
        "/t4stat.js",
        "/interface-integration.js",
      ]);
    })
  );
});
```

## 📊 Analytics

Tambahkan Google Analytics:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## 🎯 Tips Optimasi

1. **Minify Files**: Gunakan tools untuk compress CSS/JS
2. **Image Optimization**: Compress images untuk loading cepat
3. **Lazy Loading**: Implement lazy loading untuk performa
4. **Caching Strategy**: Leverage browser caching
5. **Font Loading**: Optimize Google Fonts loading

## 📝 .gitignore untuk GitHub Pages

```
# Jekyll
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Local development
node_modules/
.env
```

## 🔄 Deployment Automation

GitHub Actions untuk auto-deploy:

```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.0
      - name: Install dependencies
        run: bundle install
      - name: Build site
        run: bundle exec jekyll build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

## ✅ Checklist Deployment

- [ ] Repository dibuat di GitHub
- [ ] Files di-upload ke repository
- [ ] `_config.yml` dikonfigurasi dengan benar
- [ ] GitHub Pages diaktifkan di Settings
- [ ] Website bisa diakses di `username.github.io/repo-name`
- [ ] All links dan features berfungsi
- [ ] Custom domain setup (jika perlu)
- [ ] Analytics ditambahkan (optional)

Simulator Toram sudah siap untuk GitHub Pages! 🎮✨
