# Product Requirements Document (PRD): Janus Waitlist Platform

- Version: 1.3
- Status: Comprehensive Specification
- Project Lead: Gemini
- Product: Janus (AI Learning Tool for Norway)
- Primary Objective: Build a high-performance waitlist signup to notify users about beta access, collecting only email and sending two manual emails (1 week before launch and on launch day).

## 1. Project Vision & Strategic Intent

Janus is positioned as the "NotebookLM for Norway" -- an AI that understands the nuances of the Norwegian curriculum, the difference between Bokmål and Nynorsk, and the specific pedagogical requirements of local schools. The waitlist website must act as the primary brand touchpoint, signaling high quality, extreme local relevance, and technological superiority through a "Vipps-clean" Nordic aesthetic.

## 2. Visual Identity & UI/UX Design (The "Vipps-Clean" Standard)

### 2.1 Color Palette & Typography

The app uses the Catppuccin palette, with Frappé for dark mode (default) and Latte for light mode.

- Dark Mode (Catppuccin Frappé):
  - Base Background: `#232634` (frappe-base).
  - Text: `#c6d0f5` (frappe-text).
  - Surface for cards/bento: `frappe-surface0` / `frappe-surface1` for depth.
  - Accents:
    - Blue: `#8caaee` (primary CTAs, links, focus states).
    - Mauve: `#ca9ee6` (secondary highlights).
    - Green: `#a6d189` (success/approved).
    - Red: `#e78284` (errors/danger).
    - Yellow: `#e5c890` (warnings).
- Light Mode (Catppuccin Latte):
  - Base Background: `#eff1f5` (latte-base).
  - Text: `#4c4f69` (latte-text).
  - Surface for cards/bento: `latte-surface0` / `latte-surface1`.
  - Accents:
    - Blue: `#1e66f5` (primary CTAs, links, focus states).
    - Mauve: `#8839ef` (secondary highlights).
    - Green: `#40a02b` (success/approved).
    - Red: `#d20f39` (errors/danger).
- Tailwind Usage: Reference colors via `frappe-` and `latte-` prefixes (e.g., `bg-frappe-base`, `text-latte-blue`, `border-frappe-surface0`).
- Typography:
  - Headings: Geist Sans or Inter (Bold, -0.05em letter spacing).
  - Body: Inter (Medium/Regular) for maximum readability.
- Design Language: High whitespace, extreme corner rounding (`rounded-3xl` or `24px`), and subtle glassmorphism using backdrop blurs.

### 2.2 Component Specifications

- Hero Input: A high-contrast, large-scale email input with a blue-to-mauve shimmer border effect.
- Waitlist Success State: Inline confirmation directly below the input. Show "Takk - du er på ventelisten" and a short expectation line: "Vi sender e-post 1 uke før og på lanseringsdag." (English equivalent required).
- Language Toggle: A visible NO/EN toggle in the header; reflects current language.
- Social Proof: 8 total items across logos and named quotes from students/professors.
- How It Works: 3-step horizontal cards (signup, wait, get beta access link).
- Bento Grid Demos: 3 interactive demo cards (PDF-oppsummering, RAG chatbot, interaktive eksamensspørsmål).
- FAQ: 4-6 concise questions (privacy, timing, beta access, etc.).
- Footer: Privacy Policy link, language toggle, and basic company info.

### 2.3 Page Structure & Layout

Order of sections:
1. Hero + waitlist form
2. Social proof
3. How it works (3 steps)
4. Bento demos/features
5. FAQ
6. Footer

### 2.4 Background & Atmosphere

- Use geometric shapes layered over a subtle grid/topographic pattern.
- Shapes should be softly lit with Catppuccin accents (blue/mauve) and low opacity.
- The background must feel premium, modern, and "designed" rather than flat.

## 3. Functional Requirements

### 3.1 Waitlist Signup (Email Only)

- Input: Single email field.
- CTA Button: "Meld deg på ventelisten" (English equivalent required).
- Validation: Trim and lowercase email, validate standard email format.
- Behavior:
  - New email: Insert into Supabase and show inline success state.
  - Existing active email: Do not create a duplicate; show "Du er allerede påmeldt" (English equivalent required).
  - Existing unsubscribed email: Reactivate and show success state.
- No authentication, no referral system, no ranking, and no gated access. The waitlist is independent from the product itself.

### 3.2 Localization & Language

- Default language: Norwegian.
- Auto-detect language from browser (nb/en).
- Users can override language with the toggle; persist the override (local storage).
- All user-facing copy must be available in Norwegian and English.

### 3.3 Unsubscribe Flow

- Every email includes a unique unsubscribe link.
- Unsubscribe page shows a confirmation state: "Du er avmeldt" with an "Angre" button.
- "Angre" reactivates the subscription.
- Unsubscribed entries are excluded from exports and sends.
- Re-submitting the email via the waitlist form reactivates the subscription.

### 3.4 Product Demos (Interactive Motion)

Instead of static images, use interactive motion demos:

- PDF-oppsummering: Show a source document on the left with highlights and a summary panel on the right.
- RAG chatbot: Show a chat exchange with cited sources and quick context retrieval.
- Interaktive eksamensspørsmål: Toggle between question types (long answer, short answer, MCQ, calculations) with a typewriter effect.

## 4. Technical Architecture & Data Flow

### 4.1 Implementation Stack

- Frontend: Next.js 15 (App Router) with React Server Components.
- Styling: Tailwind CSS with `tailwind-merge` for dynamic class handling.
- Backend/DB: Supabase (PostgreSQL) for waitlist storage.
- Email Ops: Manual exports from Supabase for the two sends (no automated provider integration).

### 4.2 Database Schema (Supabase/PostgreSQL)

```sql
-- Waitlist Table
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  unsubscribe_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_waitlist_created_at ON waitlist_entries (created_at ASC);
CREATE INDEX idx_waitlist_unsubscribed_at ON waitlist_entries (unsubscribed_at);
```

## 5. API Integrations & Logic Flows

### 5.1 Signup Flow (The API Route)

- Endpoint: `/api/waitlist/signup`
- Validate: Check email format.
- Normalize: Trim and lowercase.
- Idempotency:
  - If email exists and `unsubscribed_at` is NULL, return `status: "exists"`.
  - If email exists and `unsubscribed_at` is NOT NULL, clear `unsubscribed_at` and return `status: "reactivated"`.
- Insert: If new, insert row and return `status: "created"`.

### 5.2 Unsubscribe Flow (API + Page)

- Endpoint: `/unsubscribe?token=...` (page)
- API: `/api/waitlist/unsubscribe` and `/api/waitlist/resubscribe`
- Unsubscribe: Look up by `unsubscribe_token`, set `unsubscribed_at = now()`.
- Resubscribe (Undo): Clear `unsubscribed_at` and return success.

### 5.3 Email Sending (Manual)

- Export the waitlist from Supabase with `unsubscribed_at IS NULL`.
- Include unsubscribe links using `unsubscribe_token` (e.g., `https://janus.ai/unsubscribe?token=...`).
- Send two emails only:
  1. One week before launch (beta access notice).
  2. Launch day (product live link).
- No additional campaigns or automation.

## 6. Motion & Animation Specifications

Using Framer Motion and Motion.dev for production-grade transitions:

- Page Entrance: A `StaggerChildren` container for the Hero text to create a wave reveal effect.
- Background Motion: Geometric shapes drift slowly with smooth looping motion; subtle parallax on scroll.
- Inline Success State: Fade/slide in the confirmation message beneath the input.
- Bento Demos: Typewriter effects and highlight animations inside cards.
- Reduced Motion: Respect `prefers-reduced-motion` by disabling continuous background motion and simplifying transitions.

## 7. Security & Reliability (Production Grade)

### 7.1 Data Integrity & Protection

- GDPR Compliance: Provide a Privacy Policy link and store data in European data centers (Supabase `eu-central-1`).
- Minimal Data: Only collect and store email addresses.
- Unsubscribe: Include unsubscribe links in all waitlist emails.
- Data Retention: Delete waitlist entries 1 year after launch.
- Rate Limiting: Implement `upstash/ratelimit` on the signup endpoint. Limit to 5 attempts per IP per hour to prevent bot spamming.
- Input Sanitization: Use Zod schema validation on the server side to prevent injection or malformed data entry.

### 7.2 Performance Optimization

- Image Optimization: Use `next/image` with WebP format for all demo screenshots.
- Background Performance: Use lightweight SVG or CSS for geometric shapes and keep animation costs low.
- SEO: Static `og:image` for social sharing.

## 8. Deployment Strategy

- Database Migration: Initialize Supabase tables and RLS (Row Level Security) policies.
- Vercel Deployment: Configure production environment variables and trigger a build.
- Monitoring: Enable Vercel Speed Insights to monitor LCP (Largest Contentful Paint).
- Operational:
  - Export active waitlist from Supabase for manual email sends.
  - Run a data deletion job 1 year after launch.

## 9. Success Metrics

- Conversion Rate: Percentage of landing page visitors who submit their email. Target: >25%.
- Waitlist Size by Launch: Target: TBD.
- Time to Interact: Under 1.0s on 5G/high-speed mobile connections.
