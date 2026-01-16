# AdSense Quick Start Guide
## Insurance Claim Letter Help

---

## ✅ Status: Implementation Complete

**What's Done:**
- ✅ Ads deployed to 17 SEO pages
- ✅ Excluded pages verified (no ads)
- ✅ Validation passed (81/81 checks)
- ✅ Insurance-safe copy verified

**What's Needed:**
- ⏳ Update AdSense client ID
- ⏳ Update slot IDs
- ⏳ Test on staging
- ⏳ Deploy to production

---

## 🚀 3-Step Configuration

### STEP 1: Update Client ID (5 minutes)

**Find & Replace:**

```bash
# Search for:
ca-pub-XXXXXXXXXXXXXXXX

# Replace with your actual AdSense client ID:
ca-pub-1234567890123456
```

**Files to update:**
- All 17 HTML pages (in `<head>` section)
- `/src/ads.js` (line 11)

**Quick command:**
```bash
# Windows PowerShell
Get-ChildItem *.html | ForEach-Object {
  (Get-Content $_.FullName) -replace 'ca-pub-XXXXXXXXXXXXXXXX', 'ca-pub-YOUR-ACTUAL-ID' | Set-Content $_.FullName
}

# Update ads.js separately
```

---

### STEP 2: Update Slot IDs (2 minutes)

**File:** `/src/ads.js` (Lines 18-22)

```javascript
const SLOT_IDS = {
  POST_CONTENT: '1234567890',   // ← Your post-content slot ID
  EXIT_GRID: '0987654321',      // ← Your exit grid slot ID
  MOBILE_FOOTER: '1122334455'   // ← Your mobile footer slot ID
};
```

**How to get slot IDs:**
1. Log into Google AdSense
2. Go to Ads → Ad units
3. Create 3 new display ad units:
   - "Insurance Claim - Post Content"
   - "Insurance Claim - Exit Grid"
   - "Insurance Claim - Mobile Footer"
4. Copy the slot IDs (numbers only)

---

### STEP 3: Test & Deploy (30 minutes)

**Staging Test:**
```bash
# Deploy to staging
# Open browser console (F12)
# Check for:
✅ No console errors
✅ Ads load on SEO pages
✅ No ads on /login, /dashboard, /payment
✅ Desktop: 2 ads visible
✅ Mobile: 2 ads (1 sticky footer)
✅ Mobile dismiss button works
```

**Production Deploy:**
```bash
# After staging passes
# Deploy to production
# Monitor for 24-48 hours
```

---

## 📍 Ad Placements

### Desktop (≥768px)
1. **Post-content ad** - After main explanation
2. **Exit grid ad** - Before final CTA

### Mobile (<768px)
1. **Post-content ad** - After main explanation
2. **Footer sticky ad** - Fixed bottom (dismissible)

---

## 🔒 Insurance-Safe Copy

### ✅ USE ONLY THESE:
- "Sponsored Resources"
- "Additional Claim Support Options"
- "Related Services"

### ❌ NEVER USE:
- "Deals" / "Offers"
- "Recommended"
- "Best Options"

---

## 🛡️ Page Exclusions (Auto-Blocked)

Ads will NOT show on:
- `/checkout`
- `/login`
- `/dashboard`
- `/payment`
- `/upload-hardened`
- `/admin`

---

## 📊 Validation

```bash
# Run validation script
node scripts/validate-ads.mjs

# Should output:
✅ Passed: 81
⚠️  Warnings: 0
❌ Errors: 0
```

---

## 🚨 Troubleshooting

**Ads not showing?**
1. Check browser console (F12)
2. Verify client ID is correct
3. Clear browser cache
4. Check AdSense account approved

**Ads on wrong pages?**
1. Check page exclusions in `/src/ads.js`
2. Verify pathname matching

**Mobile footer won't dismiss?**
1. Check `.ad-dismiss` button exists
2. Test on actual mobile device

---

## 📞 Need Help?

**Documentation:**
- Full guide: `ADSENSE-SETUP.md`
- Implementation summary: `ADSENSE-IMPLEMENTATION-COMPLETE.md`
- Config reference: `ads.config.json`

**Scripts:**
- Validate: `node scripts/validate-ads.mjs`
- Add to new page: `node scripts/add-ads-to-pages.mjs`

---

## ✅ Go-Live Checklist

- [ ] Update AdSense client ID (all files)
- [ ] Update slot IDs (ads.js)
- [ ] Run validation script (should pass)
- [ ] Test on staging (all checks pass)
- [ ] Deploy to production
- [ ] Monitor for 24-48 hours
- [ ] Check conversion rate (should be stable)
- [ ] Check RPM (target $2-5)

---

**That's it!** Once you update the client ID and slot IDs, you're ready to deploy.

**Questions?** See `ADSENSE-SETUP.md` for complete documentation.
