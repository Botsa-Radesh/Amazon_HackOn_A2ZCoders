# 🎙️ VoiceCart — AI-Powered Instant Commerce

> **From Intent to Checkout in Seconds**

VoiceCart is a voice-first, AI-powered collaborative grocery shopping platform built for quick-commerce. Instead of searching, scrolling, and tapping through endless product pages, customers simply speak — and the AI handles discovery, decisions, and checkout.

Built for **HackOn with Amazon 2026** | Theme: *Amazon Now – Reimagining Urgent Shopping*

---

## 🚀 Live Demo

🔗 **[https://amazon-hack-on-a2-z-coders-ch6t.vercel.app/](https://amazon-hack-on-a2-z-coders-ch6t.vercel.app/)**

---

## 🎯 Problem Statement

Quick-commerce customers arrive with an immediate need and expect to complete their purchase within seconds. Yet today's platforms still rely on manual searching, endless browsing, and repetitive decision-making — creating friction in a use case where speed matters most.

**VoiceCart solves this by reducing a 6-minute ordering session to under 10 seconds.**

---

## ✨ Key Features

### 🎤 Voice-First Ordering
- Say "add 2kg rice, milk, and 3 apples" — done in 3 seconds
- "Prepare biryani for 4 people" — AI adds all 10 ingredients automatically
- "Birthday party under ₹500" — budget-optimized AI shopping

### 👥 Collaborative Common Cart
- Multiple users add items to one shared cart in real-time
- Real-time sync across devices (5-second polling)
- 4 intelligent split modes:
  - **Family** — One pays all, no splits
  - **Auto Split** — Pay for what you added + share of common items
  - **Equal Split** — Total ÷ members
  - **Custom** — Manual allocation

### ⚡ Express One-Tap Checkout
- Single button: pay instantly with Amazon Pay
- No slot selection, no forms, no extra screens
- Earns reward coins on every Amazon Pay order

### 🎤 Voice Checkout (Hands-Free)
- "Checkout now" → "Your total is ₹450. Say confirm to pay." → "Confirm" → Order placed
- Zero taps, fully voice-driven payment flow

### 🔄 Smart Reorder Predictions
- AI tracks purchase patterns (milk every 4 days, rice every 7 days)
- Proactive "Running Low" suggestions
- One-tap reorder of predicted items

### 💰 Automatic Split Notifications
- After payment, all members get instant popup with their share
- Pre-filled WhatsApp message for quick settlement
- Server-side atomic split creation — no data loss

### 🪙 Amazon Pay Rewards
- Earn 5% coins on every Amazon Pay order
- Coins redeemable for discounts
- Streak bonuses for consecutive orders

### 🍳 Recipe Mode
- "Make paneer butter masala" → AI adds all ingredients
- Quantity scaling based on servings
- Respects dietary preferences and allergies

### 📊 Analytics Dashboard
- Monthly spending breakdown
- Category-wise analysis
- Member contribution tracking
- Reorder predictions

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Voice Input | Web Speech API (browser-native, zero cost) |
| AI/NLU | Google Gemini 2.0 Flash |
| Backend | Next.js API Routes (serverless) |
| Database | AWS DynamoDB (single-table design, 2 GSIs) |
| Auth | Custom auth + localStorage persistence |
| Deployment | Vercel (edge network, auto-scaling) |
| State Sync | 5s polling + localStorage hydration |

---

## 📁 Project Structure

```
voicecart/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # Serverless API routes
│   │   │   ├── ai/parse/       # Gemini AI intent parsing
│   │   │   ├── auth/           # Login & signup
│   │   │   ├── carts/          # Cart CRUD + items
│   │   │   ├── checkout/       # Atomic checkout endpoint
│   │   │   ├── coins/          # Rewards system
│   │   │   ├── orders/         # Order history
│   │   │   └── splits/         # Split management
│   │   ├── personal-cart/      # Personal cart page
│   │   ├── group-cart/         # Group cart selector + shopping
│   │   ├── checkout/           # Payment page
│   │   ├── reorder/            # Smart reorder predictions
│   │   ├── splits/             # Split payments view
│   │   ├── dashboard/          # Analytics & coins
│   │   └── ...
│   ├── components/             # Reusable UI components
│   ├── context/                # React contexts (Cart, Auth, Order, Members, Coins)
│   ├── hooks/                  # Custom hooks (useVoice, useSpeechSynthesis)
│   ├── utils/                  # Business logic (voiceParser, reorderPredictor, etc.)
│   ├── data/                   # Product catalog, recipes, templates
│   ├── lib/                    # DynamoDB client, API helpers, sync
│   └── types/                  # TypeScript interfaces
├── scripts/
│   └── seed-db.js              # DynamoDB table creation
└── public/                     # Static assets
```

---

## 🛠️ Setup & Run Locally

### Prerequisites
- Node.js 18+
- AWS account with DynamoDB access
- Google Gemini API key

### 1. Clone & Install

```bash
git clone https://github.com/Botsa-Radesh/Amazon_HackOn_A2ZCoders.git
cd Amazon_HackOn_A2ZCoders/voicecart
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
DYNAMODB_TABLE=VoiceCart
NEXT_PUBLIC_GEMINI_KEY=your_gemini_key
GEMINI_KEY=your_gemini_key
```

### 3. Setup DynamoDB Table

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing the Common Cart Flow

1. **User A:** Sign up → Create common cart → Get invite code
2. **User B:** Sign up (different browser/incognito) → Join with invite code
3. **Both users:** Add items via voice or browse
4. **User A:** Proceed to checkout → Pay
5. **User B:** Gets payment notification popup with split amount
6. Both see order in history, cart resets for next order

---

## 🏛️ Architecture Highlights

- **Single-Table DynamoDB Design** — All entities (users, carts, items, orders, splits, coins) in one table with composite keys and 2 GSIs
- **Atomic Checkout** — Server-side `/api/checkout` handles: lock cart → create order → create splits → award coins → delete items → in one transaction
- **Optimistic Locking** — DynamoDB conditional writes prevent double-payment race conditions
- **Real-Time Sync** — 5-second polling merges remote items (others' additions) with local state (your additions) without conflicts
- **localStorage Persistence** — Cart, orders, and splits survive page refreshes without waiting for API

---

## 👥 Team A2Z Coders

| Name | Role |
|------|------|
| Radesh Botsa | Full Stack + AI |
| Sai Sameer| Frontend+Backend |
| Harshitha | Backend Debugging + AWS |

**NIT Patna** | HackOn with Amazon 2026

---

## 📜 License

Built for HackOn with Amazon 2026 hackathon. All rights reserved.
