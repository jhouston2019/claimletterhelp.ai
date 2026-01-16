#!/usr/bin/env node
/**
 * Validation script for AdSense implementation
 * Verifies all requirements are met
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();

// Expected pages with ads
const EXPECTED_WITH_ADS = [
  'insurance-claim-letter-help.html',
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

// Pages that should NOT have ads
const EXPECTED_WITHOUT_ADS = [
  'login.html',
  'signup.html',
  'dashboard.html',
  'payment.html',
  'upload-hardened.html',
  'admin.html'
];

// Insurance-safe labels
const SAFE_LABELS = [
  'Sponsored Resources',
  'Additional Claim Support Options',
  'Related Services'
];

// Forbidden labels
const FORBIDDEN_LABELS = [
  'Deals',
  'Offers',
  'Recommended',
  'Best'
];

let errors = [];
let warnings = [];
let passed = 0;

function validateFile(filename, shouldHaveAds) {
  const filepath = join(ROOT_DIR, filename);
  
  if (!existsSync(filepath)) {
    warnings.push(`⚠️  File not found: ${filename}`);
    return;
  }
  
  const content = readFileSync(filepath, 'utf-8');
  
  const hasAdsenseScript = content.includes('pagead2.googlesyndication.com');
  const hasAdContainers = content.includes('ad-post-content');
  const hasAdsCss = content.includes('/src/ads.css');
  const hasAdsJs = content.includes('/src/ads.js');
  
  if (shouldHaveAds) {
    // Should have ads
    if (!hasAdsenseScript) {
      errors.push(`❌ ${filename}: Missing AdSense script`);
    } else {
      passed++;
    }
    
    if (!hasAdContainers) {
      errors.push(`❌ ${filename}: Missing ad containers`);
    } else {
      passed++;
    }
    
    if (!hasAdsCss) {
      errors.push(`❌ ${filename}: Missing ads.css link`);
    } else {
      passed++;
    }
    
    if (!hasAdsJs) {
      errors.push(`❌ ${filename}: Missing ads.js script`);
    } else {
      passed++;
    }
    
    // Check for forbidden labels in ad-label elements only
    const adLabelRegex = /<p class="ad-label">([^<]+)<\/p>/g;
    const adLabels = [...content.matchAll(adLabelRegex)].map(m => m[1]);
    
    for (const forbidden of FORBIDDEN_LABELS) {
      for (const label of adLabels) {
        if (label.includes(forbidden)) {
          errors.push(`❌ ${filename}: Ad label contains forbidden word "${forbidden}": "${label}"`);
        }
      }
    }
    
    // Check for safe labels
    let hasSafeLabel = false;
    for (const safe of SAFE_LABELS) {
      if (content.includes(safe)) {
        hasSafeLabel = true;
        break;
      }
    }
    if (!hasSafeLabel) {
      warnings.push(`⚠️  ${filename}: No insurance-safe labels found`);
    }
    
  } else {
    // Should NOT have ads
    if (hasAdsenseScript || hasAdContainers) {
      errors.push(`❌ ${filename}: Should NOT have ads (excluded page)`);
    } else {
      passed++;
    }
  }
}

function validateCoreFiles() {
  console.log('\n📋 Validating Core Files...\n');
  
  // Check ads.js exists
  if (existsSync(join(ROOT_DIR, 'src', 'ads.js'))) {
    console.log('✅ src/ads.js exists');
    passed++;
    
    const adsJs = readFileSync(join(ROOT_DIR, 'src', 'ads.js'), 'utf-8');
    
    // Check for required functions
    if (adsJs.includes('shouldShowAds')) {
      console.log('✅ shouldShowAds() function present');
      passed++;
    } else {
      errors.push('❌ ads.js: Missing shouldShowAds() function');
    }
    
    if (adsJs.includes('lazyLoadAd')) {
      console.log('✅ lazyLoadAd() function present');
      passed++;
    } else {
      errors.push('❌ ads.js: Missing lazyLoadAd() function');
    }
    
    if (adsJs.includes('pageExclusions')) {
      console.log('✅ Page exclusions configured');
      passed++;
    } else {
      errors.push('❌ ads.js: Missing pageExclusions');
    }
    
  } else {
    errors.push('❌ src/ads.js not found');
  }
  
  // Check ads.css exists
  if (existsSync(join(ROOT_DIR, 'src', 'ads.css'))) {
    console.log('✅ src/ads.css exists');
    passed++;
    
    const adsCss = readFileSync(join(ROOT_DIR, 'src', 'ads.css'), 'utf-8');
    
    if (adsCss.includes('.native-ad')) {
      console.log('✅ .native-ad styles present');
      passed++;
    } else {
      errors.push('❌ ads.css: Missing .native-ad styles');
    }
    
    if (adsCss.includes('.desktop-only') && adsCss.includes('.mobile-only')) {
      console.log('✅ Responsive styles present');
      passed++;
    } else {
      errors.push('❌ ads.css: Missing responsive styles');
    }
    
  } else {
    errors.push('❌ src/ads.css not found');
  }
}

function main() {
  console.log('🔍 AdSense Implementation Validation\n');
  console.log('=' .repeat(50));
  
  validateCoreFiles();
  
  console.log('\n📄 Validating Pages With Ads...\n');
  for (const page of EXPECTED_WITH_ADS) {
    validateFile(page, true);
  }
  
  console.log('\n🚫 Validating Pages Without Ads...\n');
  for (const page of EXPECTED_WITHOUT_ADS) {
    validateFile(page, false);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 VALIDATION RESULTS\n');
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    warnings.forEach(w => console.log(w));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS:\n');
    errors.forEach(e => console.log(e));
    console.log('\n❌ Validation FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✅ Validation PASSED\n');
    console.log('🎉 AdSense implementation is complete and correct!\n');
    console.log('📝 Next steps:');
    console.log('   1. Update AdSense client ID in all files');
    console.log('   2. Update slot IDs in src/ads.js');
    console.log('   3. Test on staging environment');
    console.log('   4. Deploy to production\n');
  }
}

main();
