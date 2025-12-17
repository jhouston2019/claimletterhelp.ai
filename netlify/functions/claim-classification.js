/**
 * CLAIM CLASSIFICATION ENGINE
 * 
 * ⚠️ SAFETY LOCK — DO NOT MODIFY ⚠️
 * This system intentionally refuses certain scenarios.
 * Removing guardrails constitutes a safety regression.
 * 
 * Mandatory gate before any analysis.
 * Enforces claim type, party type, and context classification.
 * 
 * CRITICAL: Classification must succeed before proceeding.
 * If classification fails → STOP and refuse output.
 * 
 * REGRESSION WARNING:
 * This file enforces safety boundaries.
 * Any loosening increases user harm risk.
 */

const VALID_CLAIM_TYPES = [
  'property_homeowners',
  'property_renters',
  'auto_collision',
  'auto_comprehensive',
  'health_medical',
  'health_prescription'
];

const VALID_PARTY_TYPES = ['first_party', 'third_party'];
const VALID_CONTEXTS = ['personal', 'commercial'];
const VALID_AMOUNTS = ['under_5k', '5k_to_25k', '25k_to_50k', 'over_50k'];

/**
 * Validate and classify claim
 * @param {Object} classification - User-provided classification data
 * @returns {Object} - Validated classification or error
 */
function classifyClaim(classification) {
  const errors = [];
  
  // Validate claim type
  if (!classification.claimType || !VALID_CLAIM_TYPES.includes(classification.claimType)) {
    errors.push('Invalid or missing claim type');
  }
  
  // Validate party type
  if (!classification.partyType || !VALID_PARTY_TYPES.includes(classification.partyType)) {
    errors.push('Invalid or missing party type');
  }
  
  // Validate context
  if (!classification.claimContext || !VALID_CONTEXTS.includes(classification.claimContext)) {
    errors.push('Invalid or missing claim context');
  }
  
  // Validate amount
  if (!classification.claimAmount || !VALID_AMOUNTS.includes(classification.claimAmount)) {
    errors.push('Invalid or missing claim amount');
  }
  
  if (errors.length > 0) {
    return {
      success: false,
      errors,
      message: 'Classification failed. All fields are required.'
    };
  }
  
  // Extract base claim type
  const baseType = classification.claimType.split('_')[0]; // property, auto, health
  
  return {
    success: true,
    classification: {
      claimType: classification.claimType,
      baseType,
      partyType: classification.partyType,
      claimContext: classification.claimContext,
      claimAmount: classification.claimAmount,
      letterDate: classification.letterDate || null,
      isCommercial: classification.claimContext === 'commercial',
      isHighValue: ['25k_to_50k', 'over_50k'].includes(classification.claimAmount),
      isThirdParty: classification.partyType === 'third_party'
    }
  };
}

/**
 * Get claim type metadata
 * @param {string} claimType - Validated claim type
 * @returns {Object} - Metadata about claim type
 */
function getClaimTypeMetadata(claimType) {
  const metadata = {
    'property_homeowners': {
      name: 'Homeowners Property Claim',
      category: 'property',
      typicalDocuments: ['Photos', 'Repair estimates', 'Police report (if theft)'],
      commonDenialReasons: ['Pre-existing damage', 'Maintenance issue', 'Excluded peril', 'Coverage limit exceeded'],
      requiresAdjuster: true
    },
    'property_renters': {
      name: 'Renters Property Claim',
      category: 'property',
      typicalDocuments: ['Photos', 'Receipts', 'Police report (if theft)'],
      commonDenialReasons: ['Not covered under renters policy', 'Landlord responsibility', 'Excluded peril'],
      requiresAdjuster: false
    },
    'auto_collision': {
      name: 'Auto Collision Claim',
      category: 'auto',
      typicalDocuments: ['Police report', 'Photos', 'Repair estimate', 'Witness statements'],
      commonDenialReasons: ['Liability dispute', 'Pre-existing damage', 'Policy lapse', 'Excluded driver'],
      requiresAdjuster: true
    },
    'auto_comprehensive': {
      name: 'Auto Comprehensive Claim',
      category: 'auto',
      typicalDocuments: ['Police report', 'Photos', 'Repair estimate'],
      commonDenialReasons: ['Wear and tear', 'Mechanical failure', 'Pre-existing damage'],
      requiresAdjuster: true
    },
    'health_medical': {
      name: 'Health Insurance Medical Claim',
      category: 'health',
      typicalDocuments: ['Medical records', 'Bills', 'Explanation of Benefits (EOB)'],
      commonDenialReasons: ['Not medically necessary', 'Pre-authorization required', 'Out of network', 'Experimental treatment'],
      requiresAdjuster: false
    },
    'health_prescription': {
      name: 'Health Insurance Prescription Claim',
      category: 'health',
      typicalDocuments: ['Prescription', 'Medical necessity letter', 'Formulary exception request'],
      commonDenialReasons: ['Not on formulary', 'Step therapy required', 'Quantity limits', 'Prior authorization needed'],
      requiresAdjuster: false
    }
  };
  
  return metadata[claimType] || null;
}

/**
 * Determine if claim requires immediate escalation based on classification alone
 * @param {Object} classification - Validated classification
 * @returns {Object} - Escalation recommendation
 */
function checkClassificationEscalation(classification) {
  const escalationReasons = [];
  
  // Commercial + high value = attorney recommended
  if (classification.isCommercial && classification.isHighValue) {
    escalationReasons.push('Commercial claim over $25,000 typically requires attorney review');
  }
  
  // Any claim over $50k
  if (classification.claimAmount === 'over_50k') {
    escalationReasons.push('Claims over $50,000 should be reviewed by an attorney');
  }
  
  // Third-party high-value claims
  if (classification.isThirdParty && classification.isHighValue) {
    escalationReasons.push('Third-party claims over $25,000 involve complex liability issues');
  }
  
  return {
    requiresEscalation: escalationReasons.length > 0,
    reasons: escalationReasons,
    severity: escalationReasons.length > 0 ? 'high' : 'normal'
  };
}

module.exports = {
  classifyClaim,
  getClaimTypeMetadata,
  checkClassificationEscalation,
  VALID_CLAIM_TYPES,
  VALID_PARTY_TYPES,
  VALID_CONTEXTS,
  VALID_AMOUNTS
};

