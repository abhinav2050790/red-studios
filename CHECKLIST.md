# Red Studios — Production Launch Checklist

Use this checklist prior to flipping DNS and launching `redstudios.com` live.

---

## 📋 1. Content & Branding Updates (`src/content/studio.ts`)
- [ ] Replace `STUDIO_CONFIG.email` with the verified production inbox (`hello@redstudios.com` or custom domain).
- [ ] Replace `STUDIO_CONFIG.phone` with the studio business line or WhatsApp business contact.
- [ ] Update `STUDIO_CONFIG.location` if physical office presence changes.
- [ ] Replace `[PLACEHOLDER]` tags in `SELECTED_WORKS` with real portfolio images, video loops, and client testimonials.
- [ ] Replace `[PLACEHOLDER]` names and quotes in `TESTIMONIALS` with signed client endorsements.
- [ ] Verify `FAQS` pricing ranges and delivery timelines match current studio rate cards.

---

## 🔐 2. Email Service & Intake Configuration
- [ ] Create a [Resend](https://resend.com) account and verify sending domain (DKIM, SPF, and DMARC records).
- [ ] Generate a production API key and set `RESEND_API_KEY` in Vercel environment variables.
- [ ] Set `STUDIO_RECIPIENT_EMAIL` to the team inbox monitored for project briefs.
- [ ] Test the Project Brief form on staging:
  - [ ] Verify email arrives in the team inbox within 10 seconds.
  - [ ] Verify automatic auto-reply email arrives in the visitor's inbox.
  - [ ] Verify rate limiting prevents repeated spam submissions.
  - [ ] Verify honeypot field catches automated bot scripts silently.

---

## 📞 3. Direct Discovery Booking Links
- [ ] Test the "Launch Discovery Call (Gmail)" button on desktop:
  - [ ] Confirms it opens `https://mail.google.com/mail/?view=cm...` with pre-filled subject and structured discovery questionnaire.
- [ ] Test the "Open Default Mail Client" fallback on mobile and native macOS/Windows clients.
- [ ] Test the quick-copy studio email button with clipboard verification feedback.

---

## 🎥 4. Media & WebGL Fluid Performance
- [ ] Confirm `/public/video.mp4` and `/public/video_dark.mp4` load swiftly on mobile and desktop.
- [ ] Confirm WebGL Navier-Stokes fluid simulation runs at smooth 60fps on high-DPI displays.
- [ ] Confirm seamless `boxFade` feathering eliminates any dark borders or rectangular frames against the `#eeece3` canvas.
- [ ] Verify touch dragging works smoothly on iOS Safari and Android Chrome.

---

## 🔍 5. SEO, Social Cards & Analytics
- [ ] Update `NEXT_PUBLIC_SITE_URL` in `.env.local` / Vercel to `https://redstudios.com`.
- [ ] Review `src/app/layout.tsx` metadata:
  - [ ] OpenGraph image and card preview.
  - [ ] Twitter card preview (`summary_large_image`).
  - [ ] JSON-LD schema (`ProfessionalService` / `Organization`) details.
- [ ] Verify `robots.ts` and `sitemap.ts` generate correctly at `/robots.txt` and `/sitemap.xml`.
- [ ] Insert Google Analytics / PostHog script tag if client requires visitor tracking.

---

## ⚡ 6. Performance & Lighthouse Audit
- [ ] Run production build (`npm run build`).
- [ ] Verify zero TypeScript or ESLint errors.
- [ ] Run Google Lighthouse in Chrome Incognito:
  - [ ] Performance > 90
  - [ ] Accessibility = 100
  - [ ] Best Practices = 100
  - [ ] SEO = 100

---

## 🚀 7. Hosting & Domain Deployment
- [x] Deployed live to Vercel: [https://red-studios-4ez4.vercel.app/](https://red-studios-4ez4.vercel.app/)
- [x] Connected to GitHub CI/CD: [https://github.com/abhinav2050790/red-studios](https://github.com/abhinav2050790/red-studios) (every `main` branch push auto-deploys)
- [ ] Connect custom apex domain `redstudios.com` and `www.redstudios.com` to Vercel.
- [ ] Configure automatic HTTPS SSL certificate.
- [ ] Enable Vercel Web Analytics and Speed Insights (optional).
