# 📊 LunarAI Beauty - Sections Breakdown

## 🎯 Overview

Website **LunarAI Beauty Business Analysis** (bolt-vercel) adalah aplikasi Next.js yang menghasilkan laporan analisis produk kecantikan secara real-time menggunakan AI. Sistem ini memproses data produk dan menghasilkan 12 section berbeda yang ditampilkan secara streaming.

---

## 🏗️ Arsitektur Website

### **Tech Stack**

- **Framework**: Next.js 14.1.0
- **UI Library**: React 18.2.0 + Framer Motion
- **Styling**: TailwindCSS + Radix UI
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Real-time**: Server-Sent Events (SSE)
- **Port**: 3004

### **Struktur Folder**

```
apps/bolt-vercel/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage (Form Input)
│   │   ├── result/[id]/page.tsx  # Result Page (Report Display)
│   │   └── api/
│   │       ├── sync/section/     # API untuk menerima section dari n8n
│   │       └── result/[id]/stream/ # SSE stream untuk real-time updates
│   ├── components/
│   │   ├── SectionCard.tsx       # Component untuk render tiap section
│   │   ├── ProgressBar.tsx       # Progress bar untuk tracking
│   │   ├── report/ProductReport.tsx # Full report component
│   │   └── form/                 # Form components
│   └── lib/
│       ├── db.ts                 # Database schema
│       ├── persistence.ts        # Data persistence logic
│       └── realtime.ts           # SSE broadcasting
```

---

## 📄 Halaman Utama

### **1. Homepage (`/`)**

**File**: `src/app/page.tsx`

#### **Sections di Homepage:**

##### **A. Hero Section**

- **Judul**: "LunarAI Beauty Business Analysis"
- **Subtitle**: "Isi detail produk Anda untuk menghasilkan analisis mendalam yang komprehensif"
- **Features Pills**:
  - 🔵 Mudah
  - 🟣 Cepat
  - 🔷 Evidence-Based

##### **B. Feature Cards (3 Cards)**

1. **AI-Powered Analysis**
   - Icon: Sparkles ✨
   - Warna: Blue
2. **Submission Counter**
   - Icon: TrendingUp 📈
   - Warna: Cyan
   - Menampilkan jumlah submission
3. **Lightning Fast**
   - Icon: Zap ⚡
   - Warna: Purple

##### **C. Environment Toggle**

- **Test Mode** 🧪 (FlaskConical icon)
- **Production Mode** 🚀 (Rocket icon)
- Badge dengan pulse animation

##### **D. Form Section (2 Kolom)**

1. **Kolom Kiri (2/3)**: SimulatorForm
   - Form input untuk data produk
2. **Kolom Kanan (1/3)**: Live Brief Preview
   - Preview real-time dari data yang diinput
   - Sticky position saat scroll

##### **E. Footer Section**

- **CTA Section**:
  - Judul: "Ready to Transform Your Product Development?"
  - Subtitle: "Join leading Indonesian beauty brands using LunarAI Beauty"
  - **2 Buttons**:
    1. WhatsApp Us (MessageCircle icon)
    2. Schedule Meeting (Mail icon)
- **Copyright**: © 2024 LunarAI Beauty | Powered by Amaizing

---

## 📊 Result Page - 12 Sections

### **2. Result Page (`/result/[id]`)**

**File**: `src/app/result/[id]/page.tsx`

#### **Header Section**

- **Back Button**: Kembali ke homepage
- **Product Name**: Nama produk dari section pertama
- **Submission ID**: 8 karakter pertama dari ID
- **Action Buttons**:
  - Connection Status Badge (connected/connecting/disconnected)
  - Export JSON Button
  - Export PDF Button (disabled until complete)

#### **Progress Section**

- **Progress Bar**: Menampilkan progress real-time
  - Completed sections
  - Total sections (12)
  - Failed sections
  - Percentage

#### **Completion Banner**

- Muncul saat semua section selesai
- Background hijau dengan checkmark
- Text: "Report generation complete! X of 12 sections generated."

---

## 🎨 12 Section Types

Berdasarkan `SectionCard.tsx` dan `ProductReport.tsx`, berikut adalah **12 section** yang dihasilkan:

### **Section 1: Product Header** 📋

**Type**: `productHeader`  
**Order**: 1

**Data yang ditampilkan**:

- **Product Name** (H2, bold, besar)
- **Tagline** (italic, subtitle)
- **3 Grid Info**:
  1. Category
  2. Subcategory
  3. Market Segment

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Product Header         Section 1  │
├─────────────────────────────────────┤
│ [Product Name - Bold 2xl]           │
│ [Tagline - Italic lg]               │
│                                     │
│ Category    Subcategory   Market    │
│ Skincare    Serum        Premium    │
└─────────────────────────────────────┘
```

---

### **Section 2: Product Description** 📝

**Type**: `productDescription`  
**Order**: 2

**Data yang ditampilkan**:

- **Description** (paragraf lengkap)
- **Key Benefits** (list dengan checkmark icon)
- **How to Use** (instruksi penggunaan)

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Product Description    Section 2  │
├─────────────────────────────────────┤
│ Description                         │
│ [Paragraf deskripsi produk...]      │
│                                     │
│ Key Benefits                        │
│ ✓ Benefit 1                         │
│ ✓ Benefit 2                         │
│ ✓ Benefit 3                         │
│                                     │
│ How to Use                          │
│ [Instruksi penggunaan...]           │
└─────────────────────────────────────┘
```

---

### **Section 3: Alternative Names** 🏷️

**Type**: `alternativeNames`  
**Order**: 3

**Data yang ditampilkan**:

- **List of Alternative Product Names**
- Ditampilkan sebagai pills/badges

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Alternative Product Names  Sec 3  │
├─────────────────────────────────────┤
│ [Name 1] [Name 2] [Name 3]          │
│ [Name 4] [Name 5]                   │
└─────────────────────────────────────┘
```

---

### **Section 4: Ingredients** 🧪

**Type**: `ingredients`  
**Order**: 4

**Data yang ditampilkan**:

- **Total Ingredients Count**
- **Ingredient List** (top 5 ditampilkan):
  - Ingredient Name
  - INCI Name
  - Percentage
  - Purpose (di full report)
- **Formulation Analysis** (overall assessment)

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Ingredients Analysis    Section 4 │
├─────────────────────────────────────┤
│ Ingredient List (25)                │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Water (Aqua)          45.0% │    │
│ │ INCI: Aqua                  │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Glycerin              10.0% │    │
│ │ INCI: Glycerin              │    │
│ └─────────────────────────────┘    │
│ + 20 more ingredients               │
│                                     │
│ Formulation Analysis                │
│ [Overall assessment text...]        │
└─────────────────────────────────────┘
```

---

### **Section 5: Market Analysis** 📈

**Type**: `marketAnalysis`  
**Order**: 5

**Data yang ditampilkan**:

- **Target Market** (deskripsi target pasar)
- **Market Size** (ukuran pasar)
- **Growth Potential** (potensi pertumbuhan)

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Market Analysis         Section 5 │
├─────────────────────────────────────┤
│ Target Market                       │
│ [Deskripsi target market...]        │
│                                     │
│ Market Size                         │
│ [Ukuran pasar...]                   │
│                                     │
│ Growth Potential                    │
│ [Potensi pertumbuhan...]            │
└─────────────────────────────────────┘
```

---

### **Section 6: Competitor Analysis** 🎯

**Type**: `competitorAnalysis`  
**Order**: 6

**Data yang ditampilkan**:

- Analisis kompetitor
- Positioning produk vs kompetitor
- Unique selling points

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Competitor Analysis     Section 6 │
├─────────────────────────────────────┤
│ [Analisis kompetitor dalam format  │
│  JSON atau structured data...]      │
└─────────────────────────────────────┘
```

---

### **Section 7: Copywriting** ✍️

**Type**: `copywriting`  
**Order**: 7

**Data yang ditampilkan**:

- **Headline** (judul marketing, italic, besar)
- **Body Copy** (copy marketing lengkap)
- **CTA** (Call to Action, bold)

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Marketing Copy          Section 7 │
├─────────────────────────────────────┤
│ Headline                            │
│ [Headline marketing - italic lg]    │
│                                     │
│ Body Copy                           │
│ [Copy marketing lengkap...]         │
│                                     │
│ Call to Action                      │
│ [CTA text - bold]                   │
└─────────────────────────────────────┘
```

---

### **Section 8: Pricing** 💰

**Type**: `pricing`  
**Order**: 8

**Data yang ditampilkan**:

- **COGS per Unit** (Cost of Goods Sold)
- **Retail Price**
- **Wholesale Price** (di full report)

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Pricing Strategy        Section 8 │
├─────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐  │
│ │ COGS per Unit│ │ Retail Price │  │
│ │ Rp 25,000    │ │ Rp 150,000   │  │
│ └──────────────┘ └──────────────┘  │
└─────────────────────────────────────┘
```

---

### **Section 9: Compliance** ✅

**Type**: `compliance` / `regulatory`  
**Order**: 9

**Data yang ditampilkan**:

- **Regulatory Checklist**:
  - Requirement name
  - Status (compliant ✓ / needs attention !)
  - Notes

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Regulatory Compliance   Section 9 │
├─────────────────────────────────────┤
│ ✓ BPOM Registration               │
│   [Notes...]                        │
│                                     │
│ ! Halal Certification              │
│   [Notes...]                        │
│                                     │
│ ✓ Safety Testing                   │
│   [Notes...]                        │
└─────────────────────────────────────┘
```

---

### **Section 10: Production Timeline** ⏱️

**Type**: `productionTimeline`  
**Order**: 10

**Data yang ditampilkan**:

- **Production Phases**:
  - Phase Name
  - Duration
  - Description

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Production Timeline    Section 10 │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ R&D Phase          2-3 weeks    │ │
│ │ [Description...]                │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Production         4-6 weeks    │ │
│ │ [Description...]                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### **Section 11: Sustainability** 🌱

**Type**: `sustainability`  
**Order**: 11

**Data yang ditampilkan**:

- **Overall Score** (/100) dengan progress bar
- **Recommendations** (list)

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Sustainability Assessment Sec 11  │
├─────────────────────────────────────┤
│ Overall Score              75/100   │
│ ████████████████░░░░░░░░░░          │
│                                     │
│ Recommendations                     │
│ • Use recyclable packaging          │
│ • Source sustainable ingredients    │
│ • Reduce carbon footprint           │
└─────────────────────────────────────┘
```

---

### **Section 12: Next Steps** 🚀

**Type**: `nextSteps`  
**Order**: 12

**Data yang ditampilkan**:

- **Action Items** (numbered list):
  - Title
  - Description

**Contoh Render**:

```
┌─────────────────────────────────────┐
│ ✓ Next Steps & Recommendations Sec 12│
├─────────────────────────────────────┤
│ ① Finalize Formula                  │
│   [Description...]                  │
│                                     │
│ ② Register with BPOM                │
│   [Description...]                  │
│                                     │
│ ③ Setup Production                  │
│   [Description...]                  │
└─────────────────────────────────────┘
```

---

## 🔄 Real-time Streaming Flow

### **Workflow**:

```
1. User Submit Form
   ↓
2. Data dikirim ke n8n workflow
   ↓
3. n8n memproses 12 section secara parallel
   ↓
4. Setiap section selesai → POST ke /api/sync/section
   ↓
5. API menyimpan ke database & broadcast via SSE
   ↓
6. Frontend menerima update via EventSource
   ↓
7. SectionCard muncul satu per satu (animated)
   ↓
8. Progress bar update real-time
   ↓
9. Completion banner muncul saat semua selesai
```

### **SSE Events**:

- `connection_established`: Koneksi SSE berhasil
- `section_complete`: Section selesai diproses
- `section_error`: Section gagal diproses
- `workflow_complete`: Semua section selesai
- `heartbeat`: Keep-alive ping
- `timeout`: Koneksi timeout

---

## 🎨 UI Components

### **Component Hierarchy**:

```
ResultPage
├── Header
│   ├── Back Button
│   ├── Product Info
│   └── Action Buttons
├── Progress Bar (conditional)
├── Completion Banner (conditional)
└── Sections Container
    └── SectionCard (x12)
        ├── Header
        │   ├── Status Icon
        │   ├── Title
        │   └── Order Badge
        ├── Content (section-specific)
        └── Footer (metadata)
```

### **Status States**:

- **Loading**: Loader2 icon + "Processing..." text
- **Completed**: CheckCircle icon + section content
- **Error**: AlertCircle icon + error message

### **Animations**:

- **Initial**: opacity 0 → 1, y: 20 → 0, scale: 0.95 → 1
- **Duration**: 0.5s dengan easing [0.4, 0, 0.2, 1]
- **Delay**: 0.1s per section
- **Hover**: scale 1.05, shadow-md

---

## 📊 Database Schema

### **Tables**:

1. **submissions**: Data submission dari user
2. **reportSections**: Data tiap section
3. **sectionProgress**: Progress tracking

### **reportSections Schema**:

```typescript
{
  id: uuid (PK)
  submissionId: uuid (FK)
  sectionType: string (unique per submission)
  sectionOrder: number
  sectionData: jsonb
  metadata: jsonb {
    ai_model: string
    generated_at: timestamp
    mcp_sources: array
  }
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## 🎯 Key Features

### **1. Real-time Updates**

- Server-Sent Events (SSE)
- Auto-reconnect on disconnect
- Heartbeat untuk keep-alive

### **2. Progressive Loading**

- Sections muncul satu per satu
- Progress bar real-time
- Smooth animations

### **3. Export Options**

- **Export JSON**: Download semua data
- **Export PDF**: Generate PDF report (coming soon)

### **4. Responsive Design**

- Mobile-friendly
- Grid layout yang adaptive
- Sticky header & sidebar

### **5. Error Handling**

- Section-level error handling
- Connection status indicator
- Auto-retry mechanism

---

## 🔧 Configuration

### **Environment Variables**:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=http://localhost:3004
N8N_WEBHOOK_URL=...
```

### **Section Configuration**:

Total sections: **12**  
Estimated time: **5-10 minutes**  
Parallel processing: **Yes**

---

## 📝 Notes

### **Section Titles Mapping**:

```typescript
const titles = {
  productHeader: 'Product Header',
  productDescription: 'Product Description',
  alternativeNames: 'Alternative Product Names',
  ingredients: 'Ingredients Analysis',
  marketAnalysis: 'Market Analysis',
  competitorAnalysis: 'Competitor Analysis',
  copywriting: 'Marketing Copy',
  pricing: 'Pricing Strategy',
  compliance: 'Regulatory Compliance',
  productionTimeline: 'Production Timeline',
  sustainability: 'Sustainability Assessment',
  nextSteps: 'Next Steps & Recommendations',
}
```

### **Color Scheme**:

- **Primary Blue**: #3B82F6
- **Cyan**: #06B6D4
- **Purple**: #A855F7
- **Green**: #10B981 (success)
- **Red**: #EF4444 (error)
- **Gray**: #6B7280 (text)

---

## 🚀 Usage

### **Development**:

```bash
npm run dev          # Start dev server on port 3004
npm run ngrok        # Expose local server via ngrok
```

### **Production**:

```bash
npm run build        # Build for production
npm run start        # Start production server
```

### **Database**:

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

---

## 📚 Related Files

### **Core Files**:

- `src/app/page.tsx` - Homepage
- `src/app/result/[id]/page.tsx` - Result page
- `src/components/SectionCard.tsx` - Section renderer
- `src/components/report/ProductReport.tsx` - Full report
- `src/app/api/sync/section/route.ts` - Section sync API

### **Supporting Files**:

- `src/lib/db.ts` - Database schema
- `src/lib/realtime.ts` - SSE broadcasting
- `src/lib/persistence.ts` - Data persistence
- `src/hooks/useWorkflowStatus.ts` - Status hook

---

## 🎉 Summary

Website **LunarAI Beauty** terdiri dari:

- **1 Homepage** dengan form input
- **1 Result Page** dengan 12 sections yang di-stream real-time
- **Real-time updates** via SSE
- **Progressive loading** dengan animations
- **Export capabilities** (JSON & PDF)
- **Responsive design** dengan modern UI

Setiap section memiliki **renderer khusus** dan **metadata tracking** untuk memberikan pengalaman user yang optimal.
