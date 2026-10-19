/**
 * AI Hash Editor Pro - Main Client Application
 * Architect & Developer: Muhammad Ahmad Shahid
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Code2, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  FileCheck, 
  Fingerprint,
  Terminal
} from 'lucide-react';
import { MatrixBackground } from './components/MatrixBackground';

const SAMPLE_PRESETS = {
  sqli: `// Critical Authentication & SQL Injection Threat
function authenticateUser(req, res) {
  const accountUser = req.body.username;
  const accountPass = req.body.password;

  const sqlQuery = "SELECT * FROM users WHERE username = '" + accountUser + "' AND password = '" + accountPass + "'";
  dbConnection.query(sqlQuery, (err, results) => {
    if (results && results.length > 0) {
      const sessionToken = jwt.sign({ userId: results[0].id }, "hardcoded_secret_key_123");
      res.json({ success: true, token: sessionToken });
    } else {
      res.status(401).json({ error: "Unauthorized access" });
    }
  });
}`,
  memory_leak: `// Concurrency & Memory Leak Hazard
class ConnectionStreamHandler {
  constructor() {
    this.activeListeners = [];
  }

  registerStream(streamSocket) {
    streamSocket.on('data', (payloadChunk) => {
      this.activeListeners.push({
        timestamp: Date.now(),
        data: payloadChunk,
        meta: streamSocket.metadata
      });
    });
  }

  async persistBatch(targetStore) {
    for (const entry of this.activeListeners) {
      await targetStore.save(entry);
    }
    this.activeListeners = [];
  }
}`
};

const ANALYSIS_STEPS = [
  'Parsing Abstract Syntax Tree & Call Graphs...',
  'Executing Dynamic Taint Tracking & Exploit Surface Modeling...',
  'Cross-Referencing Global CVE, CWE & OWASP Top 10 Threat Vectors...',
  'Evaluating Concurrency Deadlocks, Memory Leaks & Race Hazards...',
  'Synthesizing Zero-Trust Remediated Production Patch...'
];

export default function App() {
  const [sourceCode, setSourceCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'vectors' | 'remediation' | 'patch'>('overview');
  const [auditResult, setAuditResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStep(0);
      return;
    }
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  const executeAudit = async () => {
    if (!sourceCode.trim()) {
      setErrorMessage('Please provide valid source code before initiating the security audit.');
      return;
    }
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const response = await axios.post('/api/analyze', { code: sourceCode, mode: 'deep_research' });
      setAuditResult(response.data);
      setActiveTab('overview');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || 'Audit pipeline encountered an error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyRefactoredCode = () => {
    if (!auditResult?.fixedCode) return;
    navigator.clipboard.writeText(auditResult.fixedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const exportMarkdownDossier = () => {
    if (!auditResult) return;
    const vectorsMarkdown = (auditResult.attackVectors || [])
      .map((v: any, i: number) => `### Attack Vector ${i + 1}: ${v.name}\n- **Impact:** ${v.impact}\n- **Scenario:** ${v.scenario}`)
      .join('\n\n');

    const fixesMarkdown = (auditResult.howToFix || [])
      .map((step: string, i: number) => `${i + 1}. ${step}`)
      .join('\n');

    const dossierContent = `# SECURITY AUDIT & REMEDIATION DOSSIER
**Platform:** AI Hash Editor Pro  
**Lead Security Architect:** Muhammad Ahmad Shahid  
**Timestamp:** ${new Date().toUTCString()}  
**Threat Risk Score:** ${auditResult.threatScore || 85}/100 [SEVERITY: ${auditResult.severity || 'CRITICAL'}]  

---

## 1. EXACT MISTAKE IDENTIFIED IN SOURCE CODE
${auditResult.exactMistakeFound || auditResult.summary}

## 2. EXECUTIVE DIAGNOSIS
${auditResult.summary || 'Exhaustive security audit completed.'}

---

## 3. ATTACK VECTORS & EXPLOIT SIMULATIONS
${vectorsMarkdown || 'No direct critical exploit vectors synthesized.'}

---

## 4. REMEDIATION BLUEPRINT & STEP-BY-STEP FIXES
${fixesMarkdown || 'Follow clean code and safe parameterization standards.'}

---

## 5. HARDENED PRODUCTION PATCH
\`\`\`typescript
${auditResult.fixedCode}
\`\`\`

---
*Verified & Certified by Muhammad Ahmad Shahid*
`;

    try {
      const fileBlob = new Blob([dossierContent], { type: 'text/markdown;charset=utf-8' });
      const fileUrl = URL.createObjectURL(fileBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = fileUrl;
      downloadAnchor.download = `security-dossier-${Date.now()}.md`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } catch (e) {
      console.error('Download failed:', e);
      alert('Failed to download report file. Please copy the code/report manually.');
    }
  };

  return (
    <div className="min-h-screen bg-[#04060A] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black pb-24 relative overflow-x-hidden">
      
      {/* Matrix Background Animation */}
      <MatrixBackground />

      {/* Responsive Header */}
      <header className="border-b border-slate-800/80 bg-[#04060A]/95 backdrop-blur-2xl sticky top-0 z-40 px-4 sm:px-8 md:px-16 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#080d1a] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  AI Hash Editor <span className="text-cyan-400 font-light">Pro</span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Autonomous Code Auditor & Security Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-900/60 px-3.5 py-2 rounded-2xl border border-slate-800 shadow-md">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
              AS
            </div>
            <div className="text-left">
              <p className="text-[9px] text-slate-400 uppercase font-extrabold">Lead Architect</p>
              <p className="text-xs font-black text-cyan-300">Muhammad Ahmad Shahid</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pt-6 sm:pt-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Quick Sample Presets */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/40 px-4 sm:px-6 py-3.5 rounded-3xl border border-slate-800/80 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Load Sample:</span>
            <span className="sm:hidden">Samples:</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => { setSourceCode(SAMPLE_PRESETS.sqli); setErrorMessage(null); }}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              SQL Injection
            </button>
            <button
              onClick={() => { setSourceCode(SAMPLE_PRESETS.memory_leak); setErrorMessage(null); }}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-indigo-300 border border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              Memory Leak
            </button>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Code Editor */}
          <div className="lg:col-span-5 bg-slate-900/50 rounded-3xl border border-slate-800/90 p-4 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> Source Editor
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">UTF-8</span>
            </div>

            <textarea 
              className="w-full h-[400px] sm:h-[480px] bg-[#020305] p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-mono border border-slate-800 focus:border-cyan-500 outline-none transition-all resize-none text-slate-200 placeholder-slate-600 leading-relaxed shadow-inner"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="// Paste your source code here..."
            />

            <button 
              onClick={executeAudit}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black py-3.5 sm:py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.25)] flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer text-xs uppercase tracking-widest"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 text-black" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-black" />
                  <span>Run Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output Dossier */}
          <div className="lg:col-span-7 space-y-6">
            
            {errorMessage && (
              <div className="bg-red-950/40 border border-red-800/80 p-4 sm:p-5 rounded-3xl text-red-300 flex items-start gap-3 shadow-xl backdrop-blur-md">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-medium">{errorMessage}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Pipeline Active</p>
                  <p className="text-xs font-mono text-cyan-300 animate-pulse">{ANALYSIS_STEPS[currentStep]}</p>
                </div>
              </div>
            )}

            {!isAnalyzing && !auditResult && !errorMessage && (
              <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center text-slate-400 min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center backdrop-blur-md shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Audit Engine Standby</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">Enter your source code or load a sample on the left to generate the security report.</p>
              </div>
            )}

            {!isAnalyzing && auditResult && (
              <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Audit Report</h2>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          auditResult.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-700/80' : 'bg-emerald-950 text-emerald-400 border-emerald-700/80'
                        }`}>
                          {auditResult.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Risk Score: <span className="text-white font-extrabold">{auditResult.threatScore || 85}/100</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={exportMarkdownDossier}
                    className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Report
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 border-b border-slate-800 pb-3">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'overview' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white bg-slate-800/60'
                    }`}
                  >
                    1. Mistake
                  </button>
                  <button
                    onClick={() => setActiveTab('vectors')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'vectors' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white bg-slate-800/60'
                    }`}
                  >
                    2. Vectors
                  </button>
                  <button
                    onClick={() => setActiveTab('remediation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'remediation' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white bg-slate-800/60'
                    }`}
                  >
                    3. Fix Guide
                  </button>
                  <button
                    onClick={() => setActiveTab('patch')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'patch' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white bg-slate-800/60'
                    }`}
                  >
                    4. Error Free Code
                  </button>
                </div>

                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="bg-[#020305] p-4 sm:p-5 rounded-2xl border border-red-950 text-xs text-slate-200 leading-relaxed space-y-2 shadow-inner">
                      <p className="font-extrabold text-red-400 uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-400" /> Yeh Galti Thi Code Mein:
                      </p>
                      <p className="text-slate-100 font-medium leading-relaxed text-xs sm:text-sm">{auditResult.exactMistakeFound || auditResult.summary}</p>
                    </div>

                    <div className="bg-[#020305] p-4 sm:p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                      <p className="font-extrabold text-cyan-400 uppercase text-[10px] tracking-widest">Executive Summary:</p>
                      <p>{auditResult.summary}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'vectors' && (
                  <div className="space-y-3">
                    {auditResult.attackVectors?.map((vec: any, idx: number) => (
                      <div key={idx} className="bg-[#020305] p-4 rounded-2xl border border-red-950/70 space-y-2 text-xs shadow-sm">
                        <p className="font-extrabold text-red-300 text-xs sm:text-sm">{vec.name}</p>
                        <p className="text-slate-300"><span className="text-slate-500 font-bold uppercase text-[10px]">Impact:</span> {vec.impact}</p>
                        <p className="font-mono text-amber-200/90 bg-black/70 p-3 rounded-xl border border-slate-800 leading-relaxed">{vec.scenario}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'remediation' && (
                  <div className="bg-[#020305] p-5 rounded-2xl border border-slate-800 text-xs text-slate-200 space-y-3">
                    <p className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-widest">Remediation Guide (Step-by-Step Fixes):</p>
                    <ul className="space-y-2.5">
                      {auditResult.howToFix?.map((step: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-800 shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'patch' && (
                  <div className="bg-[#020305] p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">Error Free Code (Yeh Error Free Code Hai)</span>
                      <button 
                        onClick={copyRefactoredCode}
                        className="text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow-sm font-bold"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-xs font-mono overflow-auto max-h-[350px] text-emerald-300 bg-slate-950 p-4 rounded-xl border border-slate-900 leading-relaxed shadow-inner">
                      {auditResult.fixedCode}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
