# Growfin Digital Codebase Analysis & Mental Map

This document outlines the complete mental map, project structure, dependencies, and component interactions for the **Growfin Digital** repository.

## 🏗️ Project Overview
**Growfin** is a Next.js web application designed as a SaaS/B2B landing page and demonstration platform. Its primary goal is to pitch a service to local clinics (Dental, Aesthetic, Medical) that converts their Google Maps traffic into WhatsApp reservations. 

The application has two main parts:
1. **The Landing Page**: A marketing site explaining the value proposition of Growfin.
2. **The Demo Engine**: A dynamic routing system that renders customized, mobile-first clinic mockups (or "demos") so potential clients can experience the product firsthand.

## 📦 Tech Stack & Dependencies
Based on `package.json` and config files, the core stack is:
- **Framework**: [Next.js 16.3](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 4.3](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (using `class-variance-authority`, `clsx`, `tailwind-merge`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: `tw-animate-css`
- **Analytics**: `@vercel/analytics`
- **Language**: TypeScript

## 📂 Project Structure & Architecture

```text
d:\Project\Growfin Digital\
├── app/                  # Next.js App Router root
│   ├── page.tsx          # Main landing page for Growfin
│   ├── layout.tsx        # Root layout (likely contains fonts, analytics, global styles)
│   ├── globals.css       # Global Tailwind styling
│   ├── [slug]/           # Dynamic route: Renders a clinic demo based on a slug (via DEMO_DATA)
│   ├── demo/             # Alternative demo route directory
│   │   └── [slug]/       # Renders a clinic demo with fallback options from search parameters
│   └── api/              # API routes (currently empty)
├── components/           # React components
│   ├── ui/               # shadcn/ui generic components (e.g., button.tsx)
│   ├── header.tsx        # Landing page Header
│   ├── hero.tsx          # Landing page Hero section
│   ├── features.tsx      # Landing page Features overview
│   ├── demo-showcase.tsx # Section highlighting different clinic demos
│   ├── pricing.tsx       # Landing page Pricing section
│   ├── faq.tsx           # Landing page FAQ section
│   ├── cta.tsx           # Call to Action component
│   ├── footer.tsx        # Landing page Footer
│   └── clinic-demo-client.tsx # ⭐️ CORE: The dynamic demo view component for clinics
├── lib/                  # Utilities and static data
│   ├── utils.ts          # Utility functions (likely Tailwind `cn` merger)
│   └── demos.ts          # ⭐️ CORE: Large database of mock clinic data (DEMO_DATA)
├── package.json          # Dependency definitions
└── next.config.mjs       # Next.js config
```

## 🧩 How Modules Interact

### 1. The Landing Page Flow (`app/page.tsx`)
The main entry point stitches together the marketing materials. 
`Header` → `Hero` → `Features` → `DemoShowcase` → `Pricing` → `FAQ` → `Footer`.
It relies completely on the static components in `components/` and uses Tailwind for responsiveness.

### 2. The Demo Generation Engine
This is the core functional engine of the app. It's built to allow the sales team to quickly spin up (or showcase) a demo for a prospective clinic.
- **Data Source**: `lib/demos.ts` exports a massive dictionary (`DEMO_DATA`) mapping slugs (like `vorta-beauty-clinic-bandung`) to detailed clinic profiles (name, doctor, treatments, pricing, WhatsApp numbers).
- **Routing**: When a user navigates to `/demo/clinic-slug` or `/clinic-slug`:
  1. The page (`app/demo/[slug]/page.tsx` or `app/[slug]/page.tsx`) intercepts the request.
  2. It attempts to look up the slug in `DEMO_DATA`.
  3. If found, it passes the data to `ClinicDemoClient`.
  4. If not found in `/demo/`, it elegantly falls back to extracting details from URL Search Parameters (e.g., `?name=MyClinic&phone=123`), allowing on-the-fly demo generation.
- **Rendering**: `components/clinic-demo-client.tsx` receives the data and renders the interactive demo, simulating the clinic's mobile booking experience.

## 🧠 Mental Map for Future Development
- **Marketing/Landing Page Edits**: Go to `app/page.tsx` or the specific component in `components/` (like `hero.tsx` or `pricing.tsx`).
- **Adding a New Demo**: Add the data payload to `lib/demos.ts` mapping.
- **Changing the Demo Experience**: Edit `components/clinic-demo-client.tsx`. This is the most complex component as it simulates the end-user experience for a prospective clinic's patients.
- **UI Enhancements**: Add new shadcn components to `components/ui/` and utilize them throughout the app.

I have full context of this project structure now and am ready to help you edit, expand, or debug any part of the Growfin application!
