# 🔗 Panduan Integrasi n8n - LunarAI Beauty

## 📋 Ringkasan

Ketika Anda klik tombol **"Generate Analysis"** di form, aplikasi akan:

1. Mengumpulkan semua data form
2. Mengirim data ke API endpoint `/api/submit`
3. API akan meneruskan data ke **n8n webhook** sesuai mode yang dipilih
4. n8n akan memproses data dan menghasilkan analisis

---

## 🎯 Perbedaan Mode: Test vs Production

### 🧪 **Mode TEST**

- **Tujuan**: Untuk testing dan development
- **Webhook**: `N8N_TEST_WEBHOOK`
- **Use Case**:
  - Testing workflow baru
  - Development dan debugging
  - Validasi data sebelum production
  - Tidak mempengaruhi data production
- **Icon**: 🧪 Flask (Lab)
- **Badge Color**: Cyan

### 🚀 **Mode PRODUCTION**

- **Tujuan**: Untuk operasional real/live
- **Webhook**: `N8N_PRODUCTION_WEBHOOK`
- **Use Case**:
  - Submission dari client real
  - Data akan masuk ke database production
  - Menghasilkan report final untuk client
  - Tracking analytics real
- **Icon**: 🚀 Rocket
- **Badge Color**: Blue

---

## 🔄 Alur Integrasi (Flow Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. USER mengisi form dan pilih mode (Test/Production)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Klik "Generate Analysis"                                    │
│     - Form validation                                           │
│     - Build payload dengan buildSubmissionPayload()            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. POST ke /api/submit                                         │
│     File: src/app/api/submit/route.ts                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. API menentukan webhook URL berdasarkan mode:                │
│     - Test mode → N8N_TEST_WEBHOOK                             │
│     - Production mode → N8N_PRODUCTION_WEBHOOK                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Simpan ke Database (jika DATABASE_URL ada)                  │
│     - submissions table                                         │
│     - submission_payloads table                                 │
│     - workflow_runs table                                       │
│     - audit_logs table                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Kirim data ke n8n webhook                                   │
│     Function: dispatchToWebhook()                               │
│     File: src/lib/n8n.ts                                        │
│     - Headers: Content-Type, X-Webhook-Secret                  │
│     - Body: Full submission payload (JSON)                      │
│     - Retry: Max 3 attempts dengan exponential backoff         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. n8n menerima webhook dan memproses:                         │
│     - Validate data                                             │
│     - Generate AI analysis                                      │
│     - Create report/deliverables                                │
│     - Send notifications                                        │
│     - Update status ke database                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. Response ke user                                            │
│     - Success: Redirect ke /result/[submissionId]              │
│     - Error: Show toast notification                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Setup Environment Variables

### 1. **Buat file `.env.local`** di root project:

```bash
# ============================================
# REQUIRED - Application Settings
# ============================================
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FORM_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_LANGUAGE=id

# ============================================
# OPTIONAL - Database (Enable Real Backend)
# ============================================
# Tanpa ini, app jalan di MOCK MODE
DATABASE_URL=postgresql://user:password@host:5432/database

# ============================================
# OPTIONAL - n8n Webhooks
# ============================================
# Test Webhook - untuk development/testing
N8N_TEST_WEBHOOK=https://your-n8n-instance.com/webhook-test/lbf_skincare

# Production Webhook - untuk operasional real
N8N_PRODUCTION_WEBHOOK=https://your-n8n-instance.com/webhook/lbf_skincare

# Webhook Secret - untuk security
N8N_WEBHOOK_SECRET=your_secret_key_here
```

### 2. **Cara mendapatkan n8n Webhook URL:**

#### A. Setup n8n Workflow

1. **Login ke n8n** (self-hosted atau cloud)
2. **Buat workflow baru** dengan nama: `LBF Skincare Analysis`
3. **Tambah Webhook Node**:
   - Klik "+" → pilih "Webhook"
   - Set **HTTP Method**: `POST`
   - Set **Path**:
     - Test: `/webhook-test/lbf_skincare`
     - Production: `/webhook/lbf_skincare`
   - Set **Authentication**: `Header Auth`
   - Set **Header Name**: `X-Webhook-Secret`
   - Set **Header Value**: `your_secret_key_here`

4. **Copy Webhook URL** yang muncul, contoh:

   ```
   https://n8n.yourcompany.com/webhook-test/lbf_skincare
   ```

5. **Paste ke environment variable** yang sesuai

#### B. Struktur Workflow n8n (Recommended)

```
Webhook (Trigger)
    ↓
Validate Data
    ↓
Split into Branches:
    ├─→ Generate Brand Analysis (AI)
    ├─→ Generate Product Blueprint (AI)
    ├─→ Generate Market Analysis (AI)
    └─→ Generate Regulatory Check
    ↓
Merge Results
    ↓
Create PDF Report
    ↓
Update Database Status
    ↓
Send Email Notification
    ↓
Response to API
```

---

## 📝 Payload Structure yang Dikirim ke n8n

```typescript
{
  // Metadata
  "submissionId": "sub_1234567890",
  "submittedAt": "2024-01-20T10:30:00Z",
  "targetEnvironment": "test" | "production",

  // Brand Info
  "brand": {
    "name": "Glow Beauty",
    "voice": "professional",
    "values": "Natural, sustainable, effective"
  },

  // Product Blueprint
  "productBlueprint": {
    "functions": ["brightening", "hydrating"],
    "formType": "Serum",
    "packagingType": "dropper",
    "netto": { "value": 30, "unit": "ml" },
    "colorDescription": "Clear with slight golden tint"
  },

  // Target Market
  "targetMarket": {
    "gender": "all",
    "ageRanges": ["26-35", "36-45"],
    "geography": {
      "country": "ID",
      "region": "JK",
      "city": "JP"
    }
  },

  // Ingredients
  "ingredients": [
    {
      "name": "Niacinamide",
      "percentage": 10,
      "purpose": "Brightening and pore minimizing"
    }
  ],

  // Business Context
  "businessContext": {
    "distributionFocus": "Domestic Retail",
    "sustainabilityPriority": 75,
    "regulatoryPriority": ["BPOM", "Halal"],
    "requiresClinicalStudy": true,
    "needsHalalCertification": true
  },

  // Deliverables
  "deliverables": {
    "preferredChannels": ["Email", "WhatsApp"],
    "requestedItems": ["AI concept deck", "Regulatory checklist"]
  },

  // System Metadata
  "systemMetadata": {
    "formVersion": "1.0.0",
    "appVersion": "1.0.0",
    "language": "id",
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "123.45.67.89"
  }
}
```

---

## 🔐 Security Best Practices

### 1. **Webhook Secret**

- Gunakan secret yang strong (min 32 karakter)
- Jangan commit secret ke Git
- Rotate secret secara berkala

### 2. **Validasi di n8n**

```javascript
// Di n8n, tambah Function node untuk validasi:
const secret = $node['Webhook'].context['headers']['x-webhook-secret']
const expectedSecret = $env.WEBHOOK_SECRET

if (secret !== expectedSecret) {
  throw new Error('Unauthorized: Invalid webhook secret')
}

// Validate required fields
const required = ['submissionId', 'brand', 'productBlueprint']
for (const field of required) {
  if (!$input.item.json[field]) {
    throw new Error(`Missing required field: ${field}`)
  }
}

return $input.item
```

### 3. **Rate Limiting**

- Set rate limit di n8n webhook settings
- Recommended: 10 requests per minute per IP

---

## 🧪 Testing Integration

### 1. **Test Mode (Development)**

```bash
# 1. Set environment variables
N8N_TEST_WEBHOOK=https://your-n8n.com/webhook-test/lbf_skincare
N8N_WEBHOOK_SECRET=test_secret_123

# 2. Run app
npm run dev

# 3. Isi form dan pilih mode "Test"
# 4. Klik "Generate Analysis"
# 5. Check n8n workflow execution
```

### 2. **Production Mode (Real)**

```bash
# 1. Set production webhook
N8N_PRODUCTION_WEBHOOK=https://your-n8n.com/webhook/lbf_skincare

# 2. Deploy to production
# 3. Test dengan data real
```

### 3. **Mock Mode (No Backend)**

Jika `DATABASE_URL` dan `N8N_PRODUCTION_WEBHOOK` tidak diset:

- App tetap jalan
- Form submission berhasil
- Data hanya di-log ke console
- Tidak ada integrasi n8n
- Cocok untuk demo/preview

---

## 🐛 Troubleshooting

### Problem 1: "Webhook dispatch failed"

**Penyebab:**

- n8n webhook URL salah
- n8n instance down
- Network issue

**Solusi:**

```bash
# Test webhook manually
curl -X POST https://your-n8n.com/webhook-test/lbf_skincare \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your_secret" \
  -d '{"test": "data"}'

# Check n8n logs
# Check network connectivity
```

### Problem 2: "Invalid webhook secret"

**Penyebab:**

- Secret tidak match antara app dan n8n

**Solusi:**

1. Check `.env.local`: `N8N_WEBHOOK_SECRET`
2. Check n8n webhook settings
3. Pastikan sama persis (case-sensitive)

### Problem 3: "Webhook timeout"

**Penyebab:**

- n8n workflow terlalu lama
- Response tidak dikirim

**Solusi:**

- Set timeout di n8n webhook settings
- Optimize workflow (use async processing)
- Return response immediately, process in background

### Problem 4: "Data tidak masuk database"

**Penyebab:**

- `DATABASE_URL` tidak diset
- Database connection error

**Solusi:**

```bash
# Check environment variable
echo $DATABASE_URL

# Test database connection
# Check database logs
```

---

## 📊 Monitoring & Logging

### 1. **Application Logs**

```typescript
// Di src/app/api/submit/route.ts
console.log('📤 Dispatching to webhook:', webhookUrl)
console.log('📦 Payload:', JSON.stringify(payload, null, 2))
console.log('✅ Webhook response:', webhookResponse)
```

### 2. **n8n Execution Logs**

- Go to n8n → Executions
- Filter by workflow: "LBF Skincare Analysis"
- Check execution time, status, errors

### 3. **Database Audit Logs**

```sql
-- Check recent submissions
SELECT * FROM submissions
ORDER BY submitted_at DESC
LIMIT 10;

-- Check workflow runs
SELECT * FROM workflow_runs
WHERE status = 'error'
ORDER BY created_at DESC;

-- Check audit logs
SELECT * FROM audit_logs
WHERE action = 'submission_created'
ORDER BY created_at DESC;
```

---

## 🚀 Production Checklist

- [ ] Set semua environment variables
- [ ] Test webhook di n8n (test mode)
- [ ] Validate payload structure
- [ ] Test error handling
- [ ] Setup monitoring/alerts
- [ ] Configure rate limiting
- [ ] Backup database
- [ ] Document n8n workflow
- [ ] Test production webhook
- [ ] Setup logging/analytics
- [ ] Create runbook untuk troubleshooting

---

## 📚 File References

| File                                    | Purpose                              |
| --------------------------------------- | ------------------------------------ |
| `src/components/form/SimulatorForm.tsx` | Form component, handle submit        |
| `src/app/api/submit/route.ts`           | API endpoint, orchestrate submission |
| `src/lib/n8n.ts`                        | n8n integration, dispatch webhook    |
| `src/lib/payloadBuilder.ts`             | Build submission payload             |
| `src/lib/persistence.ts`                | Database operations                  |
| `src/types/submission.ts`               | TypeScript types/schemas             |

---

## 💡 Tips & Best Practices

1. **Selalu test di Test Mode dulu** sebelum production
2. **Monitor n8n executions** untuk detect issues early
3. **Setup alerts** untuk webhook failures
4. **Log semua submissions** untuk audit trail
5. **Backup database** secara regular
6. **Document n8n workflows** untuk maintenance
7. **Use retry mechanism** untuk handle transient errors
8. **Validate data** di both sides (app & n8n)
9. **Keep secrets secure** (never commit to Git)
10. **Test end-to-end** sebelum launch

---

## 🆘 Support

Jika ada masalah:

1. Check logs di application
2. Check n8n execution logs
3. Check database audit logs
4. Review environment variables
5. Test webhook manually dengan curl
6. Contact development team

---

**Last Updated**: 2024-01-20
**Version**: 1.0.0
