#!/usr/bin/env node
/**
 * Batch script to add AdSense infrastructure to SEO/informational pages
 * Cloned from Tax Letter Help & IRS Audit Response
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Pages that should have ads (SEO/informational only)
const SEO_PAGES = [
  'homeowners-claim-letter-help.html',
  'auto-claim-letter-help.html',
  'commercial-claim-letter-help.html',
  'insurance-claim-help.html',
  'insurance-appeal-letter-help.html',
  'claim-denied-help.html',
  'insurance-claim-denied-letter.html',
  'bad-faith-insurance-letter.html',
  'insurance-payment-dispute-letter.html',
  'proof-of-loss-letter-help.html',
  'insurance-response-letter-generator.html',
  'insurance-written-appeal-letter.html',
  'examples.html',
  'claim-letter-help-vs-attorney.html',
  'claim-letter-help-vs-chatgpt.html',
  'claim-letter-help-not-legal-advice.html'
];

// Pages to EXCLUDE (checkout, auth, dashboard)
const EXCLUDED_PAGES = [
  'login.html',
  'signup.html',
  'dashboard.html',
  'payment.html',
  'checkout.html',
  'upload-hardened.html',
  'admin.html',
  'test-payment-flow.html'
];

const ROOT_DIR = process.cwd();

// AdSense script to inject
const ADSENSE_SCRIPT = `
  <!-- AdSense Script (STEP 2) -->
  <script async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
    crossorigin="anonymous"></script>
  
  <!-- Ads CSS -->
  <link rel="stylesheet" href="/src/ads.css">`;

// Post-content ad container
const POST_CONTENT_AD = `
    <!-- POST-CONTENT AD (PRIMARY PLACEMENT - STEP 3.1) -->
    <section class="native-ad post-content-ad">
      <p class="ad-label">Sponsored Resources</p>
      <div id="ad-post-content"></div>
    </section>
`;

// Exit grid ad container (desktop only)
const EXIT_GRID_AD = `
    <!-- EXIT / SCROLL-END AD (DESKTOP ONLY - STEP 3.2) -->
    <section class="native-ad exit-grid-ad desktop-only">
      <p class="ad-label">Additional Claim Support Options</p>
      <div id="ad-exit-grid"></div>
    </section>
`;

// Mobile footer sticky ad
const MOBILE_FOOTER_AD = `
  <!-- MOBILE FOOTER STICKY AD (STEP 3.3) -->
  <div class="native-ad mobile-footer-ad mobile-only" id="ad-mobile-footer">
    <button class="ad-dismiss" aria-label="Close ad">&times;</button>
    <p class="ad-label">Related Services</p>
  </div>`;

// Ads.js script tag
const ADS_SCRIPT_TAG = `  <script type="module" src="/src/ads.js"></script>`;

function processPage(filename) {
  const filepath = join(ROOT_DIR, filename);
  
  try {
    let content = readFileSync(filepath, 'utf-8');
    
    // Check if ads already added
    if (content.includes('adsbygoogle.js') || content.includes('ad-post-content')) {
      console.log(`⏭️  Skipping ${filename} - ads already present`);
      return;
    }
    
    // STEP 1: Add AdSense script and CSS in <head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${ADSENSE_SCRIPT}\n</head>`);
    }
    
    // STEP 2: Add post-content ad after first major content section
    // Look for the second <section> (after hero)
    const sectionMatches = [...content.matchAll(/<section[^>]*>/g)];
    if (sectionMatches.length >= 2) {
      const secondSectionIndex = sectionMatches[1].index;
      content = content.slice(0, secondSectionIndex) + 
                POST_CONTENT_AD + 
                content.slice(secondSectionIndex);
    }
    
    // STEP 3: Add exit grid ad before final CTA section
    // Find the last CTA section (usually has background:#0f172a or similar)
    const ctaPattern = /<section[^>]*text-align:center[^>]*padding:[^>]*background:#0f172a[^>]*>/;
    const ctaMatch = content.match(ctaPattern);
    if (ctaMatch) {
      const ctaIndex = content.lastIndexOf(ctaMatch[0]);
      content = content.slice(0, ctaIndex) + 
                EXIT_GRID_AD + 
                content.slice(ctaIndex);
    }
    
    // STEP 4: Add mobile footer ad before </main>
    if (content.includes('</main>')) {
      content = content.replace('</main>', `</main>\n${MOBILE_FOOTER_AD}`);
    }
    
    // STEP 5: Add ads.js script before </body>
    if (content.includes('</body>')) {
      // Check if main.js script exists
      if (content.includes('src="/src/main.js"')) {
        content = content.replace(
          '<script type="module" src="/src/main.js"></script>',
          `<script type="module" src="/src/main.js"></script>\n${ADS_SCRIPT_TAG}`
        );
      } else {
        content = content.replace('</body>', `${ADS_SCRIPT_TAG}\n</body>`);
      }
    }
    
    // Write updated content
    writeFileSync(filepath, content, 'utf-8');
    console.log(`✅ Added ads to ${filename}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

function main() {
  console.log('🚀 Adding AdSense infrastructure to SEO pages...\n');
  
  let processed = 0;
  let skipped = 0;
  
  for (const page of SEO_PAGES) {
    if (EXCLUDED_PAGES.includes(page)) {
      console.log(`⛔ Excluded: ${page}`);
      continue;
    }
    
    processPage(page);
    processed++;
  }
  
  console.log(`\n✨ Complete! Processed ${processed} pages.`);
  console.log('\n⚠️  NEXT STEPS:');
  console.log('1. Replace ca-pub-XXXXXXXXXXXXXXXX with actual AdSense client ID');
  console.log('2. Replace slot IDs in src/ads.js with actual slot IDs');
  console.log('3. Test on staging environment');
  console.log('4. Verify page exclusions work correctly');
}

main();
