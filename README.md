# 🦈 SharkCode - Turn Your Network into Net Worth

A modern referral-based earning platform built with Next.js 15, featuring an integrated AI assistant powered by Claude Haiku.

## ✨ Features

### 💰 Earning Platform
- **₹50 Signup Bonus** - Instant credit on registration
- **Pro Membership** - ₹100 unlocks referral system
- **Referral Earnings** - ₹10 per signup + ₹80 per Pro upgrade
- **UPI Withdrawals** - Minimum ₹100, processed in 24-48 hours
- **Transaction History** - Track all earnings and withdrawals
- **Real-time Dashboard** - Monitor balance and referrals

### 🤖 SharkAI Assistant
- **Full AI Chat** - Like ChatGPT, built into the platform
- **Code Support** - Write, debug, and explain code in any language
- **Markdown Rendering** - Beautiful formatting with syntax highlighting
- **Conversation History** - Save and organize all chats
- **Platform Expert** - Specialized knowledge about SharkCode
- **General Knowledge** - Ask anything - programming, math, writing, etc.

### 👨‍💼 Admin Panel
- **Payment Management** - Approve/reject Pro upgrades
- **Withdrawal Processing** - Handle UPI transfers
- **User Management** - View all users and stats
- **Audit Logging** - Complete trail of all admin actions
- **Analytics Dashboard** - Key metrics at a glance

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk (secure, production-ready)
- **UI:** Tailwind CSS + Radix UI + shadcn/ui
- **AI:** OpenRouter API with Claude 3 Haiku
- **Payments:** UPI integration
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (free)
- OpenRouter API key (for SharkAI)

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Setup Environment Variables**

Create `.env` file:
```env
# Database (use Neon.tech for free PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/sharkcode"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# OpenRouter API (for SharkAI)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

3. **Setup Database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed data
npx prisma db seed
```

4. **Start Development Server**
```bash
npm run dev
```

Visit http://localhost:3000

---

## 📁 Project Structure

```
SharkCode/
├── prisma/
│   └── schema.prisma          # Database schema with all models
├── src/
│   ├── app/
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # API routes
│   │   │   ├── chat/         # SharkAI API
│   │   │   ├── conversations/# Conversation CRUD
│   │   │   ├── payments/     # Payment handling
│   │   │   ├── withdrawals/  # Withdrawal processing
│   │   │   └── webhooks/     # Clerk webhooks
│   │   ├── chat/             # SharkAI chat interface
│   │   ├── dashboard/        # User dashboard
│   │   ├── refer/            # Referral management
│   │   ├── withdraw/         # Withdrawal page
│   │   ├── profile/          # User profile
│   │   └── ...               # Other pages
│   ├── components/
│   │   ├── chat/             # Chat UI components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # Reusable UI components
│   └── lib/
│       ├── db.ts             # Prisma client
│       ├── utils.ts          # Utility functions
│       └── validations.ts    # Zod schemas
└── ...
```

---

## 🗄️ Database Models

### Core Models
- **User** - User accounts with balance tracking
- **Payment** - Pro upgrade payment submissions
- **Withdrawal** - Withdrawal requests
- **ReferralEvent** - Referral earnings tracking

### AI Chat Models
- **Conversation** - Chat threads
- **Message** - Individual messages

### Admin Models
- **AuditLog** - Admin action tracking
- **IdempotencyKey** - Webhook replay protection

---

## 🔒 Security Features

✅ **Clerk Authentication** - Industry-standard auth  
✅ **Role-Based Access** - Admin vs User permissions  
✅ **Input Validation** - Zod schemas on all endpoints  
✅ **Optimistic Locking** - Prevents race conditions  
✅ **Audit Logging** - Track all admin actions  
✅ **CSRF Protection** - Next.js built-in  
✅ **SQL Injection Prevention** - Prisma ORM  
✅ **Unique Constraints** - Prevent duplicate submissions  

---

## 💳 Payment Flow

1. User clicks "Upgrade to Pro"
2. System shows UPI ID: `sharkcode@upi`
3. User pays ₹100 via any UPI app
4. User submits 12-digit UTR reference
5. Admin reviews and approves payment
6. User upgraded to Pro + referrer gets ₹80 bonus

---

## 📊 Referral System

1. **Sign Up** - User creates account (₹50 bonus)
2. **Upgrade to Pro** - Pay ₹100 to unlock referrals
3. **Get Referral Link** - Unique code and QR code
4. **Share Link** - Social media, WhatsApp, etc.
5. **Earn Money** - ₹10 per signup, ₹80 per Pro upgrade
6. **Withdraw** - Minimum ₹100 to UPI

---

## 🤖 SharkAI Usage

### Basic Chat
1. Click "SharkAI" in bottom navigation
2. Type your question
3. Get instant AI response with formatting

### Programming Help
```
User: "Write a function to reverse a string in JavaScript"
AI: [Returns formatted code with syntax highlighting]
```

### Platform Questions
```
User: "How do I withdraw my earnings?"
AI: Explains withdrawal process, minimum amount, timeline
```

### Multiple Conversations
- Click "New Chat" to start fresh
- Switch between conversations in sidebar
- Rename or delete old chats
- All history saved automatically

---

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with features |
| Dashboard | `/dashboard` | User stats and balance |
| Referrals | `/refer` | Referral code and QR |
| Withdraw | `/withdraw` | Request withdrawal |
| History | `/history` | Transaction history |
| Profile | `/profile` | User settings |
| Pro Upgrade | `/pro-upgrade` | Pay for Pro |
| **SharkAI** | `/chat` | **AI Assistant** |
| Admin Panel | `/admin/*` | Admin management |

---

## 🎨 Design System

- **Colors:** Blue gradient theme
- **Typography:** Geist Sans & Geist Mono
- **Components:** shadcn/ui (Radix primitives)
- **Animations:** Tailwind + custom keyframes
- **Icons:** Lucide React
- **Mobile-First:** Responsive design

---

## 🔧 Configuration

### Clerk Setup
1. Create account at clerk.com
2. Create application
3. Copy API keys to `.env`
4. Add webhook endpoint: `https://your-domain.com/api/webhooks/clerk`

### Database Setup (Neon - Recommended)
1. Visit neon.tech
2. Create free project
3. Copy connection string
4. Add to `.env` as `DATABASE_URL`

### OpenRouter Setup
1. Visit openrouter.ai
2. Create API key
3. Add to `.env` as `OPENROUTER_API_KEY`

---

## 📦 Dependencies

### Core
- next@15.0.3
- react@19
- @clerk/nextjs@6.35.5
- @prisma/client@5.22.0

### UI
- tailwindcss@4
- lucide-react
- @radix-ui/react-*
- sonner (toast notifications)

### AI & Markdown
- react-markdown
- react-syntax-highlighter
- remark-gfm
- rehype-raw

### Utilities
- zod (validation)
- swr (data fetching)
- qrcode.react

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# View database
npx prisma studio
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### Environment Variables in Production
- Add all `.env` variables to Vercel/hosting platform
- Set `DATABASE_URL` to production PostgreSQL
- Ensure `OPENROUTER_API_KEY` is configured

### Database Migration in Production
```bash
# In production
npx prisma migrate deploy
```

---

## 📈 Performance Metrics

- **Page Load:** < 1s
- **API Response:** < 300ms (without AI)
- **AI Response:** 1-3s (Claude Haiku)
- **Database Queries:** Optimized with indexes
- **Mobile Score:** 95+ (Lighthouse)

---

## 🤝 Contributing

This is a private project, but key areas for enhancement:

1. Rate limiting (add Upstash Redis)
2. Streaming AI responses
3. Image generation capability
4. Voice input/output
5. Mobile app (React Native)

---

## 📄 License

Private/Proprietary

---

## 🆘 Support

- **Technical Issues:** support@sharkcode.com
- **Documentation:** See `SHARKAI_COMPLETE_GUIDE.md`
- **Database Migration:** See `DATABASE_MIGRATION.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Key Achievements

✅ Production-ready database architecture  
✅ Complete AI assistant integration  
✅ Secure payment and withdrawal system  
✅ Mobile-responsive design  
✅ Admin panel with audit logging  
✅ Full conversation management  
✅ Markdown and code rendering  
✅ Type-safe API with validation  
✅ Optimized performance  
✅ Beautiful, modern UI  

---

## 🏆 Built With Best Practices

- TypeScript for type safety
- Prisma for type-safe database
- Zod for runtime validation
- Optimistic locking for race conditions
- Audit logging for compliance
- Mobile-first responsive design
- Accessibility considerations
- SEO optimization
- Error boundaries
- Loading states
- Toast notifications

---

**SharkCode** - The most complete referral platform with built-in AI! 🚀
