/**
 * AI Hash Editor - Backend Core
 * Developed and Maintained by Muhammad Ahmad Shahid
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const PRIMARY_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash'
];

async function fetchAuditResponse(promptText: string): Promise<string> {
  let errTrace: any = null;

  for (const modelName of PRIMARY_MODELS) {
    for (let tryCount = 0; tryCount < 2; tryCount++) {
      try {
        console.log(`[AuditEngine] Dispatching request to model -> ${modelName} (try ${tryCount + 1})`);
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        });

        const outputText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (outputText && outputText.trim().length > 0) {
          return outputText;
        }
      } catch (err: any) {
        errTrace = err;
        console.warn(`[AuditEngine] Warning on ${modelName}:`, err.message || err);

        const isBusy = 
          err.status === 'UNAVAILABLE' || 
          err.code === 503 || 
          (err.message && (err.message.includes('high demand') || err.message.includes('503') || err.message.includes('ResourceExhausted')));

        if (isBusy && tryCount === 0) {
          await new Promise((res) => setTimeout(res, 1200));
        } else {
          break;
        }
      }
    }
  }

  throw errTrace || new Error('All analysis models are currently busy. Please try again.');
}

app.post('/api/analyze', async (req, res) => {
  const { code, mode = 'deep_research' } = req.body;
  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Please provide valid source code for inspection.' });
  }

  try {
    const isDeepScan = mode === 'deep_research';
    const auditPrompt = `You are a Principal Security Architect and Expert Code Reviewer conducting a ${isDeepScan ? 'DEEP SOURCE CODE INVESTIGATION' : 'STATIC CODE SCAN'}.
Perform an exhaustive, professional code review covering:
1. Security Vulnerabilities & Injection Risks (OWASP Top 10, CWE).
2. Logic, Syntax & Runtime Exceptions (Null refs, unhandled promises, race conditions).
3. Performance Bottlenecks & Memory Leaks.
4. Clean Architecture & Best Practices.

Target Code:
${code}

Provide all text, summaries, diagnoses, attack vectors, and remediation steps strictly in professional English.
Respond strictly with a valid JSON object only (no markdown, no backticks, no chat text):
{
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN",
    "threatScore": 85,
    "exactMistakeFound": "Detailed explanation of what specific mistake or flaw was present in the user's code (Yeh galti thi code mein).",
    "summary": "Clear, direct professional diagnosis explaining the core errors.",
    "rootCauseAnalysis": "Technical breakdown of why this issue occurs.",
    "attackVectors": [
        {
            "name": "Vulnerability or Exploit Name",
            "impact": "Potential system compromise impact",
            "scenario": "How an adversary could trigger this issue."
        }
    ],
    "howToFix": [
        "Step-by-step instructions to remediate the flaw"
    ],
    "bugs": [
        "Specific logic or runtime bugs found with professional explanation"
    ],
    "vulnerabilities": [
        "Identified security vulnerabilities with CWE classification"
    ],
    "complianceImpact": [
        "Relevant security standards violated (e.g. OWASP A03)"
    ],
    "fixedCode": "Fully corrected, production-ready, clean source code"
}`;

    const rawAIResponse = await fetchAuditResponse(auditPrompt);

    let cleanedJsonString = rawAIResponse.trim();
    if (cleanedJsonString.startsWith('```json')) {
      cleanedJsonString = cleanedJsonString.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedJsonString.startsWith('```')) {
      cleanedJsonString = cleanedJsonString.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const jsonMatch = cleanedJsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[AuditEngine] Malformed JSON output:', rawAIResponse);
      throw new Error('Failed to parse structured audit payload from model response.');
    }

    const payload = JSON.parse(jsonMatch[0]);

    // Safety defaults
    if (!Array.isArray(payload.howToFix)) payload.howToFix = [];
    if (!Array.isArray(payload.bugs)) payload.bugs = [];
    if (!Array.isArray(payload.vulnerabilities)) payload.vulnerabilities = [];
    if (!Array.isArray(payload.attackVectors)) payload.attackVectors = [];
    if (!Array.isArray(payload.complianceImpact)) payload.complianceImpact = [];
    if (!payload.exactMistakeFound) payload.exactMistakeFound = "A structural flaw or security vulnerability was detected in the submitted code snippet.";
    if (!payload.summary) payload.summary = "Code audit completed successfully.";
    if (!payload.severity) payload.severity = "MEDIUM";
    if (typeof payload.threatScore !== 'number') payload.threatScore = 70;
    if (!payload.rootCauseAnalysis) payload.rootCauseAnalysis = "Standard architectural review completed.";
    if (!payload.fixedCode) payload.fixedCode = code;

    res.json(payload);
  } catch (err: any) {
    console.error('[AuditEngine] Endpoint error:', err);
    res.status(500).json({ error: err.message || 'Audit execution failed. Please retry.' });
  }
});

async function initializeApp() {
  const viteServer = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(viteServer.middlewares);

  app.listen(3000, () => {
    console.log('[Server] AI Hash Editor running smoothly at http://localhost:3000');
  });
}

initializeApp();
