# Emerald Horizon Ventures — Sales Pages (2026)

Complete, conversion-focused sales pages for EHV programs.

## Pages Included

- **`/` (index.html)** — Main homepage with all products
  - Hero with $25 early bird pricing
  - Product stack: Competitions, Tours, Publishing
  - Social proof & testimonials
  - FAQ & final CTA
  - Deploy to: `emeraldhv.com`

- **`/aispc` (aispc.html)** — A-ISPC 2026 Competition
  - Team vs. Individual entry options
  - $25/$30 pricing prominent
  - Finals Dec 4–6 Hong Kong/Bangkok
  - Deploy to: `aispc2026.org`

- **`/tour` (tour.html)** — Study Tour Program
  - Steve & Kate's warmth + parent benefits
  - $695–895 all-inclusive
  - Day-by-day itinerary
  - Deploy to: `emeraldhv.com/tour`

- **`/competitions` (competitions.html)** — Competitions Overview
  - All three competitions: A-ISPC, A-IBFC, Emerald Prize
  - Card-based layout (Chegg style)
  - Team/Individual/Category A-B separation
  - Deploy to: `emeraldhv.com/competitions`

## Design Model

Combines three reference sites:
- **Thinkific** (thinkific.com) — Sticky CTAs, social proof, feature stacks, case studies
- **Steve & Kate's Camp** (steveandkatescamp.com) — Emotional warmth, parent-focus, all-inclusive messaging
- **Chegg Skills** (chegg.com/skills) — Card grids, visual hierarchy, clear outcomes

## Key Features

✓ **Sales-first copy** — Urgency, pricing, benefits over features  
✓ **Multiple CTAs** — On every section, clear next steps  
✓ **Responsive design** — Mobile-first, works at all breakpoints  
✓ **$25/$30 pricing** — Visible on hero, cards, and every CTA section  
✓ **Individual participation** — Equal treatment with team entry, separate medals  
✓ **Social proof** — Testimonials, stats, judge panels, trust badges  
✓ **Transparent FAQ** — Addresses parent/student concerns head-on  

## Deployment

### Netlify Setup
1. Connect this repo to Netlify
2. Set build command: (leave empty)
3. Set publish directory: `public/`
4. Auto-deploys on `main` branch push
5. `netlify.toml` handles routing

### Domain Mapping
- `emeraldhv.com` → main homepage
- `aispc2026.org` → A-ISPC page
- `aibfc.org` → A-IBFC page (coming)
- `emeraldprize.com` → Emerald Prize page (coming)

## Content TODO

- [ ] Add hero images (carousel of real student photos)
- [ ] Add testimonial photos (students + parents)
- [ ] Add judge headshots (560×700px, quality 82)
- [ ] Wire Whop checkout links to registration buttons
- [ ] Lock finals venue (HK or Bangkok)
- [ ] Build A-IBFC full page
- [ ] Build Emerald Prize full page
- [ ] Add financial aid/scholarship info to FAQ

## Editing

All pages are plain HTML + CSS (no frameworks). Safe to edit directly:
1. Update text copy in the HTML
2. Change colors via `:root` CSS variables
3. Adjust CTAs in each section
4. Push to GitHub → Netlify auto-deploys

## Contact

Email: competitions@emeraldhv.com  
WhatsApp: +66 61 075 8421  
Location: Chiang Mai, Thailand | Hong Kong (registered)
