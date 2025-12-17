/**
 * INSURANCE RESPONSE PLAYBOOKS
 * 
 * Fixed, procedural response templates.
 * NO AI strategy. NO negotiation. NO persuasion.
 * 
 * Output is:
 * - Structured outline only
 * - Max 3-5 lines per section
 * - Sections fixed per claim phase
 * - No explanations beyond request
 * - No emotional language
 * - No persuasive framing
 * 
 * This is procedural containment, not advocacy.
 */

/**
 * Get response playbook for specific phase
 * @param {string} phase - Claim phase
 * @param {Object} context - Additional context (claim type, denial reason, etc.)
 * @returns {Object} - Structured response playbook
 */
function getResponsePlaybook(phase, context = {}) {
  const playbooks = {
    information_request: getInformationRequestPlaybook(context),
    denial: getDenialPlaybook(context),
    partial_payment: getPartialPaymentPlaybook(context),
    appeal: getAppealPlaybook(context),
    initial_claim: getInitialClaimPlaybook(context)
  };
  
  return playbooks[phase] || {
    error: 'No playbook available for this phase',
    canRespond: false
  };
}

/**
 * Information Request Playbook
 */
function getInformationRequestPlaybook(context) {
  return {
    phase: 'information_request',
    canRespond: true,
    responseType: 'Procedural compliance response',
    sections: {
      header: {
        required: true,
        content: [
          '[Your Name]',
          '[Your Address]',
          '[Date]',
          '',
          '[Insurance Company Name]',
          '[Claims Department Address]',
          '',
          'RE: Claim Number [CLAIM_NUMBER]',
          '    Policy Number [POLICY_NUMBER]',
          '    Date of Loss: [LOSS_DATE]'
        ]
      },
      
      acknowledgment: {
        required: true,
        maxLines: 2,
        template: [
          'This letter responds to your [LETTER_DATE] request for additional information regarding the above-referenced claim.',
          'The requested documents are enclosed as specified below.'
        ]
      },
      
      document_list: {
        required: true,
        maxLines: 5,
        template: [
          'Enclosed documents:',
          '1. [DOCUMENT_NAME] - [BRIEF_DESCRIPTION]',
          '2. [DOCUMENT_NAME] - [BRIEF_DESCRIPTION]',
          '3. [DOCUMENT_NAME] - [BRIEF_DESCRIPTION]'
        ],
        instructions: 'List ONLY documents that were explicitly requested. Do not include additional documents.'
      },
      
      compliance_statement: {
        required: true,
        maxLines: 2,
        template: [
          'This submission fulfills the information request in your [LETTER_DATE] correspondence.',
          'Please confirm receipt and advise of any additional requirements.'
        ]
      },
      
      contact_information: {
        required: true,
        maxLines: 3,
        template: [
          'For questions regarding this submission, I may be reached at:',
          'Phone: [PHONE]',
          'Email: [EMAIL]'
        ]
      },
      
      closing: {
        required: true,
        content: [
          'Sincerely,',
          '',
          '[Your Signature]',
          '[Your Printed Name]'
        ]
      }
    },
    
    prohibitions: [
      'Do not provide narrative explanations',
      'Do not volunteer information not requested',
      'Do not include emotional appeals',
      'Do not argue or negotiate',
      'Do not admit fault or liability'
    ],
    
    maxTotalLines: 20,
    tone: 'Procedural and factual'
  };
}

/**
 * Denial Response Playbook
 */
function getDenialPlaybook(context) {
  return {
    phase: 'denial',
    canRespond: true,
    responseType: 'Denial acknowledgment and clarification request',
    sections: {
      header: {
        required: true,
        content: [
          '[Your Name]',
          '[Your Address]',
          '[Date]',
          '',
          '[Insurance Company Name]',
          '[Claims Department Address]',
          '',
          'RE: Claim Number [CLAIM_NUMBER]',
          '    Policy Number [POLICY_NUMBER]',
          '    Denial Letter Dated: [DENIAL_DATE]'
        ]
      },
      
      acknowledgment: {
        required: true,
        maxLines: 2,
        template: [
          'This letter acknowledges receipt of your [DENIAL_DATE] denial letter regarding the above-referenced claim.',
          'I am writing to request clarification and review of the denial decision.'
        ]
      },
      
      denial_reason_reference: {
        required: true,
        maxLines: 3,
        template: [
          'Your letter states the claim was denied for the following reason(s):',
          '[DENIAL_REASON_1]',
          '[DENIAL_REASON_2]'
        ],
        instructions: 'State denial reasons exactly as written in denial letter. Do not paraphrase or interpret.'
      },
      
      policy_reference: {
        required: false,
        maxLines: 2,
        template: [
          'I reference the following policy provisions:',
          '[POLICY_SECTION] - [BRIEF_DESCRIPTION]'
        ],
        instructions: 'Include only if specific policy section is clearly applicable. Do not interpret policy language.'
      },
      
      clarification_request: {
        required: true,
        maxLines: 3,
        template: [
          'I request the following clarifications:',
          '1. [SPECIFIC_QUESTION]',
          '2. [SPECIFIC_QUESTION]'
        ],
        instructions: 'Ask specific, factual questions only. Do not argue or negotiate.'
      },
      
      appeal_rights: {
        required: true,
        maxLines: 2,
        template: [
          'Please provide information regarding my appeal rights and the appeal process.',
          'Please confirm the deadline for filing an appeal.'
        ]
      },
      
      contact_information: {
        required: true,
        maxLines: 3,
        template: [
          'For questions regarding this letter, I may be reached at:',
          'Phone: [PHONE]',
          'Email: [EMAIL]'
        ]
      },
      
      closing: {
        required: true,
        content: [
          'Sincerely,',
          '',
          '[Your Signature]',
          '[Your Printed Name]'
        ]
      }
    },
    
    prohibitions: [
      'Do not argue with denial decision',
      'Do not provide narrative explanations',
      'Do not include emotional appeals',
      'Do not make legal arguments',
      'Do not threaten or use adversarial language',
      'Do not admit fault or liability'
    ],
    
    maxTotalLines: 25,
    tone: 'Procedural and factual'
  };
}

/**
 * Partial Payment Playbook
 */
function getPartialPaymentPlaybook(context) {
  return {
    phase: 'partial_payment',
    canRespond: true,
    responseType: 'Valuation dispute notification',
    sections: {
      header: {
        required: true,
        content: [
          '[Your Name]',
          '[Your Address]',
          '[Date]',
          '',
          '[Insurance Company Name]',
          '[Claims Department Address]',
          '',
          'RE: Claim Number [CLAIM_NUMBER]',
          '    Policy Number [POLICY_NUMBER]',
          '    Payment Dated: [PAYMENT_DATE]'
        ]
      },
      
      acknowledgment: {
        required: true,
        maxLines: 2,
        template: [
          'This letter acknowledges receipt of your [PAYMENT_DATE] payment in the amount of $[AMOUNT].',
          'I am writing to dispute the valuation and request review.'
        ]
      },
      
      valuation_dispute: {
        required: true,
        maxLines: 3,
        template: [
          'I dispute the valuation for the following reasons:',
          '1. [FACTUAL_REASON]',
          '2. [FACTUAL_REASON]'
        ],
        instructions: 'State factual discrepancies only. Do not argue or use emotional language.'
      },
      
      supporting_valuation: {
        required: false,
        maxLines: 3,
        template: [
          'I have obtained the following independent valuation(s):',
          '[SOURCE] - $[AMOUNT] - [DATE]',
          'Documentation is enclosed.'
        ],
        instructions: 'Include only if you have obtained independent estimates or appraisals.'
      },
      
      request_for_review: {
        required: true,
        maxLines: 2,
        template: [
          'I request review of the valuation and reconsideration of the payment amount.',
          'Please advise of the review process and timeline.'
        ]
      },
      
      payment_status: {
        required: true,
        maxLines: 1,
        template: [
          'I have not cashed the payment check pending resolution of this dispute.'
        ],
        instructions: 'Include only if you have not cashed the check. If you have cashed it, omit this section.'
      },
      
      contact_information: {
        required: true,
        maxLines: 3,
        template: [
          'For questions regarding this dispute, I may be reached at:',
          'Phone: [PHONE]',
          'Email: [EMAIL]'
        ]
      },
      
      closing: {
        required: true,
        content: [
          'Sincerely,',
          '',
          '[Your Signature]',
          '[Your Printed Name]'
        ]
      }
    },
    
    prohibitions: [
      'Do not make accusations of bad faith',
      'Do not use emotional or adversarial language',
      'Do not provide narrative explanations',
      'Do not make legal arguments',
      'Do not threaten litigation',
      'Do not admit fault or liability'
    ],
    
    warnings: [
      'Cashing the payment check may constitute acceptance and waive further claims',
      'Review settlement language carefully before cashing check',
      'Consider professional review before accepting payment'
    ],
    
    maxTotalLines: 25,
    tone: 'Procedural and factual'
  };
}

/**
 * Appeal Playbook
 */
function getAppealPlaybook(context) {
  return {
    phase: 'appeal',
    canRespond: true,
    responseType: 'Formal appeal submission',
    sections: {
      header: {
        required: true,
        content: [
          '[Your Name]',
          '[Your Address]',
          '[Date]',
          '',
          '[Insurance Company Name]',
          '[Appeals Department Address]',
          '',
          'RE: FORMAL APPEAL',
          '    Claim Number [CLAIM_NUMBER]',
          '    Policy Number [POLICY_NUMBER]',
          '    Denial Date: [DENIAL_DATE]'
        ]
      },
      
      appeal_statement: {
        required: true,
        maxLines: 2,
        template: [
          'This letter constitutes a formal appeal of the [DENIAL_DATE] denial of the above-referenced claim.',
          'I request reconsideration based on the following grounds.'
        ]
      },
      
      grounds_for_appeal: {
        required: true,
        maxLines: 5,
        template: [
          'Grounds for appeal:',
          '1. [FACTUAL_BASIS]',
          '2. [FACTUAL_BASIS]',
          '3. [FACTUAL_BASIS]'
        ],
        instructions: 'State factual grounds only. Do not argue, persuade, or use emotional language.'
      },
      
      supporting_documentation: {
        required: false,
        maxLines: 4,
        template: [
          'Supporting documentation enclosed:',
          '1. [DOCUMENT_NAME]',
          '2. [DOCUMENT_NAME]',
          '3. [DOCUMENT_NAME]'
        ],
        instructions: 'List only documents that directly support appeal grounds.'
      },
      
      policy_reference: {
        required: false,
        maxLines: 2,
        template: [
          'Relevant policy provisions:',
          '[POLICY_SECTION] - [BRIEF_DESCRIPTION]'
        ],
        instructions: 'Include only if specific policy section clearly supports appeal.'
      },
      
      request_for_review: {
        required: true,
        maxLines: 2,
        template: [
          'I request full review of this appeal and reconsideration of the denial decision.',
          'Please advise of the review timeline and process.'
        ]
      },
      
      contact_information: {
        required: true,
        maxLines: 3,
        template: [
          'For questions regarding this appeal, I may be reached at:',
          'Phone: [PHONE]',
          'Email: [EMAIL]'
        ]
      },
      
      closing: {
        required: true,
        content: [
          'Sincerely,',
          '',
          '[Your Signature]',
          '[Your Printed Name]'
        ]
      }
    },
    
    prohibitions: [
      'Do not make legal arguments',
      'Do not use emotional or adversarial language',
      'Do not provide narrative explanations beyond factual basis',
      'Do not make accusations of bad faith',
      'Do not threaten litigation',
      'Do not admit fault or liability'
    ],
    
    warnings: [
      'Ensure appeal is filed within deadline (typically 30-60 days)',
      'Send via certified mail with return receipt',
      'Keep copies of all documents',
      'Consider professional review for complex appeals'
    ],
    
    maxTotalLines: 30,
    tone: 'Procedural and factual'
  };
}

/**
 * Initial Claim Acknowledgment Playbook
 */
function getInitialClaimPlaybook(context) {
  return {
    phase: 'initial_claim',
    canRespond: true,
    responseType: 'Claim acknowledgment response',
    sections: {
      header: {
        required: true,
        content: [
          '[Your Name]',
          '[Your Address]',
          '[Date]',
          '',
          '[Insurance Company Name]',
          '[Claims Department Address]',
          '',
          'RE: Claim Number [CLAIM_NUMBER]',
          '    Policy Number [POLICY_NUMBER]'
        ]
      },
      
      acknowledgment: {
        required: true,
        maxLines: 2,
        template: [
          'This letter acknowledges receipt of your [LETTER_DATE] correspondence regarding the above-referenced claim.',
          'I confirm the claim details and provide the following information.'
        ]
      },
      
      claim_confirmation: {
        required: true,
        maxLines: 4,
        template: [
          'Claim details:',
          'Date of Loss: [LOSS_DATE]',
          'Type of Loss: [LOSS_TYPE]',
          'Assigned Adjuster: [ADJUSTER_NAME]'
        ]
      },
      
      contact_confirmation: {
        required: true,
        maxLines: 3,
        template: [
          'My contact information:',
          'Phone: [PHONE]',
          'Email: [EMAIL]'
        ]
      },
      
      cooperation_statement: {
        required: true,
        maxLines: 2,
        template: [
          'I will cooperate with the claims process and provide requested information.',
          'Please advise of any additional requirements or next steps.'
        ]
      },
      
      closing: {
        required: true,
        content: [
          'Sincerely,',
          '',
          '[Your Signature]',
          '[Your Printed Name]'
        ]
      }
    },
    
    prohibitions: [
      'Do not provide narrative explanations of loss',
      'Do not volunteer additional information',
      'Do not make admissions',
      'Do not speculate about cause of loss'
    ],
    
    maxTotalLines: 20,
    tone: 'Procedural and factual'
  };
}

/**
 * Format playbook into actual letter text
 * @param {Object} playbook - Response playbook
 * @param {Object} variables - Variable values to substitute
 * @returns {string} - Formatted letter text
 */
function formatPlaybook(playbook, variables = {}) {
  if (!playbook.canRespond) {
    return null;
  }
  
  let letterText = '';
  let lineCount = 0;
  
  for (const [sectionName, section] of Object.entries(playbook.sections)) {
    if (!section.required && !variables[`include_${sectionName}`]) {
      continue;
    }
    
    if (section.content) {
      // Fixed content
      letterText += section.content.join('\n') + '\n\n';
      lineCount += section.content.length;
    } else if (section.template) {
      // Template with variables
      const sectionText = section.template.map(line => {
        return substituteVariables(line, variables);
      }).join('\n');
      
      letterText += sectionText + '\n\n';
      lineCount += section.template.length;
    }
    
    // Enforce max lines per section
    if (section.maxLines && lineCount > section.maxLines) {
      console.warn(`Section ${sectionName} exceeds max lines`);
    }
  }
  
  // Enforce max total lines
  if (lineCount > playbook.maxTotalLines) {
    console.warn(`Letter exceeds max total lines: ${lineCount} > ${playbook.maxTotalLines}`);
  }
  
  return letterText.trim();
}

/**
 * Substitute variables in template
 */
function substituteVariables(template, variables) {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `[${key.toUpperCase()}]`;
    result = result.replace(new RegExp(placeholder, 'g'), value || placeholder);
  }
  
  return result;
}

module.exports = {
  getResponsePlaybook,
  formatPlaybook
};

