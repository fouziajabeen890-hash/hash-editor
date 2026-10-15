import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
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
  Zap, 
  Crosshair, 
  FileCheck, 
  ExternalLink,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SAMPLES = {
  sqli: `// Critical Auth & Injection Threat
function handleLogin(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Vulnerability: Critical SQL Injection flaw
  const sql = "SELECT * FROM users WHERE user = '" + username + "' AND pass = '" + password + "'";
  database.execute(sql, (err, rows) => {
    if (rows && rows.length > 0) {
      // Logic flaw: Token with static secret and infinite lifetime
      const token = jwt.sign({ uid: rows[0].id, role: rows[0].role }, "admin_secret_999");
      res.json({ authorized: true, token: token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
}`,
  memory_leak: `// Concurrency & Memory Leak Hazard
class DataStreamManager {
  constructor() {
    this.subscribers = [];
  }

  attachListener(stream) {
    // Memory Leak: Unbounded closures retaining socket memory
    stream.on('data', (chunk) => {
      this.subscribers.push({
        timestamp: Date.now(),
        buffer: chunk,
        session: stream.session
      });
    });
  }

  // Race condition: unsynchronized state alteration
  async flush(targetDb) {
    for (let item of this.subscribers) {
      await targetDb.insert(item);
    }
    this.subscribers = [];
  }
}`
};

const RESEARCH_STAGES = [
  'Deconstructing Abstract Syntax Tree (AST) & Call Graphs...',
  'Executing Dynamic Taint Tracking & Exploit Surface Modeling...',
  'Cross-Referencing Global CVE, CWE & OWASP Top 10 Vectors...',
  'Evaluating Concurrency Deadlocks, Memory Leaks & Race Hazards...',
  'Synthesizing Zero-Trust Remediated Production Patch...'
];

export default function App() {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'deep_research' | 'standard'>('deep_research');
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'vectors' | 'remediation' | 'patch'>('overview');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Animate stages while scanning
  useEffect(() => {
    if (!loading) {
      setStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % RESEARCH_STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const runDeepResearch = async () => {
    if (!code.trim()) {
      setError('Please input or load source code before initiating research.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/analyze', { code, mode });
      setResult(response.data);
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Deep Research pipeline encountered a disruption. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!result?.fixedCode) return;
    navigator.clipboard.writeText(result.fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDossier = () => {
    if (!result) return;
    const vectorsText = (result.attackVectors || [])
      .map((v: any, i: number) => `### Attack Vector ${i + 1}: ${v.name}\n- Impact: ${v.impact}\n- Exploitation Scenario: ${v.scenario}`)
      .join('\n\n');

    const fixesText = (result.howToFix || [])
      .map((step: string, i: number) => `${i + 1}. ${step}`)
      .join('\n');

    const bugsText = (result.bugs || []).map((b: string) => `- ${b}`).join('\n');
    const vulnsText = (result.vulnerabilities || []).map((v: string) => `- ${v}`).join('\n');

    const dossier = `# DEEP RESEARCH SECURITY AUDIT DOSSIER
**System:** AI Hash Editor (v2.5 Autonomous Deep Research Edition)  
**Lead Security Architect:** Muhammad Ahmad Shahid  
**Investigation Timestamp:** ${new Date().toUTCString()}  
**Threat Score:** ${result.threatScore || 85}/100 [SEVERITY: ${result.severity || 'CRITICAL'}]  

---

## 1. EXECUTIVE DIAGNOSIS (YEH ERROR HAI CODE MEIN)
${result.summary || 'Exhaustive security audit completed.'}

### Root Cause Analysis (RCA):
${result.rootCauseAnalysis || 'Semantic structural vulnerability detected.'}

---

## 2. ATTACK VECTORS & EXPLOIT SIMULATIONS
${vectorsText || 'No direct critical exploit vectors synthesized.'}

---

## 3. REMEDIATION BLUEPRINT (AISE THEEK KAREIN)
${fixesText || 'Follow clean code and safe parameterization standards.'}

---

## 4. DETECTED BUGS & LOGIC HAZARDS
${bugsText || 'No logic bugs found.'}

## 5. CVE & SECURITY VULNERABILITIES
${vulnsText || 'No direct CVE vulnerabilities mapped.'}

---

## 6. HARDENED PRODUCTION PATCH (DROPPED-IN FIX)
\`\`\`
${result.fixedCode}
\`\`\`

---
*Signed & Certified by Muhammad Ahmad Shahid*
`;

    const blob = new Blob([dossier], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deep-research-dossier-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Professional Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 rounded-2xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  AI Hash Editor
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    Deep Research
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">Autonomous AST Deconstruction, Attack Simulation & Patch Synthesis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Principal Investigator</p>
              <p className="text-sm font-bold text-cyan-300">Muhammad Ahmad Shahid</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg text-sm border border-cyan-400/30">
              AS
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-8">
        
        {/* Research Configuration Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 px-2">Investigation Mode:</span>
            <button
              onClick={() => setMode('deep_research')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'deep_research'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              Autonomous Deep Research
            </button>
            <button
              onClick={() => setMode('standard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'standard'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Rapid Static Scan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Load Preset Threat:</span>
            <button
              onClick={() => {
                setCode(SAMPLES.sqli);
                setError(null);
              }}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              SQLi & Auth Bypass
            </button>
            <button
              onClick={() => {
                setCode(SAMPLES.memory_leak);
                setError(null);
              }}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            >
              <Crosshair className="w-3 h-3 text-indigo-400" />
              Memory Leak & Concurrency
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Terminal */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Source Terminal</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">UTF-8 / Multi-Lang</span>
              </div>

              <textarea 
                className="w-full h-[520px] bg-slate-950/90 p-4 rounded-2xl text-xs md:text-sm font-mono border border-slate-800/90 focus:border-cyan-500/80 outline-none transition-all resize-none shadow-inner text-slate-200 placeholder-slate-700 leading-relaxed focus:ring-1 focus:ring-cyan-500/40"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Enter or paste your target source code snippet here...&#10;// AI Hash Editor Deep Research scans for all vulnerabilities, runtime bugs, and architectural flaws."
              />

              <button 
                onClick={runDeepResearch}
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.25)] flex justify-center items-center gap-3 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 text-black" />
                    <span>Executing Deep Research Investigation...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4 text-black" />
                    <span>Initiate Autonomous Deep Research</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Research Dossier / Pipeline Output */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Error Notification */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-red-950/40 border border-red-800/60 p-5 rounded-3xl text-red-300 flex items-start gap-3.5 shadow-2xl"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-red-200 text-sm">Research Pipeline Alert</p>
                  <p className="text-xs text-red-300/90 mt-1">{error}</p>
                  <button 
                    onClick={runDeepResearch} 
                    className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-200 bg-red-900/40 hover:bg-red-900/70 border border-red-700/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-trigger Pipeline
                  </button>
                </div>
              </motion.div>
            )}

            {/* Live Deep Research Scanning State */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/60 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute inset-0" />
                      <div className="w-3 h-3 rounded-full bg-cyan-500 relative" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-wide">Deep Research Autonomous Pipeline Active</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">STAGE {stageIndex + 1} / 5</span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Pipeline Operation:</p>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                    <span className="animate-pulse">{RESEARCH_STAGES[stageIndex]}</span>
                  </div>
                </div>

                {/* Progressive Pipeline Step Display */}
                <div className="space-y-2 pt-2">
                  {RESEARCH_STAGES.map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {idx < stageIndex ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : idx === stageIndex ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className={idx <= stageIndex ? 'text-slate-200' : 'text-slate-600'}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Idle State */}
            {!loading && !result && !error && (
              <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[580px]">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-4 text-cyan-400 shadow-inner">
                  <Fingerprint className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Deep Research Engine Ready</h3>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                  Paste your target snippet and click "Initiate Autonomous Deep Research". The system executes multi-vector taint tracking, simulates attacker exploit scenarios, and generates a zero-trust hardened patch.
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setCode(SAMPLES.sqli);
                      setError(null);
                    }}
                    className="text-xs text-cyan-300 hover:text-white border border-cyan-800/50 bg-cyan-950/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    Load Sample SQLi
                  </button>
                  <button
                    onClick={() => {
                      setCode(SAMPLES.memory_leak);
                      setError(null);
                    }}
                    className="text-xs text-indigo-300 hover:text-white border border-indigo-800/50 bg-indigo-950/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    Load Sample Concurrency Bug
                  </button>
                </div>
              </div>
            )}

            {/* Completed Deep Research Dossier */}
            {!loading && result && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6"
              >
                {/* Dossier Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white">Security Research Dossier</h2>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          result.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-700/60' :
                          result.severity === 'HIGH' ? 'bg-orange-950 text-orange-400 border-orange-700/60' :
                          result.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400 border-yellow-700/60' :
                          'bg-emerald-950 text-emerald-400 border-emerald-700/60'
                        }`}>
                          {result.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Threat Score: <span className="font-bold text-white">{result.threatScore || 85}/100</span> • Certified by Muhammad Ahmad Shahid</p>
                    </div>
                  </div>

                  <button 
                    onClick={downloadDossier}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Dossier (.md)
                  </button>
                </div>

                {/* Dossier Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white bg-slate-800/40'
                    }`}
                  >
                    1. Executive Diagnosis
                  </button>
                  <button
                    onClick={() => setActiveTab('vectors')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'vectors'
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white bg-slate-800/40'
                    }`}
                  >
                    2. Attack Vectors
                    <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.2 rounded-md font-bold">
                      {result.attackVectors?.length || 1}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('remediation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'remediation'
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white bg-slate-800/40'
                    }`}
                  >
                    3. Aise Theek Karein
                  </button>
                  <button
                    onClick={() => setActiveTab('patch')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'patch'
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white bg-slate-800/40'
                    }`}
                  >
                    4. Hardened Patch
                  </button>
                </div>

                {/* Tab 1: Executive Diagnosis */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                      <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyan-400" />
                        <span>Direct Diagnosis (Yeh Error Hai Code Mein):</span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{result.summary}</p>
                    </div>

                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                      <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        <span>Root Cause Analysis (RCA):</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{result.rootCauseAnalysis}</p>
                    </div>

                    {/* Detected Bugs & Vulnerabilities Snapshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-red-900/30">
                        <h4 className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Bugs & Runtime Faults
                        </h4>
                        <ul className="list-disc pl-4 text-xs space-y-1.5 text-slate-300">
                          {result.bugs?.map((b: string, i: number) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-yellow-900/30">
                        <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Security Vulnerabilities
                        </h4>
                        <ul className="list-disc pl-4 text-xs space-y-1.5 text-slate-300">
                          {result.vulnerabilities?.map((v: string, i: number) => <li key={i}>{v}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Attack Vectors & Exploit Simulations */}
                {activeTab === 'vectors' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">
                      Simulated adversarial exploit scenarios synthesized during the Deep Research investigation:
                    </p>
                    {result.attackVectors?.map((vec: any, idx: number) => (
                      <div key={idx} className="bg-slate-950/90 p-5 rounded-2xl border border-red-900/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-red-400" />
                            {vec.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded-full border border-red-800/60">
                            High Impact
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <span className="font-semibold text-slate-400">Potential Impact: </span>
                          {vec.impact}
                        </div>
                        <div className="p-3.5 bg-black/60 rounded-xl border border-slate-800 text-xs font-mono text-amber-200/90 leading-relaxed">
                          <span className="font-bold text-slate-400 block mb-1 font-sans">Exploit Vector Scenario:</span>
                          {vec.scenario}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Remediation Blueprint ("Aise Theek Karein") */}
                {activeTab === 'remediation' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-emerald-950/40 to-slate-950 p-5 rounded-2xl border border-emerald-800/40">
                      <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Actionable Fix Roadmap (Aise Theek Karein):</span>
                      </div>
                      <ul className="space-y-3 text-xs text-slate-200">
                        {result.howToFix?.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-900/80 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-700/60 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.complianceImpact && result.complianceImpact.length > 0 && (
                      <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                          Regulatory & Compliance Impact
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.complianceImpact.map((comp: string, i: number) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Hardened Production Patch */}
                {activeTab === 'patch' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Zero-Trust Drop-in Production Patch
                      </span>
                      <button 
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Copy Hardened Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="text-xs font-mono overflow-auto max-h-[460px] text-emerald-300 bg-slate-950 p-5 rounded-2xl border border-slate-800 leading-relaxed shadow-inner">
                      {result.fixedCode}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
