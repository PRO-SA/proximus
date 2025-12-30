# Product Requirements Document (PRD): Janus Waitlist Platform

- Version: 1.1
- Status: Comprehensive Specification
- Project Lead: Gemini
- Product: Janus (AI Learning Tool for Norway)
- Primary Objective: Build a high-performance, viral-ready waitlist and referral engine to capture the Norwegian student market before product launch.

## 1. Project Vision & Strategic Intent

Janus is positioned as the "NotebookLM for Norway" -- an AI that understands the nuances of the Norwegian curriculum, the difference between Bokmål and Nynorsk, and the specific pedagogical requirements of local schools. The waitlist website must act as the primary brand touchpoint, signaling high quality, extreme local relevance, and technological superiority through a "Vipps-clean" Nordic aesthetic.

## 2. Visual Identity & UI/UX Design (The "Vipps-Clean" Standard)

### 2.1 Color Palette & Typography

- Primary Background: Pure Black (`#000000`) for a premium, OLED-optimized look.
- Primary Accent: Electric Janus Purple (`#7C3AED`) used for CTAs, focus states, and primary icons.
- Secondary Surface: Dark Gray (`#09090B`) for cards and bento boxes.
- Typography:
  - Headings: Geist Sans or Inter (Bold, -0.05em letter spacing).
  - Body: Inter (Medium/Regular) for maximum readability.
- Design Language: High whitespace, extreme corner rounding (`rounded-3xl` or `24px`), and subtle glassmorphism using backdrop blurs.

### 2.2 Component Specifications

- Hero Input: A high-contrast, large-scale email input with a shimmer border effect in purple.
- Bento Grid Demos: A 4-column grid showcasing features (PDF Analysis, Nynorsk Translation, Exam Prep) using animated icons and mock UI snapshots.
- Waitlist Status Card: A centered, floating card for signed-up users showing their rank in a Priority Badge style.

## 3. Functional Requirements

### 3.1 Advanced Ranking & Referral System

The system must move beyond a simple list and implement a competitive queue logic.

- Initial Entry: Users join at the bottom of the list based on a `created_at` timestamp.
- Referral Logic:
  - Each user receives a unique referral code (e.g., `janus.ai/join?ref=OSLO24`).
  - For every successful referral (verified signup), the referrer moves up 50 spots in the queue.
  - The ranking is calculated dynamically: `Rank = Current Index - (Referrals * 50)`.
- Status Dashboard: A post-signup state that persists via local storage or a Magic Link showing:
  - Current Position (e.g., "Du er nå nr. 14 i køen").
  - Total number of referrals.
  - A Next Reward milestone (e.g., "Refer 2 more friends for Alpha Access").

### 3.2 Product Demos (Interactive Motion)

Instead of static images, use Framer Motion to simulate tool behavior:

- The Source Highlight: An animation showing a PDF document on the left and Janus extracting a summary on the right, with purple lines connecting the two.
- The Leksehjelp Chat: A typewriter-effect animation showing a student asking a complex question in Norwegian and Janus responding with academic citations.

## 4. Technical Architecture & Data Flow

### 4.1 Implementation Stack

- Frontend: Next.js 15 (App Router) with React Server Components.
- Styling: Tailwind CSS with `tailwind-merge` for dynamic class handling.
- Backend/DB: Supabase (PostgreSQL) for user data and referral tracking.
- Authentication: Supabase Auth (Email OTP or Magic Links) for high-intent verification.
- Email Engine: Mailchimp Marketing API for newsletter and automated journeys.

### 4.2 Database Schema (Supabase/PostgreSQL)

```sql
-- Waitlist Table
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist_entries(id),
  referral_count INTEGER DEFAULT 0,
  current_rank INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ranking performance
CREATE INDEX idx_waitlist_rank ON waitlist_entries (referral_count DESC, created_at ASC);
```

## 5. API Integrations & Logic Flows

### 5.1 Signup & Referral Flow (The API Route)

- Endpoint: `/api/waitlist/signup`
- Validate: Check email format and check for existing entry in Supabase.
- Referral Check: If a ref code is present in the request, find the owner in the DB and increment their `referral_count`.
- Generate: Create a unique referral link for the new user.
- Supabase Insert: Create the record with `is_verified: false`.
- Mailchimp Sync: Push the email to the Mailchimp "Waitlist" audience with a pending status.

### 5.2 Mailchimp & Confirmation Email

- Service: Mailchimp Transactional (Mandrill) or standard Marketing API.
- Flow:
  1. Upon signup, an "Action Required" email is sent to the user.
  2. User clicks "Bekreft min plass" (Confirm my spot).
  3. User is redirected to the `/success` page on the website.
  4. Mailchimp status updates to subscribed and a tag `Janus-Waitlist` is added.
- Merge Tags: The referral link must be passed to Mailchimp as a merge tag `*|REF_URL|*` so it can be included in all future marketing emails.

## 6. Motion & Animation Specifications

Using Framer Motion and Motion.dev for production-grade transitions:

- Page Entrance: A `StaggerChildren` container for the Hero text to create a wave reveal effect.
- The Rank Counter: A rolling digit animation (similar to bank apps) when the rank updates or when the user first sees their number.
- Scroll-Triggered Reveal:

```javascript
// Conceptual motion logic
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
```

- Input Interaction: When the user clicks the email input, the background purple glow should increase in intensity (pulse effect).

## 7. Security & Reliability (Production Grade)

### 7.1 Data Integrity & Protection

- GDPR Compliance: Since this is for Norwegian students, a Privacy Policy link and a checkbox for marketing consent are mandatory. Data must be stored in European data centers (Supabase `eu-central-1`).
- Rate Limiting: Implement `upstash/ratelimit` on the signup endpoint. Limit to 5 attempts per IP per hour to prevent bot spamming.
- Input Sanitization: Use Zod schema validation on the server side to prevent injection or malformed data entry.

### 7.2 Performance Optimization

- Image Optimization: Use `next/image` with WebP format for all demo screenshots.
- Edge Functions: Use Supabase Edge Functions or Vercel Edge Middleware for geo-specific redirects (ensuring Norwegian users get the fastest response).
- SEO: Dynamic metadata for `og:image` that includes the user's rank when they share their link (e.g., "Jeg er nr. 10 i køen for Janus!").

## 8. Deployment Strategy

- Database Migration: Initialize Supabase tables and RLS (Row Level Security) policies.
- Mailchimp Webhooks: Set up a webhook so that if a user unsubscribes from the email list, they are marked as inactive in the waitlist DB.
- Vercel Deployment: Configure production environment variables and trigger a build.
- Monitoring: Enable Vercel Speed Insights to monitor LCP (Largest Contentful Paint) and ensure the Vipps-clean experience remains fast.

## 9. Success Metrics

- Conversion Rate: Percentage of landing page visitors who submit their email. Target: >25%.
- Viral Factor: Average number of referrals per user. Target: 1.5.
- Time to Interact: Under 1.0s on 5G/high-speed mobile connections.
