# NO-REGRESSION-RULES
**Claim Letter Help — Permanent Safety Locks**  
**Date:** December 17, 2025  
**Status:** ⚠️ **LOCKED — DO NOT MODIFY**

---

## ⚠️ CRITICAL WARNING

**This document defines permanent safety boundaries for Claim Letter Help.**

Any modification that loosens these constraints constitutes a **safety regression** and increases **user harm risk**.

**DO NOT:**
- Remove hard stops
- Add free-form inputs
- Increase temperature
- Add tone/style/approach selectors
- Bypass classification or phase detection
- Remove output sanitization
- Add "helpful" features that increase flexibility

**IF YOU MODIFY THIS SYSTEM TO BE MORE PERMISSIVE, YOU ARE MAKING IT LESS SAFE.**

---

## 🚫 FORBIDDEN FOREVER

### **1. Free-Form Textareas**
- ❌ **NEVER** add `<textarea>` fields
- ❌ **NEVER** add placeholder text like:
  - "Tell us what happened"
  - "Explain your situation"
  - "Describe everything"
  - "Include any relevant personal information"
  - "Share your story"
  - "Provide context"

**WHY:** Free-form inputs encourage over-disclosure, narrative generation, and user harm.

**LOCKED FILES:**
- `upload-hardened.html`
- `resource-hardened.html`

---

### **2. Tone/Style/Approach Selectors**
- ❌ **NEVER** add dropdowns for:
  - Tone (Professional, Conversational, Assertive, Conciliatory)
  - Approach (Defensive, Cooperative, Challenging, Explanatory)
  - Style (Detailed, Concise, Technical, Personal)
- ❌ **NEVER** add "Optional context" fields
- ❌ **NEVER** add "Narrative" or "Story" sections

**WHY:** Style variations create unpredictable, chat-like output and increase harm risk.

**LOCKED FILES:**
- `resource-hardened.html`
- `generate-insurance-response.js`

---

### **3. Narrative Prompts**
- ❌ **NEVER** prompt users to:
  - "Tell their story"
  - "Explain what happened"
  - "Describe the incident"
  - "Share details"
  - "Provide background"

**WHY:** Narrative prompts encourage over-disclosure and emotional language.

**LOCKED FILES:**
- `upload-hardened.html`
- `resource-hardened.html`

---

### **4. "Optional Context" Fields**
- ❌ **NEVER** add fields labeled:
  - "Optional context"
  - "Additional information"
  - "Notes"
  - "Comments"
  - "Other details"

**WHY:** "Optional" fields become dumping grounds for over-disclosure.

**LOCKED FILES:**
- All HTML forms

---

### **5. High-Temperature Generation**
- ❌ **NEVER** set temperature > 0.3
- ❌ **NEVER** set `top_p` > 0.9
- ❌ **NEVER** use `gpt-4` or `gpt-4-turbo` (use `gpt-4o-mini` only)

**WHY:** High temperature creates unpredictable, creative, chat-like output.

**LOCKED FILES:**
- `analyze-insurance-letter.js` (temperature: 0.2)
- `generate-insurance-response.js` (temperature: 0.2)

---

### **6. Generation During Hard-Stop Phases**
- ❌ **NEVER** generate output when hard stops are triggered:
  - Fraud investigations
  - EUO requests
  - Recorded statement requests
  - Reservation of rights
  - Bad faith allegations
  - Attorney involvement
  - Litigation threats
  - Commercial claims over $50,000
  - Subrogation disputes
  - Coverage disputes

**WHY:** Generating output in these scenarios increases user harm and liability.

**LOCKED FILES:**
- `insurance-risk-guardrails.js`
- `generate-insurance-response.js`

---

### **7. Bypassing Classification or Phase Detection**
- ❌ **NEVER** allow generation without:
  - Claim classification (type, party, context)
  - Phase detection (initial, denial, EUO, fraud, etc.)
  - Risk evaluation (hard stops)

**WHY:** Classification and phase detection are mandatory safety gates.

**LOCKED FILES:**
- `claim-classification.js`
- `claim-phase-detector.js`
- `analyze-insurance-letter.js`

---

### **8. Removing Output Sanitization**
- ❌ **NEVER** remove prohibited phrases from output:
  - "We understand"
  - "This can be frustrating"
  - "We're here to help"
  - "Don't worry"
  - "You deserve"
  - "Fight for your rights"
  - "Challenge the insurer"
  - "Negotiate"
  - "Argue"
  - "Dispute"

**WHY:** Output sanitization prevents chatbot-like, emotional, persuasive language.

**LOCKED FILES:**
- `insurance-output-formatter.js`

---

### **9. Adding "Helpful" Features**
- ❌ **NEVER** add features that:
  - "Improve user experience"
  - "Make it easier to use"
  - "Increase conversion"
  - "Reduce friction"
  - "Enhance flexibility"

**WHY:** "Helpful" features often increase harm risk by making the system more permissive.

**PRINCIPLE:** Optimize for safety, not helpfulness.

---

## 🔐 LOCKED REQUIREMENTS

### **1. Mandatory Classification**
- ✅ **MUST** classify claim type (Property, Auto, Health, Business)
- ✅ **MUST** classify party type (First-party, Third-party)
- ✅ **MUST** classify context (Personal, Commercial)
- ✅ **MUST** stop if classification fails

**LOCKED FILES:**
- `claim-classification.js`

---

### **2. Mandatory Phase Detection**
- ✅ **MUST** detect letter phase:
  - Initial claim
  - Denial
  - Appeal
  - Reservation of rights
  - EUO
  - Recorded statement request
  - Fraud investigation
  - Litigation/counsel involved
- ✅ **MUST** stop if phase cannot be determined

**LOCKED FILES:**
- `claim-phase-detector.js`

---

### **3. Mandatory Guardrails**
- ✅ **MUST** evaluate risk before generation
- ✅ **MUST** trigger hard stops for dangerous scenarios
- ✅ **MUST** block output when hard stop is triggered
- ✅ **MUST** display refusal message with attorney recommendation

**LOCKED FILES:**
- `insurance-risk-guardrails.js`

---

### **4. Fixed Procedural Templates**
- ✅ **MUST** use fixed playbooks per claim phase
- ✅ **MUST** limit output to 3-5 lines per section
- ✅ **MUST** enforce procedural structure (no free-form)
- ✅ **MUST** prohibit explanations beyond request

**LOCKED FILES:**
- `insurance-response-playbooks.js`

---

### **5. Deterministic Output**
- ✅ **MUST** use temperature ≤ 0.3
- ✅ **MUST** use fixed prompts (no dynamic strategy)
- ✅ **MUST** enforce same input = same output

**LOCKED FILES:**
- `analyze-insurance-letter.js`
- `generate-insurance-response.js`

---

## 🛡️ REGRESSION WARNING HEADERS

All core safety files **MUST** include this header:

```javascript
/**
 * ⚠️ SAFETY LOCK — DO NOT MODIFY ⚠️
 * This system intentionally refuses certain scenarios.
 * Removing guardrails constitutes a safety regression.
 * 
 * REGRESSION WARNING:
 * This file enforces safety boundaries.
 * Any loosening increases user harm risk.
 */
```

**Files with headers:**
- `analyze-insurance-letter.js`
- `generate-insurance-response.js`
- `claim-classification.js`
- `claim-phase-detector.js`
- `insurance-risk-guardrails.js`
- `insurance-evidence-mapper.js`
- `insurance-response-playbooks.js`
- `insurance-output-formatter.js`

---

## 🚨 REGRESSION DETECTION

### **If you see any of the following, it's a regression:**

1. ❌ Free-form `<textarea>` fields added
2. ❌ Tone/style/approach selectors added
3. ❌ Temperature increased above 0.3
4. ❌ Hard stops bypassed or removed
5. ❌ Classification or phase detection made optional
6. ❌ Output sanitization disabled
7. ❌ "Optional context" fields added
8. ❌ "Tell your story" prompts added
9. ❌ Generation allowed during hard-stop scenarios
10. ❌ Prohibited phrases reintroduced to output

**IF ANY OF THE ABOVE OCCUR → REVERT IMMEDIATELY**

---

## 📋 REGRESSION TEST CHECKLIST

Run these tests after **ANY** code change:

1. ✅ Can user tell story anywhere? → **MUST BE NO**
2. ✅ Can user select tone/style/approach? → **MUST BE NO**
3. ✅ Can system generate for fraud/EUO? → **MUST BE NO**
4. ✅ Is temperature ≤ 0.3? → **MUST BE YES**
5. ✅ Are hard stops enforced? → **MUST BE YES**
6. ✅ Is output boring, procedural, short? → **MUST BE YES**
7. ✅ Is ChatGPT more permissive? → **MUST BE YES**
8. ✅ Is system willing to refuse? → **MUST BE YES**

**IF ANY TEST FAILS → REVERT IMMEDIATELY**

---

## 🔒 FINAL RULE

**This system is designed to stop users from making mistakes, not help them argue with insurers.**

**IF A CHANGE MAKES THE SYSTEM MORE FLEXIBLE, EASIER, OR NICER → IT'S PROBABLY A REGRESSION.**

**Optimize for safety and containment, not helpfulness.**

---

## 📝 CHANGE LOG

| Date | Change | Approved By | Reason |
|------|--------|-------------|--------|
| 2025-12-17 | Initial lock | Phase 3 Hardening | Production safety certification |

---

**END OF NO-REGRESSION-RULES**

⚠️ **DO NOT MODIFY WITHOUT EXPLICIT AUTHORIZATION** ⚠️

