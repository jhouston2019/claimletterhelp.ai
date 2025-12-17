/**
 * CLAIM PHASE DETECTION ENGINE
 * 
 * Detects and classifies the phase of insurance correspondence.
 * CRITICAL: Phase must be determined before any response generation.
 * 
 * PHASES:
 * - initial_claim: First claim submission
 * - information_request: Insurer requesting additional information
 * - denial: Claim denied
 * - partial_payment: Claim partially paid, disputing amount
 * - appeal: Formal appeal of denial
 * - reservation_of_rights: ROF letter (HARD STOP)
 * - euo_request: Examination Under Oath request (HARD STOP)
 * - recorded_statement: Recorded statement request (HARD STOP)
 * - fraud_investigation: Fraud/misrepresentation inquiry (HARD STOP)
 * - litigation: Attorney involved or litigation threatened (HARD STOP)
 * - unknown: Cannot determine phase (STOP)
 */

/**
 * Phase detection patterns
 */
const PHASE_PATTERNS = {
  // HARD STOP PHASES
  fraud_investigation: {
    keywords: [
      'fraud',
      'misrepresentation',
      'false statement',
      'material misrepresentation',
      'fraudulent claim',
      'investigation',
      'special investigation unit',
      'SIU'
    ],
    weight: 10, // Highest priority
    hardStop: true,
    requiresAttorney: true
  },
  
  euo_request: {
    keywords: [
      'examination under oath',
      'EUO',
      'sworn statement',
      'under oath',
      'examination',
      'deposition'
    ],
    weight: 10,
    hardStop: true,
    requiresAttorney: true
  },
  
  recorded_statement: {
    keywords: [
      'recorded statement',
      'recorded interview',
      'statement under oath',
      'tape recorded',
      'record your statement'
    ],
    weight: 10,
    hardStop: true,
    requiresAttorney: true
  },
  
  reservation_of_rights: {
    keywords: [
      'reservation of rights',
      'reserve our rights',
      'reserving rights',
      'without waiving',
      'without prejudice to our rights'
    ],
    weight: 10,
    hardStop: true,
    requiresAttorney: true
  },
  
  litigation: {
    keywords: [
      'attorney',
      'lawyer',
      'legal counsel',
      'litigation',
      'lawsuit',
      'legal action',
      'court',
      'arbitration',
      'mediation'
    ],
    weight: 10,
    hardStop: true,
    requiresAttorney: true
  },
  
  // NORMAL PHASES
  denial: {
    keywords: [
      'denied',
      'denial',
      'cannot approve',
      'unable to pay',
      'claim is denied',
      'we are denying',
      'not covered',
      'excluded',
      'policy does not cover'
    ],
    weight: 8,
    hardStop: false,
    requiresAttorney: false
  },
  
  partial_payment: {
    keywords: [
      'partial payment',
      'underpayment',
      'depreciation',
      'actual cash value',
      'ACV',
      'settlement offer',
      'we have paid',
      'payment enclosed'
    ],
    weight: 7,
    hardStop: false,
    requiresAttorney: false
  },
  
  information_request: {
    keywords: [
      'additional information',
      'please provide',
      'we need',
      'required documents',
      'submit',
      'documentation needed',
      'proof of loss',
      'supporting documents'
    ],
    weight: 6,
    hardStop: false,
    requiresAttorney: false
  },
  
  appeal: {
    keywords: [
      'appeal',
      'reconsideration',
      'review',
      'dispute',
      'contest',
      'appeal rights',
      'internal appeal',
      'external review'
    ],
    weight: 7,
    hardStop: false,
    requiresAttorney: false
  },
  
  initial_claim: {
    keywords: [
      'received your claim',
      'claim number',
      'assigned to',
      'adjuster',
      'processing your claim',
      'claim has been opened'
    ],
    weight: 5,
    hardStop: false,
    requiresAttorney: false
  }
};

/**
 * Detect phase from letter text
 * @param {string} letterText - Extracted text from letter
 * @param {Object} userChecks - User-provided checkboxes for hard stops
 * @returns {Object} - Detected phase and metadata
 */
function detectPhase(letterText, userChecks = {}) {
  if (!letterText || typeof letterText !== 'string') {
    return {
      phase: 'unknown',
      confidence: 0,
      hardStop: true,
      reason: 'No letter text provided',
      requiresAttorney: false
    };
  }
  
  const lowerText = letterText.toLowerCase();
  const phaseScores = {};
  
  // Check user-provided hard stop indicators first
  if (userChecks.fraud) {
    return createPhaseResult('fraud_investigation', 100, true);
  }
  if (userChecks.euo) {
    return createPhaseResult('euo_request', 100, true);
  }
  if (userChecks.recordedStatement) {
    return createPhaseResult('recorded_statement', 100, true);
  }
  if (userChecks.reservation) {
    return createPhaseResult('reservation_of_rights', 100, true);
  }
  if (userChecks.attorney) {
    return createPhaseResult('litigation', 100, true);
  }
  if (userChecks.badFaith) {
    return createPhaseResult('litigation', 100, true);
  }
  
  // Scan text for phase patterns
  for (const [phase, config] of Object.entries(PHASE_PATTERNS)) {
    let score = 0;
    let matchedKeywords = [];
    
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += config.weight;
        matchedKeywords.push(keyword);
      }
    }
    
    if (score > 0) {
      phaseScores[phase] = {
        score,
        matchedKeywords,
        hardStop: config.hardStop,
        requiresAttorney: config.requiresAttorney
      };
    }
  }
  
  // No matches found
  if (Object.keys(phaseScores).length === 0) {
    return {
      phase: 'unknown',
      confidence: 0,
      hardStop: true,
      reason: 'Cannot determine letter phase. Manual review required.',
      requiresAttorney: true
    };
  }
  
  // Find highest scoring phase
  const sortedPhases = Object.entries(phaseScores).sort((a, b) => b[1].score - a[1].score);
  const [topPhase, topScore] = sortedPhases[0];
  
  // Calculate confidence (0-100)
  const maxPossibleScore = PHASE_PATTERNS[topPhase].keywords.length * PHASE_PATTERNS[topPhase].weight;
  const confidence = Math.min(100, Math.round((topScore.score / maxPossibleScore) * 100));
  
  return {
    phase: topPhase,
    confidence,
    hardStop: topScore.hardStop,
    requiresAttorney: topScore.requiresAttorney,
    matchedKeywords: topScore.matchedKeywords,
    reason: getPhaseDescription(topPhase)
  };
}

/**
 * Create standardized phase result
 */
function createPhaseResult(phase, confidence, hardStop) {
  const config = PHASE_PATTERNS[phase];
  return {
    phase,
    confidence,
    hardStop,
    requiresAttorney: config.requiresAttorney,
    reason: getPhaseDescription(phase)
  };
}

/**
 * Get human-readable phase description
 */
function getPhaseDescription(phase) {
  const descriptions = {
    fraud_investigation: 'This letter indicates a fraud investigation. You MUST consult an attorney before responding.',
    euo_request: 'This is an Examination Under Oath (EUO) request. You MUST have attorney representation.',
    recorded_statement: 'This is a recorded statement request. You MUST consult an attorney before providing any statement.',
    reservation_of_rights: 'This is a Reservation of Rights letter. You MUST consult an attorney to understand your coverage.',
    litigation: 'This letter involves legal counsel or litigation. You MUST have attorney representation.',
    denial: 'This appears to be a claim denial letter. You may have appeal rights.',
    partial_payment: 'This appears to be a partial payment or underpayment issue.',
    information_request: 'This appears to be a request for additional information or documentation.',
    appeal: 'This appears to be related to an appeal or reconsideration process.',
    initial_claim: 'This appears to be an initial claim acknowledgment or assignment letter.',
    unknown: 'Cannot determine the phase of this letter. Manual review required.'
  };
  
  return descriptions[phase] || 'Unknown phase';
}

/**
 * Get phase-specific guidance
 */
function getPhaseGuidance(phase, claimType) {
  const guidance = {
    denial: {
      canRespond: true,
      timeframe: '30-60 days (check your policy)',
      nextSteps: [
        'Review denial reason carefully',
        'Check policy language for coverage',
        'Gather supporting documentation',
        'Consider formal appeal if denial is incorrect'
      ],
      warnings: [
        'Do not provide additional narrative beyond what is requested',
        'Do not admit fault or make statements that could harm your claim',
        'Keep responses factual and brief'
      ]
    },
    
    information_request: {
      canRespond: true,
      timeframe: '10-30 days (check letter for specific deadline)',
      nextSteps: [
        'Provide ONLY the specific documents requested',
        'Do not volunteer additional information',
        'Keep cover letter brief and factual',
        'Send via certified mail with tracking'
      ],
      warnings: [
        'Do not provide documents that were not requested',
        'Do not include explanatory narratives',
        'Do not over-disclose'
      ]
    },
    
    partial_payment: {
      canRespond: true,
      timeframe: 'Varies by policy and state',
      nextSteps: [
        'Document your disagreement with valuation',
        'Obtain independent estimates if applicable',
        'Review policy coverage limits',
        'Consider formal dispute process'
      ],
      warnings: [
        'Do not accept payment if you disagree with amount',
        'Accepting payment may waive further claims',
        'Review settlement language carefully'
      ]
    },
    
    fraud_investigation: {
      canRespond: false,
      timeframe: 'N/A - Attorney required',
      nextSteps: [
        'Contact an insurance defense attorney IMMEDIATELY',
        'Do not respond to the insurance company',
        'Do not provide any statements',
        'Preserve all documentation'
      ],
      warnings: [
        'Anything you say can be used against you',
        'Fraud allegations can result in criminal charges',
        'Policy cancellation and claim denial are likely',
        'You need legal representation'
      ]
    },
    
    euo_request: {
      canRespond: false,
      timeframe: 'N/A - Attorney required',
      nextSteps: [
        'Contact an insurance attorney IMMEDIATELY',
        'Do not attend EUO without attorney present',
        'Do not provide any statements before consulting attorney',
        'Prepare thoroughly with legal counsel'
      ],
      warnings: [
        'EUO testimony is under oath and can be used against you',
        'Inconsistent statements can destroy your claim',
        'You have the right to attorney representation',
        'Do not proceed without legal counsel'
      ]
    },
    
    recorded_statement: {
      canRespond: false,
      timeframe: 'N/A - Attorney consultation required',
      nextSteps: [
        'Consult an attorney before providing any statement',
        'You are not required to provide a recorded statement',
        'If you choose to proceed, have attorney present',
        'Review your rights under your policy'
      ],
      warnings: [
        'Recorded statements can be used against you',
        'You may inadvertently harm your claim',
        'You have the right to decline',
        'Consult an attorney first'
      ]
    },
    
    reservation_of_rights: {
      canRespond: false,
      timeframe: 'N/A - Attorney required',
      nextSteps: [
        'Contact an insurance coverage attorney IMMEDIATELY',
        'Do not respond without legal advice',
        'Understand what rights are being reserved',
        'This may indicate coverage dispute'
      ],
      warnings: [
        'Reservation of rights means insurer may deny coverage',
        'Your policy coverage is in question',
        'You may need independent legal representation',
        'Do not proceed without attorney review'
      ]
    },
    
    litigation: {
      canRespond: false,
      timeframe: 'N/A - Attorney required',
      nextSteps: [
        'Contact an attorney IMMEDIATELY',
        'Do not communicate with other party',
        'Preserve all documentation',
        'Follow attorney guidance exclusively'
      ],
      warnings: [
        'Legal proceedings have strict rules and deadlines',
        'Self-representation is extremely risky',
        'You need legal representation',
        'Do not proceed without attorney'
      ]
    }
  };
  
  return guidance[phase] || {
    canRespond: false,
    timeframe: 'Unknown',
    nextSteps: ['Consult an attorney or insurance professional'],
    warnings: ['Cannot determine appropriate action without phase identification']
  };
}

module.exports = {
  detectPhase,
  getPhaseDescription,
  getPhaseGuidance,
  PHASE_PATTERNS
};

