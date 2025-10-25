# 🐛 Troubleshooting: Progress Stuck at 0/12

## Problem Description

N8N workflow is executing and completing sections (visible in N8N dashboard showing section 5 completed), but the website progress bar remains stuck at "0/12 (0%)" with continuous loading.

---

## Visual Diagnosis

### **Current Flow (Broken):**

```
┌─────────────────────────────────────────────────────────────┐
│                    N8N WORKFLOW                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Section 1 completed ✅
                           │ Section 2 completed ✅
                           │ Section 3 completed ✅
                           │ Section 4 completed ✅
                           │ Section 5 completed ✅
                           ↓
              ┌────────────────────────────┐
              │  HTTP Request Node         │
              │  POST to WRONG endpoint:   │
              │  /result/{submissionId}    │ ❌
              └────────────┬───────────────┘
                           │
                           ↓
              ┌────────────────────────────┐
              │  404 Not Found             │
              │  or Wrong Route            │ ❌
              └────────────────────────────┘
                           │
                           ✗ (No data reaches backend)

┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                              │
│  /api/sync/section endpoint waiting...                     │
│  No requests received ❌                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ✗ (No SSE broadcast)

┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND                                 │
│  Progress: 0/12 (0%) ← STUCK! ❌                           │
│  SSE connected but no events received                      │
└─────────────────────────────────────────────────────────────┘
```

### **Expected Flow (Fixed):**

```
┌─────────────────────────────────────────────────────────────┐
│                    N8N WORKFLOW                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Section 1 completed ✅
                           ↓
              ┌────────────────────────────┐
              │  HTTP Request Node         │
              │  POST /api/sync/section    │ ✅
              │  Body: {                   │
              │    submissionId: "...",    │
              │    section: {              │
              │      section_type: "...",  │
              │      order: 1,             │
              │      section_data: {...}   │
              │    }                       │
              │  }                         │
              └────────────┬───────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                              │
│  POST /api/sync/section                                    │
│  ✅ Request received                                        │
│  ✅ Section saved to database                              │
│  ✅ Progress updated (1/12)                                │
│  ✅ SSE broadcast sent                                     │
└────────────┬────────────────────────────────────────────────┘
             │
             │ SSE Event: section_complete
             ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND                                 │
│  ✅ SSE event received                                      │
│  ✅ Progress updated: 1/12 (8%)                            │
│  ✅ Section card displayed                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Root Causes

### **1. Wrong Endpoint URL**

**N8N sends to:**

```
❌ https://transmeridional-volcanologic-vena.ngrok-free.dev/result/{submissionId}
```

**Should send to:**

```
✅ https://your-domain.com/api/sync/section
```

**Why it fails:**

- `/result/{id}` is a **GET endpoint** for viewing results
- `/api/sync/section` is the **POST endpoint** for receiving section data
- N8N is posting to the wrong route → 404 or wrong handler

---

### **2. Wrong Request Body Format**

**N8N sends:**

```json
{
  "section": "Product Overview",
  "data": {
    "content": "...",
    "timestamp": "...",
    "submissionId": "...",
    "status": "completed"
  }
}
```

**Backend expects:**

```json
{
  "submissionId": "129e6d26...",
  "section": {
    "section_type": "product_overview",  // ← Must be snake_case
    "order": 1,                          // ← Required
    "section_data": { ... },             // ← Not "data"
    "metadata": {                        // ← Nested metadata
      "timestamp": "...",
      "status": "completed"
    }
  }
}
```

**Why it fails:**

- Backend validation fails: "Missing section type"
- Data structure doesn't match database schema
- Progress not updated because section not saved

---

### **3. Section Count Mismatch**

| Component                     | Total Sections | Issue       |
| ----------------------------- | -------------- | ----------- |
| N8N Workflow                  | 11 sections    | ✅ Correct  |
| Backend (`/api/sync/section`) | Expects 12     | ❌ Mismatch |
| Frontend (`page.tsx`)         | Shows 11       | ✅ Correct  |

**Why it matters:**

- Backend initializes progress with `totalSections: 12`
- Frontend expects 11 sections
- Percentage calculation will be off

---

## Detailed Fix Guide

### **Fix 1: Update ALL HTTP Request Nodes**

You have 11 HTTP Request nodes in N8N. Each one needs to be updated.

**Nodes to fix:**

1. HTTP Request (Section 1)
2. HTTP Request1 (Section 2)
3. HTTP Request2 (Section 3)
4. HTTP Request3 (Section 4)
5. HTTP Request4 (Section 5)
6. HTTP Request5 (Section 6)
7. HTTP Request6 (Section 7)
8. HTTP Request7 (Section 8)
9. HTTP Request8 (Section 9)
10. HTTP Request9 (Section 10)
11. HTTP Request10 (Section 11)

**For EACH node:**

1. Click the node
2. Change **URL** to:

   ```
   https://your-actual-domain.com/api/sync/section
   ```

3. Change **Body** to:

   ```json
   {
     "submissionId": "={{ $('Webhook Trigger').first().json.body.submissionId }}",
     "section": {
       "section_type": "SECTION_TYPE_HERE",
       "order": ORDER_HERE,
       "section_data": {{ $json["output"] }},
       "metadata": {
         "timestamp": "={{ $now.toISO() }}",
         "status": "completed",
         "source": "n8n_workflow"
       }
     }
   }
   ```

4. Replace `SECTION_TYPE_HERE` and `ORDER_HERE` based on table below

---

### **Section Type Reference**

| Node           | Section Name           | section_type          | order |
| -------------- | ---------------------- | --------------------- | ----- |
| HTTP Request   | Product Overview       | `product_overview`    | 1     |
| HTTP Request1  | Product Identity       | `product_identity`    | 2     |
| HTTP Request2  | Marketing Copy         | `marketing_copy`      | 3     |
| HTTP Request3  | Formula & Texture      | `formula_texture`     | 4     |
| HTTP Request4  | Sensory Experience     | `sensory_experience`  | 5     |
| HTTP Request5  | Packaging Design       | `packaging_design`    | 6     |
| HTTP Request6  | Target Market Analysis | `target_market`       | 7     |
| HTTP Request7  | Go-to-Market Strategy  | `gtm_strategy`        | 8     |
| HTTP Request8  | Production & MOQ       | `production_moq`      | 9     |
| HTTP Request9  | Competitor Analysis    | `competitor_analysis` | 10    |
| HTTP Request10 | Pricing Strategy       | `pricing_strategy`    | 11    |

---

### **Fix 2: Update Backend Total Sections**

**File:** `src/app/api/sync/section/route.ts`

**Line 93:**

```typescript
// Change from:
totalSections: 12,

// To:
totalSections: 11,
```

This ensures backend and frontend are in sync.

---

## Testing Procedure

### **Step 1: Test Backend Endpoint**

```bash
curl -X POST http://localhost:3000/api/sync/section \
  -H "Content-Type: application/json" \
  -d '{
    "submissionId": "test-123",
    "section": {
      "section_type": "product_overview",
      "order": 1,
      "section_data": {
        "title": "Test Product",
        "description": "Test description"
      },
      "metadata": {
        "timestamp": "2025-01-23T10:00:00Z",
        "status": "completed"
      }
    }
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Section synced successfully",
  "submissionId": "test-123",
  "sectionType": "product_overview",
  "progress": {
    "completed": 1,
    "total": 11,
    "percentage": 9
  }
}
```

---

### **Step 2: Test N8N → Backend Integration**

1. **Trigger N8N workflow** with test data
2. **Watch N8N execution log**
   - Should show HTTP Request nodes executing
   - Should show 200 OK responses
3. **Check backend logs**
   ```
   📥 Section sync received: { submissionId: '...', sectionType: 'product_overview' }
   💾 Saving section: product_overview
   ✅ Section saved to database
   ✅ Progress updated
   📡 Broadcasting section update via SSE
   ```

---

### **Step 3: Test Frontend Updates**

1. **Open website** → `/result/{submissionId}`
2. **Open DevTools** → Console tab
3. **Watch for SSE events:**
   ```
   🔌 Connecting to SSE stream...
   ✅ SSE connection established
   📨 SSE event received: section_complete
   ✅ Section completed: product_overview
   ```
4. **Watch progress bar:**
   - Should update: 0/11 → 1/11 → 2/11 → ...
5. **Watch section cards:**
   - Should appear one by one as sections complete

---

## Verification Checklist

### **N8N Side:**

- [ ] All 11 HTTP Request nodes updated
- [ ] URL points to `/api/sync/section`
- [ ] Body format matches backend expectation
- [ ] `section_type` is snake_case
- [ ] `order` is correct (1-11)
- [ ] Test execution shows 200 OK responses

### **Backend Side:**

- [ ] Server is running
- [ ] `/api/sync/section` endpoint accessible
- [ ] Database tables exist (`report_sections`, `section_progress`)
- [ ] SSE broadcast function working
- [ ] Logs show incoming requests
- [ ] `totalSections` set to 11

### **Frontend Side:**

- [ ] SSE connection established
- [ ] Browser console shows SSE events
- [ ] Progress bar updates (0/11 → 1/11 → ...)
- [ ] Section cards appear
- [ ] No CORS errors
- [ ] No 404 errors

---

## Common Errors & Solutions

### **Error: "Missing section type"**

**Cause:** Body format incorrect

**Fix:** Ensure body has `section.section_type` field:

```json
{
  "section": {
    "section_type": "product_overview" // ← Must exist
  }
}
```

---

### **Error: 404 Not Found**

**Cause:** Wrong URL endpoint

**Fix:** Change URL from `/result/{id}` to `/api/sync/section`

---

### **Error: Progress not updating**

**Cause:** SSE not broadcasting or frontend not receiving

**Fix:**

1. Check backend logs for "📡 Broadcasting section update"
2. Check browser DevTools → Network → EventStream
3. Verify SSE connection is active

---

### **Error: CORS blocked**

**Cause:** N8N domain different from backend domain

**Fix:** Add CORS headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ]
}
```

---

## Expected Timeline

After applying fixes:

```
0:00 - User submits form
0:01 - N8N workflow triggered
0:02 - Section 1 completes → POST /api/sync/section
0:03 - Website shows 1/11 (9%) ✅
0:05 - Section 2 completes → POST /api/sync/section
0:06 - Website shows 2/11 (18%) ✅
...
0:30 - Section 11 completes → POST /api/sync/section
0:31 - Website shows 11/11 (100%) ✅
0:32 - "Report generation complete!" banner appears
```

---

## Database Verification

After workflow completes, check database:

```sql
-- Check sections saved
SELECT
  section_type,
  section_order,
  created_at
FROM report_sections
WHERE submission_id = 'your-submission-id'
ORDER BY section_order;

-- Should return 11 rows

-- Check progress
SELECT
  completed_sections,
  total_sections,
  sections_status
FROM section_progress
WHERE submission_id = 'your-submission-id';

-- Should show:
-- completed_sections: 11
-- total_sections: 11
-- sections_status: {"product_overview": "completed", ...}
```

---

**Status:** Ready to Fix  
**Priority:** High  
**Estimated Fix Time:** 15-30 minutes  
**Last Updated:** January 23, 2025
