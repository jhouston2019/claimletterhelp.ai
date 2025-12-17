/**
 * INSURANCE LETTER ANALYSIS FUNCTION
 * 
 * ⚠️ SAFETY LOCK — DO NOT MODIFY ⚠️
 * This system intentionally refuses certain scenarios.
 * Removing guardrails constitutes a safety regression.
 * 
 * HARDENED PROCEDURAL SYSTEM
 * 
 * This function:
 * 1. Validates claim classification
 * 2. Detects letter phase
 * 3. Evaluates risk and enforces hard stops
 * 4. Provides procedural analysis (NO advice, NO strategy)
 * 
 * Temperature: 0.2 (deterministic)
 * NO IRS logic
 * NO tax logic
 * ONLY insurance claims
 * 
 * REGRESSION WARNING:
 * This file enforces safety boundaries.
 * Any loosening increases user harm risk.
 */

const OpenAI = require("openai");
const { classifyClaim, getClaimTypeMetadata, checkClassificationEscalation } = require("./claim-classification");
const { detectPhase, getPhaseGuidance } = require("./claim-phase-detector");
const { evaluateRisk, getRiskGuidance, formatHardStopMessage } = require("./insurance-risk-guardrails");
const { generateEvidenceChecklist } = require("./insurance-evidence-mapper");
const { formatAnalysisOutput, formatHardStopMessage: formatHardStop } = require("./insurance-output-formatter");
const { getSupabaseAdmin } = require("./_supabase");

exports.handler = async (event) => {
  console.log('=== INSURANCE LETTER ANALYSIS START ===');
  
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { filePath, fileName, classification, userId } = JSON.parse(event.body || "{}");
    
    // STEP 1: VALIDATE CLASSIFICATION (MANDATORY GATE)
    console.log('Step 1: Validating classification...');
    const classificationResult = classifyClaim(classification);
    
    if (!classificationResult.success) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Classification failed',
          details: classificationResult.errors,
          message: 'All classification fields are required before analysis can proceed.'
        })
      };
    }
    
    const validatedClassification = classificationResult.classification;
    console.log('Classification validated:', validatedClassification.claimType);
    
    // Check for classification-based escalation
    const classificationEscalation = checkClassificationEscalation(validatedClassification);
    if (classificationEscalation.requiresEscalation) {
      console.log('Classification escalation triggered');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          hardStop: true,
          classification: validatedClassification,
          phase: { phase: 'unknown', confidence: 0 },
          riskAssessment: {
            hardStop: true,
            allowSelfResponse: false,
            escalationRequired: true,
            requiresAttorney: true,
            riskLevel: 'high',
            message: classificationEscalation.reasons.join(' ')
          },
          hardStopReason: classificationEscalation.reasons.join(' ')
        })
      };
    }
    
    // STEP 2: EXTRACT LETTER TEXT
    console.log('Step 2: Extracting letter text...');
    let letterText = '';
    
    // For now, we'll use a placeholder. In production, extract from filePath
    // This would involve reading from Supabase storage and using OCR/PDF parsing
    letterText = `[Letter text would be extracted from ${fileName}]`;
    
    // In production, you would:
    // 1. Download file from Supabase storage using filePath
    // 2. Use pdf-parse for PDFs or Tesseract for images
    // 3. Extract text content
    
    // STEP 3: DETECT PHASE (MANDATORY)
    console.log('Step 3: Detecting letter phase...');
    const phaseResult = detectPhase(letterText, classification.hardStopChecks);
    console.log('Phase detected:', phaseResult.phase, 'Confidence:', phaseResult.confidence);
    
    // STEP 4: EVALUATE RISK & HARD STOPS (CRITICAL)
    console.log('Step 4: Evaluating risk and hard stops...');
    const riskAssessment = evaluateRisk({
      phase: phaseResult,
      classification: validatedClassification,
      userChecks: classification.hardStopChecks,
      letterText
    });
    
    console.log('Risk assessment:', {
      hardStop: riskAssessment.hardStop,
      riskLevel: riskAssessment.riskLevel,
      requiresAttorney: riskAssessment.requiresAttorney
    });
    
    // STEP 5: HARD STOP CHECK
    if (riskAssessment.hardStop) {
      console.log('HARD STOP TRIGGERED - Refusing output');
      
      const hardStopMessage = formatHardStop(riskAssessment);
      
      // Save to database with hard stop status
      if (getSupabaseAdmin) {
        try {
          const supabase = getSupabaseAdmin();
          await supabase.from("cla_letters").insert({
            user_email: userId,
            letter_text: letterText,
            analysis: {
              classification: validatedClassification,
              phase: phaseResult,
              riskAssessment,
              hardStop: true
            },
            status: 'hard_stop'
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
        }
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          hardStop: true,
          classification: validatedClassification,
          phase: phaseResult,
          riskAssessment,
          hardStopMessage,
          hardStopReason: riskAssessment.message,
          analysis: 'Analysis cannot proceed. Professional representation required.'
        })
      };
    }
    
    // STEP 6: GENERATE PROCEDURAL ANALYSIS (Only if safe)
    console.log('Step 6: Generating procedural analysis...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Get claim type metadata
    const claimMetadata = getClaimTypeMetadata(validatedClassification.claimType);
    
    // HARDENED SYSTEM PROMPT - NO IRS, NO TAX
    const systemPrompt = `You are a procedural insurance correspondence analyzer. You provide FACTUAL analysis only.

CRITICAL CONSTRAINTS:
- NO advice or recommendations
- NO strategy or negotiation tactics
- NO emotional language
- NO persuasive framing
- NO interpretation beyond facts stated in letter
- NO speculation

Your role is to:
1. Identify factual elements in the letter
2. Extract denial reasons (if present)
3. Identify requested information (if present)
4. Note deadlines (if present)
5. Reference policy sections (if mentioned)

Claim Type: ${claimMetadata.name}
Letter Phase: ${phaseResult.phase}

Provide analysis in this JSON format:
{
  "letterType": "Type of letter (denial, information request, etc.)",
  "denialReasons": ["Reason 1", "Reason 2"] or null,
  "requestedInformation": ["Item 1", "Item 2"] or null,
  "deadlines": ["Deadline 1", "Deadline 2"] or null,
  "policyReferences": ["Section 1", "Section 2"] or null,
  "keyFacts": ["Fact 1", "Fact 2"],
  "proceduralSummary": "Brief factual summary of letter content"
}

Be factual. Be brief. Do not advise.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2, // LOW TEMPERATURE - Deterministic
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this insurance letter:\n\n${letterText}` }
      ]
    });

    let aiAnalysis = completion.choices?.[0]?.message?.content || "{}";
    
    // Clean up markdown if present
    if (aiAnalysis.includes('```json')) {
      aiAnalysis = aiAnalysis.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(aiAnalysis);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      parsedAnalysis = {
        letterType: phaseResult.phase,
        proceduralSummary: 'Analysis could not be completed. Manual review required.'
      };
    }
    
    // STEP 7: GET PHASE-SPECIFIC GUIDANCE
    const phaseGuidance = getPhaseGuidance(phaseResult.phase, validatedClassification.claimType);
    
    // STEP 8: GENERATE EVIDENCE CHECKLIST
    const evidenceChecklist = generateEvidenceChecklist(
      validatedClassification.claimType,
      phaseResult.phase,
      parsedAnalysis.denialReasons ? parsedAnalysis.denialReasons[0] : null
    );
    
    // STEP 9: GET RISK GUIDANCE
    const riskGuidance = getRiskGuidance(riskAssessment);
    
    // STEP 10: FORMAT OUTPUT
    const formattedAnalysis = formatAnalysisOutput({
      classification: validatedClassification,
      phase: phaseResult,
      riskAssessment,
      denialReasons: parsedAnalysis.denialReasons,
      policyReferences: parsedAnalysis.policyReferences
    });
    
    // STEP 11: SAVE TO DATABASE
    let recordId = null;
    if (getSupabaseAdmin) {
      try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
          .from("cla_letters")
          .insert({
            user_email: userId,
            letter_text: letterText,
            analysis: {
              classification: validatedClassification,
              phase: phaseResult,
              riskAssessment,
              aiAnalysis: parsedAnalysis,
              phaseGuidance,
              evidenceChecklist
            },
            summary: parsedAnalysis.proceduralSummary,
            status: 'analyzed'
          })
          .select("id")
          .single();

        if (error) throw error;
        recordId = data.id;
        console.log('Record saved to database:', recordId);
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    // STEP 12: RETURN RESULTS
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        hardStop: false,
        classification: validatedClassification,
        phase: phaseResult,
        riskAssessment,
        analysis: parsedAnalysis.proceduralSummary,
        denialReasons: parsedAnalysis.denialReasons,
        requestedInformation: parsedAnalysis.requestedInformation,
        deadlines: parsedAnalysis.deadlines,
        policyReferences: parsedAnalysis.policyReferences,
        phaseGuidance,
        evidenceChecklist,
        riskGuidance,
        recordId,
        formattedOutput: formattedAnalysis
      })
    };
    
  } catch (error) {
    console.error("Error in analyze-insurance-letter:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Analysis failed',
        details: error.message,
        message: 'An error occurred during analysis. Please try again or consult a professional.'
      })
    };
  }
};

