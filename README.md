# Red Studios — Production Landing Site

A production-ready, single-page creative studio web application built for **Red Studios**, integrating cinematic visual production (Product Shoots & Commercial Ad Editing) with modern high-performance web engineering (Full-Stack Next.js Platforms & Award-Level Landing Pages).

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling**: Tailwind CSS v4 with bespoke obsidian palette (`#0A0A0A`), signature crimson red (`#E10600`), and typography design system
- **Interactive Hero**: Three.js WebGL GPU Navier-Stokes fluid dynamic simulation with swept-capsule continuity, seamless `boxFade` borderless feathering, and unsharp masked cinematic video reveal
- **Kinetic Animations**: Framer Motion & [Lenis](https://lenis.darkroom.engineering/) inertial smooth scroll
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Email Dispatch & Auto-reply**: Resend API (`/api/brief`) with IP rate limiting and honeypot spam protection

---

## 📁 Project Architecture

```
d:/red studs/site/
├── public/
│   ├── video.mp4               # Base video asset
│   ├── video_dark.mp4          # Secondary video asset
│   ├── base_cream_16_9.jpg     # 16:9 cream base texture
│   ├── base_dark_16_9.png      # 16:9 dark base texture
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── brief/
│   │   │       └── route.ts    # Resend email handler + rate limit + honeypot
│   │   ├── globals.css         # Custom tokens, obsidian theme, scrollbar, Lenis
│   │   ├── layout.tsx          # Space Grotesk / Plus Jakarta Sans fonts, SEO meta, JSON-LD
│   │   ├── page.tsx            # Master single-page assembly (13 sections)
│   │   ├── robots.ts           # Search engine crawler directives
│   │   └── sitemap.ts          # XML sitemap configuration
│   ├── components/
│   │   ├── Navigation.tsx      # Sticky glass nav, status indicator, mobile drawer
│   │   ├── FluidHero.tsx       # Navier-Stokes WebGL interactive fluid reveal hero
│   │   ├── TrustStrip.tsx      # Client ticker marquee & 4 key metrics
│   │   ├── Services.tsx        # 4 core service cards with deliverables & timelines
│   │   ├── SelectedWork.tsx    # Filterable portfolio grid
│   │   ├── WorkLightbox.tsx    # Accessible modal project lightbox
│   │   ├── AboutTimeline.tsx   # Studio evolution milestone timeline (2021-2025)
│   │   ├── PhilosophyEthics.tsx# 6 operating principles + founder quote
│   │   ├── ProcessFlow.tsx     # 5-phase client journey & deliverables
│   │   ├── TestimonialsCarousel.tsx # Client reviews & star ratings
│   │   ├── BookCallSection.tsx # Direct 30-min discovery call (Gmail & mailto)
│   │   ├── ProjectBriefForm.tsx# 3-step interactive brief wizard
│   │   ├── FAQAccordion.tsx    # 8-question expandable FAQ
│   │   ├── Footer.tsx          # Studio footer, contact details, back-to-top
│   │   ├── CustomCursor.tsx    # Physics custom cursor follower
│   │   └── SmoothScrollProvider.tsx # Lenis smooth scrolling wrapper
│   ├── content/
│   │   └── studio.ts           # SINGLE SOURCE OF TRUTH for all studio copy & data
│   ├── types/
│   │   └── brief.ts            # Zod validation schema & TypeScript types
│   └── utils/
│       └── booking.ts          # Gmail web compose & mailto link generator
├── .env.example
├── CHECKLIST.md                # Client onboarding & launch checklist
└── README.md
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the keys:
```env
# Resend API Key for sending briefs & auto-reply confirmations
RESEND_API_KEY=re_your_api_key_here

# Email address where project briefs should be delivered
STUDIO_RECIPIENT_EMAIL=hello@redstudios.com

# Production domain
NEXT_PUBLIC_SITE_URL=https://redstudios.com
```
*(Note: If `RESEND_API_KEY` is not set, the form will still accept submissions and log them safely to the server console in development mode).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📝 Customizing Studio Content (`src/content/studio.ts`)

All content, pricing anchors, testimonials, portfolio items, and client information are centralized in `src/content/studio.ts`. Search for `[PLACEHOLDER]` or `[REPLACE ME]` to easily customize:

- **STUDIO_CONFIG**: Studio phone, email, physical studio locations, tagline.
- **TRUST_METRICS**: Update delivery numbers, on-time percentage, revenue generated.
- **SELECTED_WORKS**: Add your client projects, media paths, and conversion metrics.
- **SERVICES**: Adjust deliverables and turnaround times.
- **TIMELINE_MILESTONES**: Modify founding year story and highlights.
- **TESTIMONIALS**: Insert real client quotes and company names.
- **FAQS**: Update answers to fit your specific billing and contract terms.

---

## 🎨 Interactive WebGL Navier-Stokes Fluid Reveal

The interactive Hero section runs a GPU-accelerated Navier-Stokes fluid dynamics solver:
1. **Swept-Capsule Splatting**: Continuous mouse motion interpolation ensures fluid trajectories never break into isolated dots during rapid cursor velocity.
2. **Seamless Edge Blending**: The shader applies `boxFade` feathering tuned to the base cream background (`#eeece3`), eliminating any dark borders or rectangular frames.
3. **Contrast Unsharp Masking**: High-frequency contrast sharpening brings out fine details in the revealed video.
4. **Mobile Fallback**: Gracefully detects touch devices and provides a lightweight interactive reveal.

---

## 🚀 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Set the Root Directory to `./site` if the repository root is parent, or default if the repository root is `site`.
4. Add the Environment Variables:
   - `RESEND_API_KEY`
   - `STUDIO_RECIPIENT_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
5. Click **Deploy**. Vercel will build the Next.js production bundle with full Edge optimization.
