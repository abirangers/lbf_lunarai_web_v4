# ⚡ Quick Start: Setup n8n Integration

## 🎯 Ringkasan Singkat

Ketika klik **"Generate Analysis"**:

```
Form → API → Database → n8n Webhook → AI Processing → Report
```

**2 Mode:**

- 🧪 **Test**: Development/testing (webhook test)
- 🚀 **Production**: Real operations (webhook production)

---

## 🚀 Setup dalam 5 Menit

### Step 1: Setup Environment Variables

Buat file `.env.local`:

```bash
# Minimal (Mock Mode - No n8n)
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FORM_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_LANGUAGE=id

# Full Mode (With n8n)
DATABASE_URL=postgresql://user:pass@host:5432/db
N8N_TEST_WEBHOOK=https://n8n.com/webhook-test/lbf_skincare
N8N_PRODUCTION_WEBHOOK=https://n8n.com/webhook/lbf_skincare
N8N_WEBHOOK_SECRET=your_secret_key
```

### Step 2: Setup n8n Workflow

1. **Buat workflow baru** di n8n
2. **Tambah Webhook node**:
   - Method: `POST`
   - Path: `/webhook-test/lbf_skincare` (untuk test)
   - Auth: Header Auth
   - Header: `X-Webhook-Secret`
   - Value: `your_secret_key`
3. **Copy webhook URL**
4. **Paste ke `.env.local`**

### Step 3: Test Integration

```bash
# Run app
npm run dev

# Buka http://localhost:3004
# Isi form
# Pilih mode "Test" 🧪
# Klik "Generate Analysis"
# Check n8n execution
```

---

## 🔄 Alur Lengkap (Simplified)

```
┌──────────────┐
│   USER       │
│  Isi Form    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Pilih Mode:                 │
│  🧪 Test  atau  🚀 Production│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Klik "Generate Analysis"    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  SimulatorForm.tsx           │
│  - Validate form             │
│  - Build payload             │
│  - POST to /api/submit       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  /api/submit/route.ts        │
│  - Validate payload          │
│  - Save to database          │
│  - Determine webhook URL     │
└──────┬───────────────────────┘
       │
       ├─── Test Mode ───────────┐
       │                         │
       │  N8N_TEST_WEBHOOK       │
       │  (Development)          │
       │                         │
       └─── Production Mode ─────┤
                                 │
          N8N_PRODUCTION_WEBHOOK │
          (Live Operations)      │
                                 │
       ┌─────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  n8n.ts                      │
│  - dispatchToWebhook()       │
│  - Add headers + secret      │
│  - Retry on failure (3x)     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  n8n Webhook                 │
│  - Receive payload           │
│  - Validate secret           │
│  - Start workflow            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  n8n Workflow Processing     │
│  - AI Analysis               │
│  - Generate Report           │
│  - Send Notifications        │
│  - Update Database           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Response to User            │
│  - Redirect to /result/[id]  │
│  - Show success message      │
└──────────────────────────────┘
```

---

## 📊 Perbedaan Mode Detail

| Aspek             | 🧪 Test Mode                    | 🚀 Production Mode            |
| ----------------- | ------------------------------- | ----------------------------- |
| **Webhook URL**   | `N8N_TEST_WEBHOOK`              | `N8N_PRODUCTION_WEBHOOK`      |
| **Database**      | Test database (optional)        | Production database           |
| **Purpose**       | Development, testing, debugging | Real client submissions       |
| **Data Impact**   | No impact on production         | Affects live data             |
| **Notifications** | Internal team only              | Sent to clients               |
| **Reports**       | Draft/test reports              | Final client reports          |
| **Analytics**     | Not tracked                     | Tracked in production         |
| **Cost**          | No cost (testing)               | May incur costs (AI, storage) |

---

## 🔍 Cara Memilih Mode

### Gunakan **Test Mode** 🧪 untuk:

- ✅ Testing workflow baru
- ✅ Debugging issues
- ✅ Training team
- ✅ Demo to stakeholders
- ✅ Validating new features
- ✅ Load testing

### Gunakan **Production Mode** 🚀 untuk:

- ✅ Real client submissions
- ✅ Live operations
- ✅ Generating final reports
- ✅ Billing/invoicing
- ✅ Analytics tracking
- ✅ Client notifications

---

## 🎨 UI Mode Selector

Di aplikasi, user bisa toggle mode dengan UI ini:

```
┌─────────────────────────────────────┐
│  Environment Mode                   │
│  ┌───────┐  ┌───────┐              │
│  │ 🧪    │  │ 🚀    │              │
│  │ Test  │  │ Prod  │              │
│  └───────┘  └───────┘              │
│                                     │
│  Badge: [🔵 Production]            │
└─────────────────────────────────────┘
```

**Kode di `src/app/page.tsx`:**

```tsx
<ToggleGroup
  type="single"
  value={environment}
  onValueChange={(value: 'test' | 'production') => value && setEnvironment(value)}
>
  <ToggleGroupItem value="test">
    <FlaskConical className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="production">
    <Rocket className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>
```

---

## 🔐 Security Checklist

- [ ] Set `N8N_WEBHOOK_SECRET` (min 32 chars)
- [ ] Never commit secrets to Git
- [ ] Use different secrets for test/prod
- [ ] Enable HTTPS for webhooks
- [ ] Validate webhook secret in n8n
- [ ] Rate limit webhook endpoints
- [ ] Log all webhook calls
- [ ] Monitor for suspicious activity
- [ ] Rotate secrets regularly
- [ ] Use environment variables only

---

## 🧪 Testing Checklist

### Test Mode Testing:

- [ ] Form submission works
- [ ] Webhook receives data
- [ ] n8n workflow executes
- [ ] Data structure correct
- [ ] Error handling works
- [ ] Retry mechanism works
- [ ] Logs are generated
- [ ] No impact on production

### Production Mode Testing:

- [ ] All test mode checks pass
- [ ] Production webhook configured
- [ ] Database writes work
- [ ] Notifications sent correctly
- [ ] Reports generated properly
- [ ] Analytics tracked
- [ ] Audit logs created
- [ ] End-to-end flow works

---

## 🐛 Quick Troubleshooting

### Problem: "Webhook dispatch failed"

```bash
# Check webhook URL
echo $N8N_TEST_WEBHOOK

# Test manually
curl -X POST $N8N_TEST_WEBHOOK \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $N8N_WEBHOOK_SECRET" \
  -d '{"test": "data"}'
```

### Problem: "Invalid webhook secret"

```bash
# Check secret matches
# In .env.local
N8N_WEBHOOK_SECRET=abc123

# In n8n webhook settings
Header Name: X-Webhook-Secret
Header Value: abc123  # Must match exactly
```

### Problem: "Mode tidak berubah"

```tsx
// Check state management di SimulatorContext
const { environment, setEnvironment } = useSimulator()

// Check localStorage
localStorage.getItem('simulator-storage')
```

---

## 📦 Payload Example

Ini yang dikirim ke n8n:

```json
{
  "submissionId": "sub_abc123",
  "submittedAt": "2024-01-20T10:30:00Z",
  "targetEnvironment": "test",
  "brand": {
    "name": "Glow Beauty",
    "voice": "professional"
  },
  "productBlueprint": {
    "functions": ["brightening"],
    "formType": "Serum"
  },
  "ingredients": [
    {
      "name": "Niacinamide",
      "percentage": 10
    }
  ]
}
```

---

## 📚 Key Files

```
src/
├── app/
│   ├── page.tsx                    # Mode selector UI
│   └── api/
│       └── submit/
│           └── route.ts            # Main API endpoint
├── components/
│   └── form/
│       └── SimulatorForm.tsx       # Form & submit handler
├── lib/
│   ├── n8n.ts                      # n8n integration
│   ├── payloadBuilder.ts           # Build payload
│   └── persistence.ts              # Database ops
└── context/
    └── SimulatorContext.tsx        # State management
```

---

## 🎓 Learning Resources

1. **n8n Documentation**: https://docs.n8n.io/
2. **Webhook Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
3. **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
4. **Environment Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

## 💡 Pro Tips

1. **Always test in Test Mode first** before production
2. **Use descriptive submission IDs** for easy tracking
3. **Log everything** for debugging
4. **Monitor n8n executions** regularly
5. **Set up alerts** for webhook failures
6. **Document your n8n workflows** with comments
7. **Use version control** for n8n workflows (export JSON)
8. **Keep secrets in environment variables** only
9. **Test error scenarios** (network issues, timeouts)
10. **Have a rollback plan** for production issues

---

## 🆘 Need Help?

1. Check logs: `console.log` in browser & server
2. Check n8n executions: n8n UI → Executions
3. Check database: Query `submissions` and `workflow_runs` tables
4. Test webhook manually: Use `curl` or Postman
5. Review this guide: `N8N_INTEGRATION_GUIDE.md`
6. Contact dev team: [your-contact-info]

---

**Quick Reference Card**

```
┌─────────────────────────────────────────────────┐
│  QUICK REFERENCE                                │
├─────────────────────────────────────────────────┤
│  Button: "Generate Analysis"                    │
│  File: SimulatorForm.tsx                        │
│  API: /api/submit                               │
│  Function: dispatchToWebhook()                  │
│  Test URL: N8N_TEST_WEBHOOK                     │
│  Prod URL: N8N_PRODUCTION_WEBHOOK               │
│  Secret: N8N_WEBHOOK_SECRET                     │
│  Retry: 3 attempts                              │
│  Timeout: Exponential backoff                   │
└─────────────────────────────────────────────────┘
```

---

**Last Updated**: 2024-01-20
