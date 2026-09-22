# 🚀 Growfin Digital - Software House & Business Template Platform

**Growfin Digital** is a modern Software House and digital transformation partner designed specifically to empower Indonesian businesses, from local SMEs (UMKM) to large-scale enterprises. 

Our core value proposition is speed and affordability. We provide instant, ready-to-deploy application templates that users can generate and preview on the fly, while also offering full-stack custom software development for more complex needs.

This project operates as a monorepo containing two main components:
1. **Frontend (`/frontend`)**: A Next.js SaaS landing page and the core **Template Generation & Preview Engine**.
2. **Outreach & Automation Engine (`/outreach_crew`)**: An intelligent Python automation pipeline previously used for clinic lead gen, now serving as the backend automation worker for business discovery and data generation.

---

## 🏗️ Project Architecture

### 1. The Frontend Web App (`/frontend`)
Built with **Next.js 16.3 (App Router)**, **React 19**, **TailwindCSS 4**, and **shadcn/ui**.
- **Marketing Storefront**: The main landing page (`app/page.tsx`) showcasing our Template, Pro Custom, and Enterprise services.
- **Dynamic Template Engine**: The core product feature. Users can select a business category (Clinic, Cafe, Resto), input their data, and instantly generate a live preview of their business website. 
- **UMKM-Friendly Pricing**: Designed with an irresistible 3-tier pricing model starting at extremely affordable one-time setups (Rp 299.000) to encourage digital adoption among Indonesian SMEs.

### 2. The Automation Backend (`/outreach_crew`)
A modular Python-based pipeline that acts as the "worker" of the operation.
- Leverages **Google Places API** and **Google Gemini AI** for data enrichment, automated copywriting, and mock-data generation.
- Capable of auto-deploying generated templates to the live frontend and sending real-time notifications via Telegram.

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
- Google Cloud Console API Key & Gemini API Key

### Setup Frontend
```bash
cd frontend
pnpm install
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
- **Frontend**: Next.js, React, TailwindCSS, TypeScript, shadcn/ui
- **Backend/AI**: Python, Google GenAI (Gemini), Pydantic
- **Deployment**: GitHub, Vercel

---
*Empowering Indonesian businesses through instant digital transformation.*
