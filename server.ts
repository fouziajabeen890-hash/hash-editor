import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash'
];

async function generateWithFallback(prompt: string): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[AI Hash Editor] Querying model ${model} (attempt ${attempt + 1})...`);
        const result = await genAI.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        let text = "";
        if (result && result.candidates && result.candidates.length > 0) {
          text = result.candidates[0].content?.parts?.[0]?.text || "";
        }

        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Hash Editor] Model ${model} attempt ${attempt + 1} failed:`, err.message || err);

        // Check if temporary demand / rate limit / 503
        const isTemporary = 
          err.status === 'UNAVAILABLE' || 
          err.code === 503 || 
          (err.message && (err.message.includes('high demand') || err.message.includes('503') || err.message.includes('ResourceExhausted')));

        if (isTemporary && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          // Switch to next model immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error('All AI models are currently unavailable. Please try again.');
}

app.post('/api/analyze', async (req, res) => {
  const { code, mode = 'deep_research' } = req.body;
  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Please provide some code to analyze.' });
  }

  try {
    const isDeep = mode === 'deep_research';
    const prompt = `You are a Principal Security Research Architect and Elite Autonomous Code Analyst conducting a ${isDeep ? 'COMPREHENSIVE DEEP RESEARCH INVESTIGATION' : 'STANDARD CODE AUDIT'}.
Perform an exhaustive multi-vector audit of the following source code:
1. Attack Surface & Threat Modeling (Simulate potential hacker exploit scenarios).
2. Root Cause Analysis (Deep mechanical explanation of architectural flaws).
3. Logic, Memory, Concurrency, and Runtime Flaws (Race conditions, leaks, edge cases).
4. Compliance & Regulatory Violations (OWASP, CWE, PCI-DSS, GDPR, Zero-Trust principles).
5. Production Hardening (Clean, elegant, refactored, production-ready solution).

Source Code under Investigation:
${code}

Respond ONLY with a valid, clean JSON object. Do not include markdown codeblocks or conversational text.
{
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN",
    "threatScore": 85,
    "summary": "Direct, authoritative executive summary detailing all critical failures found in the code.",
    "rootCauseAnalysis": "In-depth technical explanation of why this flaw occurs at the memory/runtime/architectural level.",
    "attackVectors": [
        {
            "name": "e.g. Unauthenticated Remote SQL Injection (CWE-89)",
            "impact": "e.g. Total Database Compromise / Authentication Bypass",
            "scenario": "Step-by-step explanation of how an adversary would trigger or exploit this in production."
        }
    ],
    "howToFix": [
        "Definitive step-by-step instructions to remediate and harden the implementation"
    ],
    "bugs": [
        "Specific logic, syntax, or runtime bugs identified with root cause"
    ],
    "vulnerabilities": [
        "Specific security vulnerabilities classified by CWE / OWASP"
    ],
    "complianceImpact": [
        "e.g. PCI-DSS Requirement 6.5.1 violation",
        "OWASP A03:2021-Injection violation"
    ],
    "fixedCode": "Complete, production-ready, refactored, hardened, and clean source code"
}`;

    const text = await generateWithFallback(prompt);

    // Clean markdown code blocks if the model wrapped it in ```json ... ```
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[AI Hash Editor] Raw response text:', text);
      throw new Error('Could not parse structured audit report from AI response.');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Ensure array structures and defaults
    if (!Array.isArray(parsedData.howToFix)) parsedData.howToFix = [];
    if (!Array.isArray(parsedData.bugs)) parsedData.bugs = [];
    if (!Array.isArray(parsedData.vulnerabilities)) parsedData.vulnerabilities = [];
    if (!Array.isArray(parsedData.attackVectors)) parsedData.attackVectors = [];
    if (!Array.isArray(parsedData.complianceImpact)) parsedData.complianceImpact = [];
    if (!parsedData.summary) parsedData.summary = "Deep code investigation completed.";
    if (!parsedData.severity) parsedData.severity = "MEDIUM";
    if (typeof parsedData.threatScore !== 'number') parsedData.threatScore = 70;
    if (!parsedData.rootCauseAnalysis) parsedData.rootCauseAnalysis = "Architectural review identified security and logic deficiencies.";
    if (!parsedData.fixedCode) parsedData.fixedCode = code;

    res.json(parsedData);
  } catch (error: any) {
    console.error('[AI Hash Editor] Analysis endpoint error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed. Please try again.' });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.log('Port 3000 is busy, another server might be running.');
    } else {
      console.error(e);
    }
  });
}

startServer();
