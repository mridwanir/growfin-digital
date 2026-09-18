# 🚀 Growfin Digital - Lead Generation & Demo Automation Engine

**Growfin Digital** is an end-to-end B2B Local Lead Generation and Demonstration Engine designed specifically for the health and wellness niche (Dental Clinics, Aesthetic Centers, and Medical Clinics). 

This project operates as a monorepo containing two main synergistic components:
1. **Frontend (`/frontend`)**: A Next.js SaaS landing page and a highly interactive, mobile-first dynamic demo engine.
2. **Outreach Engine (`/outreach_crew`)**: An intelligent Python automation pipeline that scans Google Maps, leverages AI (Gemini) to generate personalized outreach pitches and simulated demo data, and auto-deploys the results to the live frontend.

---

## 🏗️ Project Architecture

This repository is structured as a monorepo:

### 1. The Frontend Web App (`/frontend`)
Built with **Next.js 16.3 (App Router)**, **React 19**, **TailwindCSS 4**, and **shadcn/ui**.
- **Marketing Landing Page**: The main storefront (`app/page.tsx`) showcasing the value proposition of Growfin Digital.
- **Dynamic Demo Engine**: The core product. When navigating to `/demo/[slug]`, the app reads from a statically generated database (`lib/demos.ts`) to render a highly polished, interactive mockup of a booking interface customized for the prospective clinic. This allows the sales team to send a live, personalized "preview" to a prospect instantly.

### 2. The Outreach Automation Backend (`/outreach_crew`)
A modular Python-based pipeline that acts as the "brain" and the "worker" of the operation.
- **Discovery**: Uses the **Google Places API (New)** to scan specific geographical radiuses for high-rated clinics that lack a proper website.
- **AI Copywriting & Data Generation**: Uses **Google Gemini 2.5 Flash** to:
  1. Write a casual, persuasive WhatsApp outreach pitch (Trojan Horse strategy).
  2. Generate structured JSON data simulating the clinic's doctors, services, and pricing (`BusinessDemo` Pydantic schema).
- **Auto-Injection**: Programmatically updates the Next.js frontend's `lib/demos.ts` file with the newly generated AI data.
- **Auto-Deployment**: Automatically commits and force-pushes the updated frontend code to GitHub, triggering an instant Vercel deployment.
- **Real-time Notifications**: Sends the generated pitch, clinic details, and live demo link directly to a Telegram group via the Telegram Bot API.

---

## 🔄 The End-to-End Workflow

Here is how the magic happens in a single run:

1. **Trigger**: You run `python main.py` in the `outreach_crew` directory and input a target city (e.g., "Bandung"), coordinates, and search radius.
2. **Scan & Filter**: The Python engine finds a 4.8⭐ Dental Clinic with 50+ reviews but no website. It is flagged as a 🔥 **Hot Lead**.
3. **AI Generation**: Gemini creates a mock doctor profile, realistic dental scaling prices, and a personalized WhatsApp message.
4. **Auto-Inject & Push**: The engine silently adds this data to `frontend/lib/demos.ts` and pushes it to GitHub.
5. **Live Deployment**: Vercel automatically rebuilds the Next.js site.
6. **Notification**: Your phone buzzes with a Telegram message containing the ready-to-send WhatsApp pitch and a live URL (e.g., `growfin.my.id/demo/klinik-gigi-sehat`).
7. **Action**: You copy-paste the pitch to the clinic owner, and the link is already live and working beautifully!

---

## 🚀 Getting Started

### Prerequisites
- Node.js & `pnpm` (for the frontend)
- Python >= 3.10 & `uv` (for the outreach crew)
- Google Cloud Console API Key (Places API)
- Google Gemini API Key
- Telegram Bot Token & Chat ID

### Setup Frontend
```bash
cd frontend
pnpm install
pnpm dev
```
The site will be available at `http://localhost:3000`.

### Setup Outreach Automation
```bash
cd outreach_crew
# Create virtual environment and install dependencies
uv venv
uv pip install -r requirements.txt

# Setup Environment Variables
# Create a .env file based on the config requirements
# GEMINI_API_KEY=...
# GOOGLE_MAPS_API_KEY=...
# TELEGRAM_BOT_TOKEN=...
# TELEGRAM_CHAT_ID=...

# Run the pipeline
python main.py
```

---

## 🛠️ Tech Stack Highlights
- **Frontend**: Next.js, React, TailwindCSS, TypeScript, Lucide Icons
- **Backend/AI**: Python, Google GenAI (Gemini 2.5), Pydantic, Pandas, Requests
- **Deployment**: GitHub (Source), Vercel (Hosting)

---
*Built with precision for high-conversion B2B local outreach.*
