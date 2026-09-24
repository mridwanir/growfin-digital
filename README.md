# 🚀 Growfin Digital - Software House & Business Template Platform

**Growfin Digital** is a modern Software House and digital transformation partner designed specifically to empower Indonesian businesses, from local SMEs (UMKM) to large-scale enterprises. 

Our core value proposition is speed and affordability. We provide instant, ready-to-deploy application templates that users can generate and preview on the fly, while also offering full-stack custom software development for more complex needs.

This project operates as a monorepo containing two main components:
1. **Frontend (`/frontend`)**: A Next.js SaaS landing page and the core **Template Generation & Preview Engine**.
2. **Outreach & Automation Engine (`/outreach_crew`)**: An intelligent Python automation pipeline used as the backend automation worker for mass outbound marketing and data mining.

---

## 🏗️ Project Architecture

### 1. The Frontend Web App (`/frontend`)
Built with **Next.js 16.3 (App Router)**, **React 19**, **TailwindCSS 4**, and **shadcn/ui**.
- **Marketing Storefront**: The main landing page (`app/page.tsx`) showcasing our Template, Pro Custom, and Enterprise services.
- **Dynamic Template Engine & Onboarding Flow**: The core product feature. Users can select a business category, input their data, and instantly generate a live preview of their business website.
  - **The "Onboarding" API (`/api/generate`)**: Upon submission, the frontend calls this route, which performs a lookup using the **Google Places API** to gather real images, addresses, and reviews. 
  - **AI Generation**: It then uses **Google Gemini 2.5 Flash** to automatically map the real-world data into structured JSON metadata (including UI vibe, theme colors, services/menus, and copywriting).
  - **Database & Rendering**: The metadata is saved directly to **Supabase** and the user is redirected to a personalized live preview (`/demo/[slug]`).
- **UMKM-Friendly Pricing**: Designed with an irresistible 3-tier pricing model starting at extremely affordable one-time setups (Rp 299.000) to encourage digital adoption among Indonesian SMEs.

### 2. The Automation Backend (`/outreach_crew`)
A modular Python-based pipeline that acts as the "worker" for mass lead generation.
- Leverages **Google Places API** and **Google Gemini AI** for scanning areas, enriching data, and automated copywriting.
- Focuses on discovering potential leads automatically and sending them personalized outreach messages with pre-generated demo URLs.

---

## 💼 Product Offerings & Pricing Strategy (Land and Expand)

Growfin's business model is built around a low barrier to entry to acquire a massive volume of UMKM clients, and then upselling them as they grow.

1. **Template Instan (Rp 299k One-time)**: Instant live website templates generated in 24 hours. Basic customization and WhatsApp integration.
2. **Pro Custom (Rp 2.49M One-time)**: For growing businesses needing specific features like basic Payment Gateways, Booking Systems, and custom UI.
3. **Enterprise Solutions (Project Based)**: End-to-end custom software architecture, AI model integration, and scalable cloud deployment built from scratch.

---

## 🚀 Getting Started

### Prerequisites
- Node.js & `pnpm` (for the frontend)
- Python >= 3.10 & `uv` (for the automation backend)
- Google Cloud Console API Key, Gemini API Key & Supabase Keys

### Setup Frontend
```bash
cd frontend
pnpm install
# Ensure you configure your .env.local with GEMINI_API_KEY, GOOGLE_MAPS_API_KEY, and NEXT_PUBLIC_SUPABASE_* 
pnpm dev
```
The site will be available at `http://localhost:3000`.

### Setup Automation Backend
```bash
cd outreach_crew
uv venv
uv pip install -r requirements.txt
# Setup .env with necessary API Keys
python main.py
```

---

## 🛠️ Tech Stack Highlights
- **Frontend**: Next.js (App Router), React 19, TailwindCSS 4, TypeScript, shadcn/ui
- **Database**: Supabase
- **AI & Integrations**: Google GenAI (Gemini 2.5 Flash), Google Places API
- **Backend Automation**: Python, Pydantic, uv
- **Deployment**: Vercel

---
*Empowering Indonesian businesses through instant digital transformation.*
