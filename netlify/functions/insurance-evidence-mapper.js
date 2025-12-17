/**
 * INSURANCE EVIDENCE CONTAINMENT SYSTEM
 * 
 * CRITICAL: Prevents over-disclosure of documents and information.
 * 
 * DEFAULT RULE: SUMMARIZE, DO NOT ATTACH
 * 
 * Attach documents ONLY if:
 * 1. Explicitly requested by insurer
 * 2. Required by policy or law
 * 3. Directly relevant to specific denial reason
 * 
 * NEVER attach:
 * - Unrequested documents
 * - Irrelevant information
 * - Unredacted sensitive information
 * - Documents that could harm claim
 */

/**
 * Document types and risk levels
 */
const DOCUMENT_TYPES = {
  // LOW RISK - Generally safe to provide when requested
  POLICY_DOCUMENTS: {
    risk: 'low',
    examples: ['Insurance policy', 'Declarations page', 'Policy endorsements'],
    guidance: 'Provide copy of relevant policy sections when requested'
  },
  
  CLAIM_FORMS: {
    risk: 'low',
    examples: ['Proof of loss', 'Claim form', 'ACORD forms'],
    guidance: 'Complete only requested fields, do not volunteer additional information'
  },
  
  RECEIPTS_INVOICES: {
    risk: 'low',
    examples: ['Purchase receipts', 'Repair invoices', 'Rental receipts'],
    guidance: 'Provide only for items directly related to claim'
  },
  
  // MEDIUM RISK - Provide with caution
  PHOTOS_VIDEOS: {
    risk: 'medium',
    examples: ['Damage photos', 'Scene photos', 'Video documentation'],
    guidance: 'Provide only photos/videos that show damage or loss. Do not include photos that could show pre-existing conditions or unrelated issues.',
    warnings: ['Review all photos for unintended content', 'Ensure photos show only claimed damage', 'Do not include photos from before incident unless specifically requested']
  },
  
  ESTIMATES_APPRAISALS: {
    risk: 'medium',
    examples: ['Repair estimates', 'Property appraisals', 'Vehicle valuations'],
    guidance: 'Provide independent estimates when disputing insurer valuation',
    warnings: ['Ensure estimates are from licensed professionals', 'Do not provide estimates that undervalue your claim']
  },
  
  POLICE_REPORTS: {
    risk: 'medium',
    examples: ['Police report', 'Accident report', 'Fire department report'],
    guidance: 'Provide when requested or when it supports your claim',
    warnings: ['Review report for accuracy before submitting', 'Report may contain statements that could be used against you']
  },
  
  CORRESPONDENCE: {
    risk: 'medium',
    examples: ['Previous letters', 'Email exchanges', 'Text messages'],
    guidance: 'Provide only specific correspondence that is requested',
    warnings: ['Review all correspondence before submitting', 'Do not provide correspondence that contains admissions or harmful statements']
  },
  
  // HIGH RISK - Provide only with professional guidance
  MEDICAL_RECORDS: {
    risk: 'high',
    examples: ['Medical records', 'Treatment notes', 'Diagnostic reports'],
    guidance: 'REDACT unrelated medical information. Provide only records directly related to claimed injury.',
    warnings: [
      'HIPAA privacy concerns',
      'Unrelated medical history can be used to deny claim',
      'Pre-existing conditions may be discovered',
      'Consider having attorney review before submitting'
    ],
    redactionRequired: true
  },
  
  FINANCIAL_RECORDS: {
    risk: 'high',
    examples: ['Tax returns', 'Bank statements', 'Pay stubs', 'Business records'],
    guidance: 'REDACT unrelated financial information. Provide only specific records requested.',
    warnings: [
      'Privacy concerns',
      'Unrelated financial information can be misused',
      'May reveal information harmful to claim',
      'Consider having attorney review before submitting'
    ],
    redactionRequired: true
  },
  
  STATEMENTS: {
    risk: 'high',
    examples: ['Written statements', 'Witness statements', 'Affidavits'],
    guidance: 'DO NOT provide statements without professional review. Statements can be used against you.',
    warnings: [
      'Statements are difficult to retract',
      'Inconsistencies can destroy claim',
      'May inadvertently admit fault or waive rights',
      'Consult attorney before providing any statement'
    ]
  },
  
  EMPLOYMENT_RECORDS: {
    risk: 'high',
    examples: ['Employment records', 'Time sheets', 'Disability forms'],
    guidance: 'Provide only if directly relevant to lost wages claim. REDACT unrelated information.',
    warnings: [
      'Privacy concerns',
      'May reveal information used to challenge claim',
      'Redact unrelated employment issues'
    ],
    redactionRequired: true
  },
  
  // CRITICAL RISK - DO NOT PROVIDE without attorney
  SOCIAL_MEDIA: {
    risk: 'critical',
    examples: ['Facebook posts', 'Instagram photos', 'Twitter posts'],
    guidance: 'DO NOT PROVIDE. Social media content is frequently used to deny claims.',
    warnings: [
      'Social media is the #1 source of claim denials',
      'Posts can be taken out of context',
      'Photos may contradict injury claims',
      'DO NOT provide without attorney review'
    ]
  },
  
  PERSONAL_JOURNALS: {
    risk: 'critical',
    examples: ['Diaries', 'Personal notes', 'Journal entries'],
    guidance: 'DO NOT PROVIDE. Personal writings often contain admissions or harmful statements.',
    warnings: [
      'May contain admissions of fault',
      'May contradict claim statements',
      'Privacy invasion',
      'DO NOT provide without attorney review'
    ]
  }
};

/**
 * Evaluate whether document should be provided
 * @param {string} documentType - Type of document
 * @param {boolean} explicitlyRequested - Was this document explicitly requested?
 * @param {string} claimPhase - Current phase of claim
 * @returns {Object} - Recommendation
 */
function evaluateDocumentProvision(documentType, explicitlyRequested, claimPhase) {
  const docConfig = DOCUMENT_TYPES[documentType];
  
  if (!docConfig) {
    return {
      shouldProvide: false,
      reason: 'Unknown document type - consult professional before providing',
      risk: 'high'
    };
  }
  
  // Critical risk documents - never provide without attorney
  if (docConfig.risk === 'critical') {
    return {
      shouldProvide: false,
      reason: 'This document type should NOT be provided without attorney review',
      risk: 'critical',
      warnings: docConfig.warnings
    };
  }
  
  // High risk documents - only if explicitly requested and with redaction
  if (docConfig.risk === 'high') {
    if (!explicitlyRequested) {
      return {
        shouldProvide: false,
        reason: 'Do not provide this document unless explicitly requested',
        risk: 'high',
        warnings: ['Do not volunteer high-risk documents']
      };
    }
    
    return {
      shouldProvide: true,
      reason: 'Document was explicitly requested',
      risk: 'high',
      requiresRedaction: docConfig.redactionRequired || false,
      guidance: docConfig.guidance,
      warnings: docConfig.warnings
    };
  }
  
  // Medium risk - provide if requested or relevant
  if (docConfig.risk === 'medium') {
    if (explicitlyRequested) {
      return {
        shouldProvide: true,
        reason: 'Document was explicitly requested',
        risk: 'medium',
        guidance: docConfig.guidance,
        warnings: docConfig.warnings || []
      };
    }
    
    return {
      shouldProvide: false,
      reason: 'Only provide if explicitly requested or clearly relevant',
      risk: 'medium',
      guidance: 'Consider whether this document strengthens your claim before providing'
    };
  }
  
  // Low risk - generally safe when requested
  if (docConfig.risk === 'low') {
    return {
      shouldProvide: explicitlyRequested,
      reason: explicitlyRequested ? 'Document requested and low risk' : 'Not requested',
      risk: 'low',
      guidance: docConfig.guidance
    };
  }
  
  return {
    shouldProvide: false,
    reason: 'Default to not providing unless explicitly required',
    risk: 'medium'
  };
}

/**
 * Generate evidence checklist based on claim type and phase
 * @param {string} claimType - Type of claim
 * @param {string} phase - Current phase
 * @param {string} denialReason - Reason for denial (if applicable)
 * @returns {Object} - Evidence checklist
 */
function generateEvidenceChecklist(claimType, phase, denialReason = null) {
  const checklist = {
    required: [],
    recommended: [],
    doNotProvide: [],
    warnings: []
  };
  
  // Property claims
  if (claimType.startsWith('property_')) {
    if (phase === 'information_request' || phase === 'denial') {
      checklist.required.push({
        item: 'Photos of damage',
        type: 'PHOTOS_VIDEOS',
        notes: 'Only photos showing claimed damage'
      });
      
      checklist.recommended.push({
        item: 'Repair estimates',
        type: 'ESTIMATES_APPRAISALS',
        notes: 'From licensed contractors'
      });
      
      if (denialReason && denialReason.includes('proof of ownership')) {
        checklist.required.push({
          item: 'Receipts or proof of ownership',
          type: 'RECEIPTS_INVOICES',
          notes: 'For claimed items only'
        });
      }
    }
    
    checklist.doNotProvide.push({
      item: 'Photos of entire property',
      reason: 'May show pre-existing conditions or unrelated issues'
    });
    
    checklist.doNotProvide.push({
      item: 'Maintenance records (unless requested)',
      reason: 'May suggest maintenance issues or pre-existing problems'
    });
  }
  
  // Auto claims
  if (claimType.startsWith('auto_')) {
    if (phase === 'information_request' || phase === 'denial') {
      checklist.required.push({
        item: 'Police report (if available)',
        type: 'POLICE_REPORTS',
        notes: 'Review for accuracy first'
      });
      
      checklist.required.push({
        item: 'Photos of vehicle damage',
        type: 'PHOTOS_VIDEOS',
        notes: 'All angles of damage'
      });
      
      checklist.recommended.push({
        item: 'Repair estimate',
        type: 'ESTIMATES_APPRAISALS',
        notes: 'From licensed repair shop'
      });
    }
    
    checklist.doNotProvide.push({
      item: 'Photos showing pre-existing damage',
      reason: 'Can be used to deny claim'
    });
    
    checklist.doNotProvide.push({
      item: 'Social media posts about accident',
      reason: 'Can be taken out of context'
    });
  }
  
  // Health claims
  if (claimType.startsWith('health_')) {
    if (phase === 'information_request' || phase === 'denial') {
      checklist.required.push({
        item: 'Medical records (REDACTED)',
        type: 'MEDICAL_RECORDS',
        notes: 'ONLY records related to this specific treatment. REDACT all unrelated medical history.'
      });
      
      if (denialReason && denialReason.includes('medical necessity')) {
        checklist.required.push({
          item: 'Letter of medical necessity from physician',
          type: 'CORRESPONDENCE',
          notes: 'Explaining why treatment is medically necessary'
        });
      }
    }
    
    checklist.warnings.push('REDACT all unrelated medical information before submitting');
    checklist.warnings.push('Do not provide complete medical history');
    checklist.warnings.push('Consider having attorney review medical records before submission');
    
    checklist.doNotProvide.push({
      item: 'Complete medical history',
      reason: 'Privacy violation and may reveal pre-existing conditions'
    });
    
    checklist.doNotProvide.push({
      item: 'Mental health records (unless directly related)',
      reason: 'Privacy concerns and potential discrimination'
    });
  }
  
  // Universal warnings
  checklist.warnings.push('Do not provide documents that were not requested');
  checklist.warnings.push('Do not volunteer additional information');
  checklist.warnings.push('Keep cover letter brief and factual');
  checklist.warnings.push('Send via certified mail with return receipt');
  
  return checklist;
}

/**
 * Generate redaction guidance
 * @param {string} documentType - Type of document requiring redaction
 * @returns {Object} - Redaction instructions
 */
function getRedactionGuidance(documentType) {
  const guidance = {
    MEDICAL_RECORDS: {
      redact: [
        'Unrelated medical conditions',
        'Pre-existing conditions not related to claim',
        'Mental health information (unless directly relevant)',
        'Substance use history (unless directly relevant)',
        'Family medical history',
        'Genetic information',
        'HIV status',
        'Reproductive health (unless directly relevant)'
      ],
      keep: [
        'Diagnosis related to claimed injury/condition',
        'Treatment dates and providers',
        'Treatment plan for claimed condition',
        'Prognosis for claimed condition',
        'Work restrictions related to claim'
      ],
      method: 'Use black marker or digital redaction tool. Ensure redacted information is completely illegible.'
    },
    
    FINANCIAL_RECORDS: {
      redact: [
        'Account numbers (show last 4 digits only)',
        'Social Security Number (show last 4 digits only)',
        'Unrelated transactions',
        'Unrelated income sources',
        'Personal purchases',
        'Other insurance policies (unless relevant)'
      ],
      keep: [
        'Income related to lost wages claim',
        'Expenses related to claim',
        'Relevant account balances',
        'Relevant transaction dates'
      ],
      method: 'Use black marker or digital redaction tool. Ensure redacted information is completely illegible.'
    },
    
    EMPLOYMENT_RECORDS: {
      redact: [
        'Social Security Number (show last 4 digits only)',
        'Unrelated disciplinary actions',
        'Unrelated performance reviews',
        'Salary information (unless relevant to claim)',
        'Benefits information (unless relevant)',
        'Coworker information'
      ],
      keep: [
        'Employment dates',
        'Job title and duties',
        'Work schedule related to claim',
        'Lost wages calculation',
        'Return to work information'
      ],
      method: 'Use black marker or digital redaction tool. Ensure redacted information is completely illegible.'
    }
  };
  
  return guidance[documentType] || {
    redact: ['All sensitive and unrelated information'],
    keep: ['Only information directly relevant to your claim'],
    method: 'Use black marker or digital redaction tool. Ensure redacted information is completely illegible.'
  };
}

module.exports = {
  evaluateDocumentProvision,
  generateEvidenceChecklist,
  getRedactionGuidance,
  DOCUMENT_TYPES
};

