/**
 * INSURANCE OUTPUT FORMATTER
 * 
 * Formats all system output with strict constraints.
 * 
 * PROHIBITIONS:
 * - NO empathy
 * - NO reassurance
 * - NO conversational tone
 * - NO "we understand"
 * - NO "this can be frustrating"
 * - NO emotional language
 * - NO persuasive framing
 * 
 * This is procedural containment, not comfort.
 */

/**
 * Prohibited phrases that must be removed from output
 */
const PROHIBITED_PHRASES = [
  // Empathy/Reassurance
  'we understand',
  'i understand',
  'we know how',
  'this must be',
  'we appreciate',
  'we sympathize',
  'we empathize',
  'don\'t worry',
  'rest assured',
  'you can trust',
  'we\'re here to help',
  'we\'re on your side',
  
  // Conversational
  'let\'s',
  'let us',
  'feel free to',
  'simply',
  'just',
  'easy',
  'quickly',
  
  // Persuasive
  'you deserve',
  'you should receive',
  'you are entitled',
  'fight for',
  'stand up for',
  'demand',
  'insist',
  
  // Emotional
  'unfortunately',
  'sadly',
  'happily',
  'fortunately',
  'frustrating',
  'stressful',
  'difficult time',
  'challenging situation',
  
  // Chatbot-like
  'how can i help',
  'what can i do',
  'tell me more',
  'i\'d be happy to',
  'i\'d love to'
];

/**
 * Format analysis output
 * @param {Object} analysis - Raw analysis data
 * @returns {string} - Formatted, procedural output
 */
function formatAnalysisOutput(analysis) {
  const {
    classification,
    phase,
    riskAssessment,
    denialReasons,
    policyReferences
  } = analysis;
  
  let output = '';
  
  // Classification section
  output += '=== CLAIM CLASSIFICATION ===\n\n';
  output += `Type: ${classification.claimType}\n`;
  output += `Party: ${classification.partyType}\n`;
  output += `Context: ${classification.claimContext}\n`;
  output += `Amount Range: ${classification.claimAmount}\n\n`;
  
  // Phase section
  output += '=== LETTER PHASE ===\n\n';
  output += `Phase: ${phase.phase}\n`;
  output += `Confidence: ${phase.confidence}%\n`;
  output += `Description: ${phase.reason}\n\n`;
  
  // Risk assessment
  output += '=== RISK ASSESSMENT ===\n\n';
  output += `Risk Level: ${riskAssessment.riskLevel}\n`;
  output += `Can Self-Respond: ${riskAssessment.allowSelfResponse ? 'Yes' : 'No'}\n`;
  output += `Attorney Required: ${riskAssessment.requiresAttorney ? 'Yes' : 'No'}\n\n`;
  
  if (riskAssessment.hardStop) {
    output += '⛔ HARD STOP TRIGGERED\n\n';
    output += `Reason: ${riskAssessment.message}\n\n`;
    output += 'You MUST consult an attorney before responding to this letter.\n';
    output += 'This system cannot generate a response for this scenario.\n\n';
  }
  
  // Denial reasons (if applicable)
  if (denialReasons && denialReasons.length > 0) {
    output += '=== DENIAL REASONS ===\n\n';
    denialReasons.forEach((reason, index) => {
      output += `${index + 1}. ${reason}\n`;
    });
    output += '\n';
  }
  
  // Policy references (if applicable)
  if (policyReferences && policyReferences.length > 0) {
    output += '=== POLICY REFERENCES ===\n\n';
    policyReferences.forEach((ref, index) => {
      output += `${index + 1}. ${ref}\n`;
    });
    output += '\n';
  }
  
  return sanitizeOutput(output);
}

/**
 * Format response letter output
 * @param {string} letterText - Generated letter text
 * @param {Object} metadata - Letter metadata
 * @returns {Object} - Formatted output with warnings
 */
function formatResponseOutput(letterText, metadata) {
  const sanitized = sanitizeOutput(letterText);
  
  return {
    letter: sanitized,
    metadata: {
      phase: metadata.phase,
      claimType: metadata.claimType,
      generatedDate: new Date().toISOString(),
      wordCount: sanitized.split(/\s+/).length,
      lineCount: sanitized.split('\n').length
    },
    warnings: [
      'Review this letter carefully before sending',
      'Do not modify to add narrative or explanations',
      'Send via certified mail with return receipt',
      'Keep copies of all correspondence',
      'Consider professional review for complex situations'
    ],
    prohibitions: [
      'Do not add emotional language',
      'Do not include additional documents not listed',
      'Do not volunteer information beyond what is requested',
      'Do not make admissions or speculative statements'
    ]
  };
}

/**
 * Format evidence checklist output
 * @param {Object} checklist - Evidence checklist
 * @returns {string} - Formatted checklist
 */
function formatEvidenceChecklist(checklist) {
  let output = '';
  
  output += '=== EVIDENCE CHECKLIST ===\n\n';
  
  if (checklist.required && checklist.required.length > 0) {
    output += 'REQUIRED DOCUMENTS:\n';
    checklist.required.forEach((item, index) => {
      output += `${index + 1}. ${item.item}\n`;
      if (item.notes) {
        output += `   Notes: ${item.notes}\n`;
      }
    });
    output += '\n';
  }
  
  if (checklist.recommended && checklist.recommended.length > 0) {
    output += 'RECOMMENDED DOCUMENTS:\n';
    checklist.recommended.forEach((item, index) => {
      output += `${index + 1}. ${item.item}\n`;
      if (item.notes) {
        output += `   Notes: ${item.notes}\n`;
      }
    });
    output += '\n';
  }
  
  if (checklist.doNotProvide && checklist.doNotProvide.length > 0) {
    output += 'DO NOT PROVIDE:\n';
    checklist.doNotProvide.forEach((item, index) => {
      output += `${index + 1}. ${item.item}\n`;
      output += `   Reason: ${item.reason}\n`;
    });
    output += '\n';
  }
  
  if (checklist.warnings && checklist.warnings.length > 0) {
    output += 'WARNINGS:\n';
    checklist.warnings.forEach((warning, index) => {
      output += `${index + 1}. ${warning}\n`;
    });
    output += '\n';
  }
  
  return sanitizeOutput(output);
}

/**
 * Format hard stop message
 * @param {Object} hardStopData - Hard stop information
 * @returns {Object} - Formatted hard stop message
 */
function formatHardStopMessage(hardStopData) {
  return {
    title: '⛔ PROFESSIONAL REPRESENTATION REQUIRED',
    severity: hardStopData.severity || 'critical',
    code: hardStopData.code,
    message: sanitizeOutput(hardStopData.message),
    canProceed: false,
    actions: [
      'Contact an attorney immediately',
      'Do not respond without professional guidance',
      'Do not provide statements or information to insurance company',
      'Preserve all documentation'
    ],
    resources: [
      'State Bar Association - Attorney referral service',
      'State Insurance Commissioner - Consumer assistance',
      'Legal Aid Society - Free legal help (if you qualify)'
    ],
    additionalWarnings: hardStopData.additionalConditions || []
  };
}

/**
 * Sanitize output to remove prohibited content
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeOutput(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  let sanitized = text;
  
  // Remove prohibited phrases
  PROHIBITED_PHRASES.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  // Remove excessive exclamation points
  sanitized = sanitized.replace(/!+/g, '.');
  
  // Remove multiple question marks
  sanitized = sanitized.replace(/\?{2,}/g, '?');
  
  // Remove emojis (except in hard stop warnings)
  if (!text.includes('⛔') && !text.includes('⚠️')) {
    sanitized = sanitized.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
    sanitized = sanitized.replace(/[\u{1F300}-\u{1F5FF}]/gu, '');
    sanitized = sanitized.replace(/[\u{1F680}-\u{1F6FF}]/gu, '');
    sanitized = sanitized.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '');
    sanitized = sanitized.replace(/[\u{2600}-\u{26FF}]/gu, '');
    sanitized = sanitized.replace(/[\u{2700}-\u{27BF}]/gu, '');
  }
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  sanitized = sanitized.replace(/ {2,}/g, ' ');
  
  // Remove leading/trailing whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Validate output length
 * @param {string} text - Text to validate
 * @param {number} maxLines - Maximum allowed lines
 * @returns {Object} - Validation result
 */
function validateOutputLength(text, maxLines = 30) {
  const lines = text.split('\n').length;
  const words = text.split(/\s+/).length;
  
  return {
    valid: lines <= maxLines,
    lines,
    words,
    maxLines,
    message: lines > maxLines 
      ? `Output exceeds maximum length: ${lines} lines (max: ${maxLines})`
      : 'Output length is acceptable'
  };
}

/**
 * Format guidance output
 * @param {Object} guidance - Guidance data
 * @returns {string} - Formatted guidance
 */
function formatGuidance(guidance) {
  let output = '';
  
  output += '=== GUIDANCE ===\n\n';
  output += `Can Proceed: ${guidance.canProceed ? 'Yes' : 'No'}\n`;
  output += `Recommendation: ${guidance.recommendation}\n\n`;
  
  if (guidance.actions && guidance.actions.length > 0) {
    output += 'REQUIRED ACTIONS:\n';
    guidance.actions.forEach((action, index) => {
      output += `${index + 1}. ${action}\n`;
    });
    output += '\n';
  }
  
  if (guidance.warnings && guidance.warnings.length > 0) {
    output += 'WARNINGS:\n';
    guidance.warnings.forEach((warning, index) => {
      output += `${index + 1}. ${warning}\n`;
    });
    output += '\n';
  }
  
  if (guidance.timeframe) {
    output += `Timeframe: ${guidance.timeframe}\n\n`;
  }
  
  return sanitizeOutput(output);
}

module.exports = {
  formatAnalysisOutput,
  formatResponseOutput,
  formatEvidenceChecklist,
  formatHardStopMessage,
  formatGuidance,
  sanitizeOutput,
  validateOutputLength,
  PROHIBITED_PHRASES
};

