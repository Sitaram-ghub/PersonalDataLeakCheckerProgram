import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Zap, Lock, Eye, EyeOff, Activity, CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const PasswordStrengthPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'None', color: 'gray', time: 'N/A' });
  const [patterns, setPatterns] = useState([]);
  const [advice, setAdvice] = useState('Wait for security analysis...');
  const [analyzing, setAnalyzing] = useState(false);

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'gray', time: 'N/A' };

    let score = 0;
    let charsetSize = 0;

    if (/[a-z]/.test(pwd)) { score += 1; charsetSize += 26; }
    if (/[A-Z]/.test(pwd)) { score += 1; charsetSize += 26; }
    if (/[0-9]/.test(pwd)) { score += 1; charsetSize += 10; }
    if (/[^A-Za-z0-9]/.test(pwd)) { score += 1; charsetSize += 33; }
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;

    // Entropy calculation: L * log2(Charset)
    const entropy = pwd.length * Math.log2(charsetSize || 1);
    
    // Crack time estimation (Assuming 10 billion guesses per second - standard high-end PC)
    const guessesPerSecond = 1e10;
    const totalGuesses = Math.pow(charsetSize || 1, pwd.length);
    const seconds = totalGuesses / guessesPerSecond;

    const formatTime = (s) => {
      if (s < 1) return "Instant";
      if (s < 60) return `${Math.floor(s)} seconds`;
      if (s < 3600) return `${Math.floor(s / 60)} minutes`;
      if (s < 86400) return `${Math.floor(s / 3600)} hours`;
      if (s < 31536000) return `${Math.floor(s / 86400)} days`;
      if (s < 31536000000) return `${Math.floor(s / 31536000)} years`;
      return "Centuries";
    };

    let label = 'Weak';
    let color = '#ef4444'; // Red
    if (score >= 4) { label = 'Medium'; color = '#fb923c'; } // Orange
    if (score >= 6) { label = 'Strong'; color = '#22c55e'; } // Green

    return { score: (score / 6) * 100, label, color, time: formatTime(seconds) };
  };


  useEffect(() => {
    setStrength(calculateStrength(password));
    
    if (password.length > 2) {
      setAnalyzing(true);
      const timer = setTimeout(async () => {
        try {
          const res = await api.post('/ai/password-analysis', { password });
          setPatterns(res.data.patterns || []);
          setAdvice(res.data.advice || 'Avoid using predictable patterns.');
        } catch (err) {
          if (err.response && err.response.status === 401) {
             setAdvice("Session Expired. Please login again to see patterns.");
          } else {
             setAdvice(`Connection Error: ${err.message}. Check your backend server.`);
          }
        } finally {
          setAnalyzing(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setPatterns([]);
      setAdvice('Type more for deep security analysis...');
    }
  }, [password]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">
          Password <span className="text-[var(--color-neon-blue)]">Fortress</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Encryption_Strength_Analysis_v2.1</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Input Card */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-[var(--color-neon-blue)]" />
            <h2 className="text-xl font-bold text-white">Input_String</h2>
          </div>

          <div className="relative mb-8">
            <input 
              type={showPassword ? "text" : "password"}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white text-lg font-mono focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all placeholder:text-gray-700"
              placeholder="Enter password to test..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Requirements_Checklist</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '8+ Characters', check: password.length >= 8 },
                { label: 'Uppercase', check: /[A-Z]/.test(password) },
                { label: 'Lowercase', check: /[a-z]/.test(password) },
                { label: 'Numbers', check: /[0-9]/.test(password) },
                { label: 'Symbols', check: /[^A-Za-z0-9]/.test(password) },
                { label: '12+ Extended', check: password.length >= 12 },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${item.check ? 'text-green-500' : 'text-gray-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.check ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-gray-800'}`}></div>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 h-full flex flex-col justify-center">
            {/* Strength Gauge */}
            <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <motion.circle 
                  cx="80" cy="80" r="70" fill="transparent" 
                  stroke={strength.color} strokeWidth="12" 
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * strength.score) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${strength.color}44)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{Math.round(strength.score)}%</span>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">STRENGTH</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2" style={{ color: strength.color }}>
                {strength.label}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                {password ? `This password can be cracked in ${strength.time}.` : "Enter a password to estimate crack time."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-[var(--color-neon-blue)]" /> Crack_Time
                </p>
                <h4 className="text-lg font-bold text-white">{strength.time}</h4>
                <p className="text-[8px] text-gray-400 mt-1 uppercase tracking-wider">@ 10 Billion Guesses / Sec</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-500" /> Entropy
                </p>
                <h4 className="text-lg font-bold text-white">{password ? Math.floor(password.length * Math.log2(password.length > 0 ? 70 : 1)) : 0} bits</h4>
                <p className="text-[8px] text-gray-400 mt-1 uppercase tracking-wider">Information_Density</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4 bg-[var(--color-neon-blue)]/5">
            <div className="p-3 bg-[var(--color-neon-blue)]/20 rounded-lg text-[var(--color-neon-blue)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "A strong password is your first line of defense. Use phrases, mix symbols, and never reuse them across accounts."
            </p>
          </div>
        </div>

      </div>

      {/* Security Pattern Analysis Section */}
      <AnimatePresence>
        {password && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 glass-panel p-8 rounded-2xl border border-white/5 bg-red-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Security Pattern Analysis</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Heuristic_Detection_Engine</p>
              </div>
            </div>

            <div className="space-y-4">
              {patterns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patterns.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-red-500/20">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-sm font-bold text-gray-300">{p}</span>
                    </div>
                  ))}
                </div>
              ) : analyzing ? (
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-3">
                   <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                   <span className="text-sm font-bold text-blue-500 italic">Security expert is auditing your password...</span>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold text-green-500">No predictable patterns detected. Good complexity!</span>
                </div>
              )}

              <div className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <p className="text-sm text-gray-400 font-medium italic leading-relaxed">
                  <span className="text-[var(--color-neon-blue)] font-black not-italic mr-2">SECURITY_ADVICE:</span> 
                  {analyzing ? "Analyzing security patterns..." : advice}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PasswordStrengthPage;
