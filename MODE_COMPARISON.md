# 🔄 Mode Comparison: Test vs Production

## 📊 Quick Comparison Table

| Feature                  | 🧪 Test Mode                 | 🚀 Production Mode       |
| ------------------------ | ---------------------------- | ------------------------ |
| **Environment Variable** | `N8N_TEST_WEBHOOK`           | `N8N_PRODUCTION_WEBHOOK` |
| **Webhook URL**          | `/webhook-test/lbf_skincare` | `/webhook/lbf_skincare`  |
| **Database**             | Test DB (optional)           | Production DB            |
| **Data Persistence**     | Temporary                    | Permanent                |
| **AI Processing**        | Test/Draft                   | Final/Polished           |
| **Report Quality**       | Draft                        | Production-ready         |
| **Email Notifications**  | Internal only                | Client-facing            |
| **Cost Impact**          | Minimal/Free                 | Billable                 |
| **Analytics Tracking**   | Not tracked                  | Fully tracked            |
| **Audit Logging**        | Optional                     | Required                 |
| **SLA**                  | Best effort                  | Guaranteed               |
| **Monitoring**           | Basic                        | Full monitoring          |
| **Alerts**               | None                         | Critical alerts          |

---

## 🎯 Use Cases

### 🧪 Test Mode - Kapan Digunakan?

#### ✅ Development & Testing

```
Scenario: Developer sedang develop fitur baru
Action: Pilih Test Mode
Result: Data masuk ke test webhook, tidak affect production
```

#### ✅ Quality Assurance

```
Scenario: QA team testing before release
Action: Pilih Test Mode
Result: Validate workflow tanpa risk ke production data
```

#### ✅ Training & Demo

```
Scenario: Training team baru atau demo ke client
Action: Pilih Test Mode
Result: Show functionality tanpa create real records
```

#### ✅ Debugging Issues

```
Scenario: Ada bug di production, perlu investigate
Action: Pilih Test Mode
Result: Reproduce issue safely, check logs
```

#### ✅ Load Testing

```
Scenario: Test system capacity
Action: Pilih Test Mode
Result: Send banyak requests tanpa pollute production
```

---

### 🚀 Production Mode - Kapan Digunakan?

#### ✅ Real Client Submissions

```
Scenario: Client submit form untuk project real
Action: Pilih Production Mode
Result: Full processing, final report, billing
```

#### ✅ Live Operations

```
Scenario: Day-to-day business operations
Action: Pilih Production Mode
Result: All features active, full tracking
```

#### ✅ Billing & Invoicing

```
Scenario: Need to track usage for billing
Action: Pilih Production Mode
Result: Analytics tracked, invoice generated
```

#### ✅ Client Deliverables

```
Scenario: Generate final report untuk client
Action: Pilih Production Mode
Result: Production-quality output, notifications sent
```

---

## 🔍 Technical Differences

### Data Flow Comparison

#### Test Mode Flow:

```
User Input
    ↓
Form Validation
    ↓
Build Payload (targetEnvironment: "test")
    ↓
POST /api/submit
    ↓
Check: environment === "test"
    ↓
Select: N8N_TEST_WEBHOOK
    ↓
Save to Test Database (optional)
    ↓
Dispatch to Test Webhook
    ↓
n8n Test Workflow
    ↓
Draft Processing
    ↓
Internal Notifications Only
    ↓
Test Report Generated
```

#### Production Mode Flow:

```
User Input
    ↓
Form Validation
    ↓
Build Payload (targetEnvironment: "production")
    ↓
POST /api/submit
    ↓
Check: environment === "production"
    ↓
Select: N8N_PRODUCTION_WEBHOOK
    ↓
Save to Production Database (required)
    ↓
Create Audit Log
    ↓
Dispatch to Production Webhook
    ↓
n8n Production Workflow
    ↓
Full AI Processing
    ↓
Generate Final Report
    ↓
Client Notifications
    ↓
Update Analytics
    ↓
Billing Record Created
```

---

## 🔐 Security Differences

### Test Mode Security:

- ✅ Separate webhook URL
- ✅ Can use same or different secret
- ✅ Less strict validation (for testing)
- ✅ Logs can be verbose
- ⚠️ Data retention: Short-term
- ⚠️ Access: Development team only

### Production Mode Security:

- ✅ Dedicated webhook URL
- ✅ Strong secret (min 32 chars)
- ✅ Strict validation required
- ✅ Logs sanitized (no sensitive data)
- ✅ Data retention: Long-term/compliance
- ✅ Access: Restricted, audited
- ✅ Rate limiting enforced
- ✅ DDoS protection
- ✅ Monitoring & alerts

---

## 💰 Cost Implications

### Test Mode Costs:

```
AI API Calls:        Free tier / Minimal
Database Storage:    Temporary / Minimal
Email Sending:       Internal only / Free
Report Generation:   Draft quality / Cheap
Total:              ~$0.01 per submission
```

### Production Mode Costs:

```
AI API Calls:        Full quality / Premium
Database Storage:    Permanent / Standard
Email Sending:       Client-facing / Paid
Report Generation:   Production quality / Premium
Analytics:           Full tracking / Standard
Total:              ~$0.50-$2.00 per submission
```

---

## 📈 Monitoring & Logging

### Test Mode Monitoring:

```javascript
// Minimal logging
console.log('Test submission received:', submissionId)
console.log('Webhook dispatched to test endpoint')

// No alerts
// No metrics tracking
// Basic error logging only
```

### Production Mode Monitoring:

```javascript
// Comprehensive logging
logger.info('Production submission', {
  submissionId,
  brandName,
  environment: 'production',
  timestamp: new Date(),
  userAgent,
  ipAddress,
})

// Full metrics
metrics.increment('submissions.production')
metrics.timing('webhook.dispatch.duration', duration)

// Alerts configured
if (webhookFailed) {
  alerting.critical('Production webhook failed', {
    submissionId,
    error,
  })
}

// Audit trail
auditLog.create({
  action: 'submission_created',
  actor: userId,
  resource: submissionId,
  metadata: { environment: 'production' },
})
```

---

## 🎨 UI Indicators

### Visual Differences in App:

#### Test Mode UI:

```
┌─────────────────────────────────────┐
│  🧪 TEST MODE                       │
│  ┌─────────────────────────────┐   │
│  │ Environment: Test           │   │
│  │ Badge: [🔵 Test]           │   │
│  │ Color: Cyan                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚠️  This is a test submission     │
│  Data will not affect production   │
└─────────────────────────────────────┘
```

#### Production Mode UI:

```
┌─────────────────────────────────────┐
│  🚀 PRODUCTION MODE                 │
│  ┌─────────────────────────────┐   │
│  │ Environment: Production     │   │
│  │ Badge: [🔴 Production]     │   │
│  │ Color: Blue                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ✅ Real submission                │
│  Will be processed and billed      │
└─────────────────────────────────────┘
```

---

## 🔄 Switching Between Modes

### How to Switch:

1. **In UI**: Click toggle button (Flask icon for Test, Rocket for Production)
2. **Persisted**: Mode saved in localStorage
3. **Default**: Test mode (safer default)

### Code Implementation:

```typescript
// In SimulatorContext.tsx
const [environment, setEnvironment] = useState<'test' | 'production'>('test')

// In SimulatorForm.tsx
const onSubmit = async (values: FormValues) => {
  const payload = buildSubmissionPayload({
    ...values,
    targetEnvironment: environment, // ← Mode ditentukan di sini
  })

  // Rest of submission logic...
}

// In API route.ts
const webhookUrl =
  payload.targetEnvironment === 'test'
    ? process.env.N8N_TEST_WEBHOOK // ← Test webhook
    : process.env.N8N_PRODUCTION_WEBHOOK // ← Production webhook
```

---

## ⚠️ Important Warnings

### ⚠️ Test Mode Warnings:

1. **Data Not Permanent**: Test data may be deleted regularly
2. **No Billing**: Test submissions not counted for billing
3. **Draft Quality**: AI responses may be lower quality
4. **No Client Notifications**: Emails only to internal team
5. **Limited Support**: Best-effort support only

### 🚨 Production Mode Warnings:

1. **Permanent Records**: Cannot be easily deleted
2. **Billing Impact**: Each submission incurs costs
3. **Client Notifications**: Emails sent to clients automatically
4. **SLA Applies**: Must meet performance guarantees
5. **Audit Trail**: All actions logged permanently

---

## 🧪 Testing Checklist

### Before Using Test Mode:

- [ ] Verify `N8N_TEST_WEBHOOK` is set
- [ ] Check test webhook is active in n8n
- [ ] Confirm test database is accessible (if using)
- [ ] Review test workflow configuration
- [ ] Ensure test mode badge shows correctly

### Before Using Production Mode:

- [ ] Verify `N8N_PRODUCTION_WEBHOOK` is set
- [ ] Check production webhook is active
- [ ] Confirm production database is accessible
- [ ] Test end-to-end flow in test mode first
- [ ] Review production workflow configuration
- [ ] Ensure monitoring/alerts are configured
- [ ] Verify email templates are correct
- [ ] Check billing integration works
- [ ] Confirm backup systems are running
- [ ] Review security settings

---

## 📊 Analytics & Reporting

### Test Mode Analytics:

```sql
-- Simple counting only
SELECT COUNT(*)
FROM submissions
WHERE target_environment = 'test'
AND created_at > NOW() - INTERVAL '7 days';

-- No detailed analytics
-- No business intelligence
-- No client reporting
```

### Production Mode Analytics:

```sql
-- Comprehensive analytics
SELECT
  DATE(submitted_at) as date,
  COUNT(*) as total_submissions,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as errors,
  AVG(processing_duration) as avg_duration,
  SUM(cost) as total_cost
FROM submissions
WHERE target_environment = 'production'
GROUP BY DATE(submitted_at)
ORDER BY date DESC;

-- Business intelligence
-- Client dashboards
-- Revenue tracking
-- Performance metrics
```

---

## 🎓 Best Practices

### Test Mode Best Practices:

1. **Always test first** before production
2. **Use realistic data** for accurate testing
3. **Test error scenarios** (network issues, timeouts)
4. **Validate payload structure** matches production
5. **Check logs** for any warnings
6. **Test all features** end-to-end
7. **Document test results** for reference
8. **Clean up test data** regularly

### Production Mode Best Practices:

1. **Never test in production** - use test mode
2. **Monitor continuously** for issues
3. **Set up alerts** for critical failures
4. **Review logs regularly** for anomalies
5. **Backup data** before major changes
6. **Have rollback plan** ready
7. **Document incidents** and resolutions
8. **Regular security audits**
9. **Performance optimization** ongoing
10. **Client communication** for any issues

---

## 🔄 Migration Path

### From Test to Production:

```bash
# 1. Verify test mode works perfectly
npm run test:e2e

# 2. Review test results
# Check logs, validate data, confirm workflow

# 3. Update environment variables
N8N_PRODUCTION_WEBHOOK=https://n8n.com/webhook/lbf_skincare

# 4. Deploy to production
git push origin main

# 5. Switch to production mode in UI
# Click rocket icon 🚀

# 6. Submit test in production
# Use real but non-critical data first

# 7. Monitor closely
# Watch logs, check n8n executions

# 8. Validate results
# Check database, email notifications, reports

# 9. Go live
# Announce to team, start accepting real submissions
```

---

## 📞 Support & Escalation

### Test Mode Issues:

- **Severity**: Low
- **Response Time**: Best effort
- **Contact**: Development team
- **Escalation**: Not required

### Production Mode Issues:

- **Severity**: High/Critical
- **Response Time**: Immediate
- **Contact**: On-call engineer
- **Escalation**: Automatic for critical issues

---

## 📚 Additional Resources

- **Full Integration Guide**: `N8N_INTEGRATION_GUIDE.md`
- **Quick Start**: `N8N_SETUP_QUICK_START.md`
- **Workflow Example**: `n8n-workflow-example.json`
- **Deployment Guide**: `DEPLOYMENT.md`
- **API Documentation**: `/api/submit/route.ts`

---

**Summary**

```
┌─────────────────────────────────────────────────────────┐
│  QUICK DECISION GUIDE                                   │
├─────────────────────────────────────────────────────────┤
│  Use 🧪 TEST MODE when:                                │
│  • Developing new features                              │
│  • Testing changes                                      │
│  • Training team                                        │
│  • Debugging issues                                     │
│  • Demonstrating to stakeholders                        │
│                                                         │
│  Use 🚀 PRODUCTION MODE when:                          │
│  • Processing real client submissions                   │
│  • Generating final deliverables                        │
│  • Billing for services                                 │
│  • Operating live business                              │
│  • Sending client notifications                         │
└─────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2024-01-20
