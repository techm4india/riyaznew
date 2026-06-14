# TechM4India — Official Website

The official website for **TechM4India Innovations Pvt Ltd**, India's multi-vertical innovation and education technology company.

🌐 **Live:** [techm4india.com](https://techm4india.com)

---

## 🏗️ Project Structure

```
/
├── index.html                  # Homepage
├── favicon.ico                 # Browser favicon (16×16 + 32×32)
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png        # iOS home screen icon (180×180)
├── android-chrome-192x192.png  # Android Chrome icon
├── android-chrome-512x512.png  # Android PWA / high-res icon
├── logo.png                    # Brand logo (512×512, for JSON-LD)
├── site.webmanifest            # PWA manifest
├── sitemap.xml                 # XML sitemap for SEO
├── robots.txt                  # Search engine crawl rules
├── vercel.json                 # Vercel deployment config & URL rewrites
├── CNAME                       # Custom domain config
│
├── divisions/                  # Four main division pages
│   ├── engineering.html        → /engineering
│   ├── solutions.html          → /solutions
│   ├── schools.html            → /schools
│   └── space.html              → /space
│
├── pages/                      # Supporting pages
│   ├── about.html              → /about
│   ├── careers.html            → /careers
│   ├── contact.html            → /contact
│   ├── ecosystem.html          → /ecosystem
│   ├── impact.html             → /impact
│   ├── programs.html           → /programs
│   ├── research.html           → /research
│   ├── vision.html             → /vision
│   ├── login.html              → /login
│   └── admin.html              → /admin
│
└── assets/
    ├── css/                    # Stylesheets
    │   ├── responsive-base.css
    │   ├── about-responsive.css
    │   └── techm4schools-responsive.css
    ├── js/
    │   └── site-init.js        # Shared navigation & page init
    └── images/                 # Team & expert photos
```

---

## 🚀 The Four Divisions

| Division | URL | Description |
|---|---|---|
| **TechM4Engineering** | `/engineering` | Real-world engineering education & industry programs |
| **TechM4Solutions** | `/solutions` | AI, Digital Engineering & enterprise software |
| **TechM4Schools** | `/schools` | K-12 innovation curriculum & STEM labs |
| **TechM4Space** | `/space` | Aerospace education & space technology |

---

## ⚙️ Deployment

Hosted on **Vercel** with custom domain `techm4india.com`.

- Clean URLs enabled (`cleanUrls: true`) — no `.html` extensions in URLs
- `vercel.json` rewrites map clean URLs to files in `divisions/` and `pages/`
- All SEO canonical URLs point to `https://techm4india.com/` (non-www)

---

## 📌 Tech Stack

- **Pure HTML + CSS + Vanilla JS** — no frameworks, no build step
- **Google Fonts** — Inter & Sora
- **Vercel** — hosting & CDN
- **Schema.org JSON-LD** — structured data for sitelinks & rich results
