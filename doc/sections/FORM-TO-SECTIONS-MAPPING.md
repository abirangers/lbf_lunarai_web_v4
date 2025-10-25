# 🎯 Form Data to Report Sections Mapping

## 📋 Analisis Form Data Aktual

Berdasarkan JSON submission yang diberikan:

```json
{
  "submission_id": "ec7d7600-eded-46e9-b697-acc824bc2d49",
  "system_metadata": {
    "language": "id",
    "appVersion": "1.0.0",
    "formVersion": "1.0.0"
  },
  "product_blueprint": {
    "netto": { "unit": "g", "value": 308 },
    "gender": "female",
    "formType": "Cream",
    "ageRanges": ["26-35", "36-50"],
    "functions": ["anti-aging", "hydrating"],
    "aiImageStyle": "...",
    "colorProfile": { "hex": "#436761", "description": "..." },
    "moqExpectation": 610,
    "packagingPrimer": { "type": "jar", "finish": "", "materialNotes": "Louisiana" },
    "fragranceProfile": "...",
    "targetRetailPrice": 482,
    "texturePreference": "..."
  },
  "target_environment": "test"
}
```

---

## ❌ Sections yang TIDAK RELEVAN (Harus Dihapus)

Dari diskusi Claude, sections ini **TIDAK SESUAI** dengan form data:

| #   | Section Name (Claude)   | Alasan Dihapus                                                      |
| --- | ----------------------- | ------------------------------------------------------------------- |
| 1   | Brand Identity          | ❌ Form tidak ada field: brand_name, brand_story, brand_positioning |
| 4   | Target Market & Persona | ❌ Sudah tercakup di Product Blueprint (ageRanges, gender)          |
| 5   | Competitor Analysis     | ❌ Form tidak input data kompetitor                                 |
| 6   | Claims & Evidence       | ❌ Form tidak ada field untuk claims/evidence                       |
| 10  | Production & MOQ        | ✅ Bisa dipertahankan (ada moqExpectation)                          |
| 11  | Go-to-Market Strategy   | ❌ Form tidak ada data marketing strategy                           |
| 12  | Regulatory & Compliance | ❌ Form tidak ada data regulatory                                   |

---

## ✅ Sections yang RELEVAN (Sesuai Form Data)

Berdasarkan form data aktual, sections yang **HARUS ADA**:

### **Section 1: Product Overview** 📋

**Key**: `productOverview`  
**Order**: 1

**Data dari Form**:

- `formType`: "Cream"
- `gender`: "female"
- `ageRanges`: ["26-35", "36-50"]
- `functions`: ["anti-aging", "hydrating"]
- `netto`: { unit: "g", value: 308 }

**Output yang Dihasilkan**:

```json
{
  "productType": "Cream",
  "targetGender": "Female",
  "targetAge": "26-50 years old",
  "keyFunctions": ["Anti-aging", "Hydrating"],
  "netWeight": "308g",
  "productCategory": "Skincare - Facial Cream",
  "summary": "A hydrating and anti-aging cream designed for women aged 26-50..."
}
```

---

### **Section 2: Formula & Texture** 🧪

**Key**: `formulaTexture`  
**Order**: 2

**Data dari Form**:

- `formType`: "Cream"
- `texturePreference`: "Est ut facere impedit..."
- `functions`: ["anti-aging", "hydrating"]

**Output yang Dihasilkan**:

```json
{
  "formType": "Cream",
  "textureDescription": "Rich, luxurious cream texture...",
  "expectedConsistency": "Medium-thick, easily spreadable",
  "absorptionRate": "Moderate (2-3 minutes)",
  "finish": "Dewy, hydrated finish",
  "recommendedIngredients": [
    "Hyaluronic Acid (hydration)",
    "Retinol (anti-aging)",
    "Peptides (firming)"
  ]
}
```

---

### **Section 3: Packaging Design** 📦

**Key**: `packagingDesign`  
**Order**: 3

**Data dari Form**:

- `packagingPrimer.type`: "jar"
- `packagingPrimer.finish`: ""
- `packagingPrimer.materialNotes`: "Louisiana"
- `colorProfile.hex`: "#436761"
- `colorProfile.description`: "..."

**Output yang Dihasilkan**:

```json
{
  "packagingType": "Jar",
  "material": "Glass or high-quality plastic",
  "colorScheme": {
    "primary": "#436761",
    "description": "Sophisticated sage green"
  },
  "size": "308g / 10.9 oz",
  "designNotes": "Premium, eco-friendly aesthetic",
  "closureType": "Screw cap or pump dispenser"
}
```

---

### **Section 4: Sensory Experience** 👃

**Key**: `sensoryExperience`  
**Order**: 4

**Data dari Form**:

- `fragranceProfile`: "Ipsa exercitationem corporis..."
- `texturePreference`: "..."
- `colorProfile`: { hex, description }

**Output yang Dihasilkan**:

```json
{
  "fragrance": {
    "profile": "Light, fresh, botanical",
    "intensity": "Subtle",
    "notes": ["Green tea", "Cucumber", "Light floral"]
  },
  "texture": {
    "feel": "Smooth, velvety",
    "spreadability": "Easy to spread",
    "absorption": "Moderate"
  },
  "visualAppeal": {
    "color": "#436761 (Sage green)",
    "appearance": "Creamy, opaque"
  },
  "userExperience": "Luxurious, spa-like application experience"
}
```

---

### **Section 5: Pricing Strategy** 💰

**Key**: `pricingStrategy`  
**Order**: 5

**Data dari Form**:

- `targetRetailPrice`: 482
- `moqExpectation`: 610
- `netto.value`: 308

**Output yang Dihasilkan**:

```json
{
  "targetRetailPrice": "Rp 482,000",
  "pricePerGram": "Rp 1,565/g",
  "marketSegment": "Premium",
  "competitivePricing": {
    "low": "Rp 400,000",
    "average": "Rp 500,000",
    "high": "Rp 650,000"
  },
  "valueProposition": "Premium anti-aging cream with competitive pricing",
  "recommendedMargin": "45-50%"
}
```

---

### **Section 6: Production & MOQ** 🏭

**Key**: `productionMOQ`  
**Order**: 6

**Data dari Form**:

- `moqExpectation`: 610
- `netto.value`: 308

**Output yang Dihasilkan**:

```json
{
  "minimumOrderQuantity": 610,
  "totalProduction": "187.88 kg (610 units × 308g)",
  "estimatedLeadTime": "45-60 days",
  "productionPhases": [
    {
      "phase": "Formula Development",
      "duration": "10-15 days"
    },
    {
      "phase": "Stability Testing",
      "duration": "15-20 days"
    },
    {
      "phase": "Bulk Production",
      "duration": "15-20 days"
    },
    {
      "phase": "Packaging & QC",
      "duration": "5-7 days"
    }
  ],
  "manufacturingNotes": "Suitable for contract manufacturing"
}
```

---

### **Section 7: Target Market Analysis** 🎯

**Key**: `targetMarketAnalysis`  
**Order**: 7

**Data dari Form**:

- `gender`: "female"
- `ageRanges`: ["26-35", "36-50"]
- `functions`: ["anti-aging", "hydrating"]
- `targetRetailPrice`: 482

**Output yang Dihasilkan**:

```json
{
  "demographics": {
    "gender": "Female",
    "ageRange": "26-50 years",
    "incomeLevel": "Middle to upper-middle class",
    "location": "Urban areas"
  },
  "psychographics": {
    "concerns": ["Aging signs", "Dry skin", "Fine lines"],
    "values": ["Quality", "Efficacy", "Natural ingredients"],
    "lifestyle": "Health-conscious, beauty-aware"
  },
  "marketSize": {
    "indonesia": "Rp 15.2 trillion (2024)",
    "targetSegment": "Premium anti-aging (15% of market)"
  },
  "buyingBehavior": {
    "purchaseFrequency": "Every 2-3 months",
    "decisionFactors": ["Ingredients", "Reviews", "Brand reputation"]
  }
}
```

---

### **Section 8: Marketing Copy** ✍️

**Key**: `marketingCopy`  
**Order**: 8

**Data dari Form**:

- All product_blueprint fields

**Output yang Dihasilkan**:

```json
{
  "productName": "AgeLess Hydra Cream",
  "tagline": "Turn Back Time, Naturally",
  "headline": "Discover Youthful, Radiant Skin at Any Age",
  "bodyCopy": "Our premium anti-aging cream combines powerful hydrating ingredients...",
  "keyBenefits": [
    "Reduces fine lines and wrinkles",
    "Deeply hydrates for 24 hours",
    "Improves skin elasticity",
    "Suitable for sensitive skin"
  ],
  "callToAction": "Experience the transformation. Order now!",
  "socialMediaCaptions": {
    "instagram": "✨ Say goodbye to fine lines...",
    "facebook": "Introducing our newest anti-aging solution..."
  }
}
```

---

## 📊 Summary: 8 Relevant Sections

| #   | Section Key            | Section Name           | Data Source                                       |
| --- | ---------------------- | ---------------------- | ------------------------------------------------- |
| 1   | `productOverview`      | Product Overview       | formType, gender, ageRanges, functions, netto     |
| 2   | `formulaTexture`       | Formula & Texture      | formType, texturePreference, functions            |
| 3   | `packagingDesign`      | Packaging Design       | packagingPrimer, colorProfile                     |
| 4   | `sensoryExperience`    | Sensory Experience     | fragranceProfile, texturePreference, colorProfile |
| 5   | `pricingStrategy`      | Pricing Strategy       | targetRetailPrice, moqExpectation, netto          |
| 6   | `productionMOQ`        | Production & MOQ       | moqExpectation, netto                             |
| 7   | `targetMarketAnalysis` | Target Market Analysis | gender, ageRanges, functions, targetRetailPrice   |
| 8   | `marketingCopy`        | Marketing Copy         | All product_blueprint fields                      |

---

## 🔄 Update Required

### **Database Schema**

```sql
-- Update totalSections from 12 to 8
UPDATE section_progress SET total_sections = 8;
```

### **SectionCard.tsx**

Update `formatSectionTitle()`:

```typescript
const titles: Record<string, string> = {
  productOverview: 'Product Overview',
  formulaTexture: 'Formula & Texture',
  packagingDesign: 'Packaging Design',
  sensoryExperience: 'Sensory Experience',
  pricingStrategy: 'Pricing Strategy',
  productionMOQ: 'Production & MOQ',
  targetMarketAnalysis: 'Target Market Analysis',
  marketingCopy: 'Marketing Copy',
}
```

### **n8n Workflow**

- Reduce from 12 AI nodes to 8 AI nodes
- Update prompts to match form data structure
- Update section keys and orders

---

## ✅ Next Steps

1. ✅ Update `SectionCard.tsx` dengan 8 sections baru
2. ✅ Update `ProductReport.tsx` dengan renderers baru
3. ✅ Update database default `totalSections` dari 12 → 8
4. ✅ Update n8n workflow dengan 8 sections
5. ✅ Test end-to-end dengan form data aktual

---

**Total Sections**: 8 (turun dari 12)  
**Estimated Processing Time**: 8-15 seconds (lebih cepat!)  
**Cost**: Masih $0/month dengan Gemini Flash ✅
