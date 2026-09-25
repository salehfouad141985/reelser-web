# Reelser - Dedicated Instagram Reels & Video Downloader

Modern, ultra-fast, and standalone web application dedicated to downloading Instagram Reels, Videos, Stories, Photos, Audio (MP3), and Profile Pictures in Full HD 1080p without watermarks or login.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, and multi-language internationalization (9 languages).

---

## 🌟 Key Features

- **Instagram Reels Downloader:** Direct 1080p MP4 high-definition video extraction with crystal-clear audio.
- **Story & Highlights Saver:** Save expiring stories and highlights in full resolution.
- **Photo & Carousel Downloader:** Download single images or full multi-slide carousel albums in high-res JPG.
- **Audio / MP3 Extractor:** Extract original songs, sounds, and background music directly to MP3.
- **Profile Picture (DP) Enlarger:** View and save public Instagram profile avatars in full size.
- **No Login / 100% Private:** No credentials or tokens asked; completely anonymous and secure.
- **Multi-Language (i18n):** Native support for Arabic (العربية RTL), English, Spanish, French, Portuguese, German, Turkish, Indonesian, and Russian.
- **Full Technical SEO:** Canonical URLs, OpenGraph, Twitter Cards, Schema.org (WebSite, WebApplication, FAQPage), sitemap.xml, robots.txt, and PWA manifest.
- **Domain Canonicalization:** 301 permanent redirect from `www.reelser.com` to `https://reelser.com`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🌐 Deploying to Vercel & Connecting reelser.com

1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Reelser Instagram downloader"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/reelser-web.git
   git push -u origin main
   ```
2. Import the repository into **[Vercel](https://vercel.com)**.
3. In Vercel Project Settings -> **Domains**:
   - Add `reelser.com`
   - Add `www.reelser.com` (redirects automatically to apex).
4. Update your DNS settings at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - Type `A`, Name `@`, Value `76.76.21.21`
   - Type `CNAME`, Name `www`, Value `cname.vercel-dns.com`

---

## 🔗 Sister Network

- [SaveYou2be](https://saveyou2be.com) - The All-In-One Universal Video & Audio Downloader.
