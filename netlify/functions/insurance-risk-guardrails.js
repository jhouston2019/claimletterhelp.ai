/**
 * INSURANCE RISK GUARDRAILS ENGINE
 * 
 * ⚠️ SAFETY LOCK — DO NOT MODIFY ⚠️
 * This system intentionally refuses certain scenarios.
 * Removing guardrails constitutes a safety regression.
 * 
 * CRITICAL SAFETY SYSTEM
 * 
 * This module enforces hard stops for dangerous scenarios.
 * When triggered, system MUST refuse to generate output.
 * 
 * HARD STOP CONDITIONS:
 * - Fraud investigations
 * - EUO requests
 * - Recorded statement requests
 * - Reservation of rights
 * - Bad faith allegations
 * - Attorney involvement
 * - Litigation threats
 * - High-risk commercial claims
 * - Subrogation disputes
 * - Coverage disputes
 * 
 * REGRESSION WARNING:
 * This file enforces safety boundaries.
 * Any loosening increases user harm risk.
 * 
 * allowSelfResponse = false → NO OUTPUT
 * escalationRequired = true → ATTORNEY REQUIRED
 */

/**
 * Risk levels
 */
const RISK_LEVELS = {
  SAFE: 'safe',
  CAUTION: 'caution',
  HIGH_RISK: 'high_risk',
  CRITICAL: 'critical',
  HARD_STOP: 'hard_stop'
};

/**
 * Hard stop conditions
 */
const HARD_STOP_CONDITIONS = {
  FRAUD: {
    code: 'FRAUD_INVESTIGATION',
    message: 'This letter indicates a fraud investigation or misrepresentation inquiry. You MUST consult an attorney before responding. Any statements you make can be used against you and may result in claim denial, policy cancellation, or criminal charges.',
    severity: 'critical',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  EUO: {
    code: 'EUO_REQUEST',
    message: 'This letter requests an Examination Under Oath (EUO). You MUST have attorney representation. EUO testimony is given under oath and can be used against you. Do not attend an EUO without legal counsel.',
    severity: 'critical',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  RECORDED_STATEMENT: {
    code: 'RECORDED_STATEMENT_REQUEST',
    message: 'This letter requests a recorded statement. You MUST consult an attorney before providing any recorded statement. Recorded statements can be used against you and may harm your claim.',
    severity: 'critical',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  RESERVATION_OF_RIGHTS: {
    code: 'RESERVATION_OF_RIGHTS',
    message: 'This is a Reservation of Rights letter. This means the insurance company is questioning whether your claim is covered under your policy. You MUST consult an insurance coverage attorney to understand your rights and the implications.',
    severity: 'critical',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  LITIGATION: {
    code: 'LITIGATION_INVOLVED',
    message: 'This letter involves attorneys, legal counsel, or litigation. You MUST have legal representation. Do not respond without consulting an attorney.',
    severity: 'critical',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  BAD_FAITH: {
    code: 'BAD_FAITH_ALLEGATIONS',
    message: 'This letter involves bad faith allegations or serious coverage disputes. You MUST consult an attorney who specializes in insurance bad faith claims.',
    severity: 'critical',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  COMMERCIAL_HIGH_VALUE: {
    code: 'COMMERCIAL_HIGH_VALUE',
    message: 'This is a commercial claim over $25,000. Commercial insurance claims of this value typically involve complex policy language and legal issues. You should consult an attorney or commercial insurance specialist.',
    severity: 'high',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  PERSONAL_VERY_HIGH_VALUE: {
    code: 'PERSONAL_VERY_HIGH_VALUE',
    message: 'This claim is over $50,000. Claims of this value should be reviewed by an attorney to ensure you receive appropriate compensation and do not inadvertently waive rights.',
    severity: 'high',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  SUBROGATION: {
    code: 'SUBROGATION_DISPUTE',
    message: 'This letter involves subrogation or recovery actions. These involve complex legal issues regarding liability and recovery. You should consult an attorney.',
    severity: 'high',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  COVERAGE_DISPUTE: {
    code: 'COVERAGE_DISPUTE',
    message: 'This letter involves a coverage dispute or policy interpretation issue. You should consult an insurance coverage attorney to understand your rights.',
    severity: 'high',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: true
  },
  
  UNKNOWN_PHASE: {
    code: 'UNKNOWN_PHASE',
    message: 'The system cannot determine the type or phase of this letter. For your protection, you should have this letter reviewed by an attorney or insurance professional before responding.',
    severity: 'high',
    allowSelfResponse: false,
    escalationRequired: true,
    requiresAttorney: false
  }
};

/**
 * Evaluate risk and determine if hard stop is required
 * @param {Object} params - Risk evaluation parameters
 * @returns {Object} - Risk assessment with hard stop decision
 */
function evaluateRisk(params) {
  const {
    phase,
    classification,
    userChecks,
    letterText
  } = params;
  
  const triggeredConditions = [];
  let highestSeverity = RISK_LEVELS.SAFE;
  
  // Check phase-based hard stops
  if (phase.phase === 'fraud_investigation') {
    triggeredConditions.push(HARD_STOP_CONDITIONS.FRAUD);
    highestSeverity = RISK_LEVELS.HARD_STOP;
  }
  
  if (phase.phase === 'euo_request') {
    triggeredConditions.push(HARD_STOP_CONDITIONS.EUO);
    highestSeverity = RISK_LEVELS.HARD_STOP;
  }
  
  if (phase.phase === 'recorded_statement') {
    triggeredConditions.push(HARD_STOP_CONDITIONS.RECORDED_STATEMENT);
    highestSeverity = RISK_LEVELS.HARD_STOP;
  }
  
  if (phase.phase === 'reservation_of_rights') {
    triggeredConditions.push(HARD_STOP_CONDITIONS.RESERVATION_OF_RIGHTS);
    highestSeverity = RISK_LEVELS.HARD_STOP;
  }
  
  if (phase.phase === 'litigation') {
    triggeredConditions.push(HARD_STOP_CONDITIONS.LITIGATION);
    highestSeverity = RISK_LEVELS.HARD_STOP;
  }
  
  if (phase.phase === 'unknown') {
    triggeredConditions.push(HARD_STOP_CONDITIONS.UNKNOWN_PHASE);
    highestSeverity = RISK_LEVELS.HARD_STOP;
  }
  
  // Check user-provided indicators
  if (userChecks) {
    if (userChecks.fraud) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.FRAUD);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
    if (userChecks.euo) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.EUO);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
    if (userChecks.recordedStatement) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.RECORDED_STATEMENT);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
    if (userChecks.reservation) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.RESERVATION_OF_RIGHTS);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
    if (userChecks.attorney) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.LITIGATION);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
    if (userChecks.badFaith) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.BAD_FAITH);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
  }
  
  // Check classification-based hard stops
  if (classification) {
    // Commercial + high value
    if (classification.isCommercial && classification.isHighValue) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.COMMERCIAL_HIGH_VALUE);
      if (highestSeverity !== RISK_LEVELS.HARD_STOP) {
        highestSeverity = RISK_LEVELS.HIGH_RISK;
      }
    }
    
    // Any claim over $50k
    if (classification.claimAmount === 'over_50k') {
      triggeredConditions.push(HARD_STOP_CONDITIONS.PERSONAL_VERY_HIGH_VALUE);
      if (highestSeverity !== RISK_LEVELS.HARD_STOP) {
        highestSeverity = RISK_LEVELS.HIGH_RISK;
      }
    }
  }
  
  // Check letter text for additional risk indicators
  if (letterText) {
    const lowerText = letterText.toLowerCase();
    
    // Subrogation
    if (lowerText.includes('subrogation') || lowerText.includes('recovery') || lowerText.includes('reimbursement')) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.SUBROGATION);
      if (highestSeverity === RISK_LEVELS.SAFE) {
        highestSeverity = RISK_LEVELS.HIGH_RISK;
      }
    }
    
    // Coverage dispute
    if (lowerText.includes('coverage dispute') || lowerText.includes('policy interpretation') || lowerText.includes('coverage question')) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.COVERAGE_DISPUTE);
      if (highestSeverity === RISK_LEVELS.SAFE) {
        highestSeverity = RISK_LEVELS.HIGH_RISK;
      }
    }
    
    // Bad faith indicators
    if (lowerText.includes('bad faith') || lowerText.includes('unfair claim practice')) {
      triggeredConditions.push(HARD_STOP_CONDITIONS.BAD_FAITH);
      highestSeverity = RISK_LEVELS.HARD_STOP;
    }
  }
  
  // Determine if hard stop is required
  const hardStop = triggeredConditions.length > 0;
  const allowSelfResponse = !hardStop;
  const escalationRequired = hardStop;
  const requiresAttorney = triggeredConditions.some(c => c.requiresAttorney);
  
  return {
    hardStop,
    allowSelfResponse,
    escalationRequired,
    requiresAttorney,
    riskLevel: highestSeverity,
    triggeredConditions,
    primaryCondition: triggeredConditions[0] || null,
    message: triggeredConditions.length > 0 
      ? triggeredConditions[0].message 
      : 'No hard stop conditions detected.',
    allMessages: triggeredConditions.map(c => c.message)
  };
}

/**
 * Get risk-appropriate guidance
 */
function getRiskGuidance(riskAssessment) {
  if (riskAssessment.hardStop) {
    return {
      canProceed: false,
      recommendation: 'STOP - Professional representation required',
      actions: [
        'Do not respond to this letter without professional guidance',
        'Contact an attorney immediately',
        'Do not provide any statements or information',
        'Preserve all documentation'
      ],
      warnings: [
        'Self-response may harm your claim',
        'Legal or financial consequences possible',
        'Professional representation is critical'
      ]
    };
  }
  
  if (riskAssessment.riskLevel === RISK_LEVELS.HIGH_RISK) {
    return {
      canProceed: false,
      recommendation: 'Professional consultation strongly recommended',
      actions: [
        'Consult with an attorney or insurance professional',
        'Do not respond without professional review',
        'Understand your rights and obligations'
      ],
      warnings: [
        'This situation involves complex issues',
        'Self-response carries significant risk',
        'Professional guidance recommended'
      ]
    };
  }
  
  return {
    canProceed: true,
    recommendation: 'Procedural response may be appropriate',
    actions: [
      'Review the analysis carefully',
      'Provide only requested information',
      'Keep response brief and factual',
      'Do not over-disclose'
    ],
    warnings: [
      'Do not provide narrative explanations',
      'Do not volunteer additional information',
      'Consider professional review for complex situations'
    ]
  };
}

/**
 * Format hard stop message for display
 */
function formatHardStopMessage(riskAssessment) {
  if (!riskAssessment.hardStop) {
    return null;
  }
  
  const primaryCondition = riskAssessment.primaryCondition;
  
  return {
    title: '⛔ PROFESSIONAL REPRESENTATION REQUIRED',
    code: primaryCondition.code,
    severity: primaryCondition.severity,
    message: primaryCondition.message,
    additionalConditions: riskAssessment.triggeredConditions.slice(1).map(c => c.message),
    actions: [
      'Contact an attorney immediately',
      'Do not respond without professional guidance',
      'Do not provide statements or information',
      'Preserve all documentation'
    ],
    resources: [
      'State Bar Association - Attorney referral',
      'Insurance Commissioner - Consumer assistance',
      'Legal Aid - If you qualify for free legal help'
    ]
  };
}

module.exports = {
  evaluateRisk,
  getRiskGuidance,
  formatHardStopMessage,
  HARD_STOP_CONDITIONS,
  RISK_LEVELS
};

