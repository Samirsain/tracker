# 🌿 Sacred Habit — Creator Relationship Management (CRM)

> **A Next-Gen, Data-Driven Creator CRM & Influencer Scoring Infrastructure built for Modern D2C Brands.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 🎯 Project Goal & Purpose

**Sacred Habit Creator CRM** is an end-to-end influencer management and automated evaluation system designed to scale creator partnerships from **one-off sponsored posts into high-ROI long-term brand ambassador networks**.

Instead of relying on manual spreadsheets or subjective guesses, **Sacred Habit CRM** uses a **100-Point Weighted Evaluation Algorithm** and **Multi-Tier AI Profile Enrichment (Instagram Scraping + Google Gemini AI)** to automatically score creators, determine deal pricing, track deliverables, and calculate real-time **ROAS, CPA, and Conversion metrics**.

---

## ✨ Key Features & Highlights

### ⚡ 1. Multi-Tier AI 1-Click Profile Autofill
- **Instant DB Lookup (0ms)**: Zero-latency enrichment for top-tier creators (CarryMinati, MKBHD, etc.).
- **Resilient Gemini AI Pipeline**: Uses Google Gemini 2.0 / 1.5 Flash models to extract follower counts, engagement rate, content niche, target demographics, and estimated deal rates.
- **Smart Fallback Engine**: Guaranteed profile extraction with 100% uptime.

### 🧮 2. 100-Point Algorithmic Creator Scoring Engine
Creators are objectively scored based on 5 weighted criteria defined in the Product Requirements Document (PRD):
- **Audience Fit (3.0x - 30%)**: Purchasing power & alignment with health/wellness audience.
- **Trust & Credibility (2.5x - 25%)**: Authentic audience engagement and community trust.
- **Content Quality (2.0x - 20%)**: Storytelling depth, production quality, and education value.
- **Cost Efficiency (1.5x - 15%)**: Cost per view/engagement ratio.
- **Reach & Impressions (1.0x - 10%)**: Total reach across Reels & Stories.

### 🚦 3. Automated Decision & Recommendation Engine
Based on calculated scores, the CRM automatically recommends optimal partnership models:
- **90 – 100 Marks** → 👑 **Founding Brand Ambassador** (Monthly Retainer)
- **80 – 89 Marks** → 🎬 **Paid Reel Campaign**
- **70 – 79 Marks** → 📸 **Story Campaign / Affiliate Partner**
- **60 – 69 Marks** → 📦 **Barter Collaboration**
- **< 60 Marks** → ❌ **Do Not Collaborate**

### 🔄 4. Standardized 11-Stage Relationship Lifecycle
Pipeline stages track creator partnerships seamlessly:
$$\text{Prospect} \rightarrow \text{Shortlisted} \rightarrow \text{Contacted} \rightarrow \text{Waiting Reply} \rightarrow \text{Interested} \rightarrow \text{Negotiation} \rightarrow \text{Product Sent} \rightarrow \text{Campaign Live} \rightarrow \text{Completed} \rightarrow \text{Ambassador / Inactive}$$

### 📊 5. PRD Success Analytics & Executive KPIs
- **Return on Ad Spend (ROAS)** & **Cost Per Acquisition (CPA)**
- **Creator Response Rate (%)** & **Collaboration Conversion Rate (%)**
- **Active Ambassadors Counter** & **Repeat Collaboration Rate (%)**
- **Interactive Leaderboards**: Highest Engagement, Lowest Cost Per Reel, Best Audience Fit.

### 🖨️ 6. Professional Reports & Export Center
- **Clean PDF / Print View**: Styled `@media print` layout for printable executive board reports.
- **CSV & Excel Workbook Exports**: Download formatted data with PRD commercial fields (`Monthly Retainer`, `Coupon Code`, `Deliverables Completed`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js App Router (React 19), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons.
- **Backend / Database**: Server Actions, Prisma ORM, PostgreSQL (Supabase / Local DB).
- **Authentication**: NextAuth.js (Session & Role-Based Access Control).
- **AI & Data Enrichment**: RapidAPI (Instagram Scraping) + Google Gemini API (`gemini-2.0-flash`).

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `18.x` or higher
- PostgreSQL Database URL (Local or Supabase)
- Google Gemini API Key

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Samirsain/tracker.git
cd tracker
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tracker"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

GEMINI_API_KEY="your-gemini-api-key"
RAPIDAPI_KEY="your-rapidapi-key"
RAPIDAPI_INSTAGRAM_HOST="instagram120.p.rapidapi.com"
```

### 3. Push Database Schema & Seed Data
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Lead Developer & Author

<div align="center">

### **Samir Sain**
*Full-Stack Engineer & AI Applications Developer*

🌐 **Website**: [www.samirsain.com](https://www.samirsain.com)  
💼 **Portfolio**: [samirsain.com](https://www.samirsain.com)  
💻 **GitHub**: [@Samirsain](https://github.com/Samirsain)  

---

*Designed & Developed with ❤️ by **Samir Sain** for Sacred Habit.*

</div>
