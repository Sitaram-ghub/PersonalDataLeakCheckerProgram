import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Info, CheckCircle, AlertTriangle, Activity, Settings, UserCheck } from 'lucide-react';

const PrivacyScorePage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState({
    use2FA: false,
    reusedPasswords: true,
    commonPatterns: false,
    updateRegularly: false
  });

  const [analysis, setAnalysis] = useState({
    score: 0,
    level: 'Calculating...',
    suggestions: []
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/user/history');
        setHistory(res.data.history);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const getAIAnalysis = async () => {
      try {
        const res = await api.post('/ai/privacy-analysis', { habits });
        setAnalysis(res.data);
      } catch (err) {
        console.error("Privacy AI Error:", err);
      }
    };
    if (!loading) getAIAnalysis();
  }, [history, habits, loading]);

  const toggleHabit = (key) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div className="p-20 text-center neon-text animate-pulse">Initializing Privacy Engine...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left: Input & Habits */}
        <div className="md:w-1/2 space-y-6">
          <div className="glass-panel p-8 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-black text-white mb-6 tracking-tight uppercase italic flex items-center gap-3">
              <Settings className="text-[var(--color-neon-blue)]" /> Privacy_Audit
            </h2>
            
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Select your security habits:</p>
              
              {[
                { id: 'use2FA', label: 'I use Two-Factor Authentication (2FA)', icon: <Lock /> },
                { id: 'reusedPasswords', label: 'I reuse passwords across websites', icon: <ShieldAlert /> },
                { id: 'updateRegularly', label: 'I change passwords every 3 months', icon: <UserCheck /> },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    (h.id === 'reusedPasswords' ? !habits[h.id] : habits[h.id]) 
                      ? 'bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]/40 text-white' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-medium">{h.label}</span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                    (h.id === 'reusedPasswords' ? !habits[h.id] : habits[h.id]) ? 'bg-[var(--color-neon-blue)] border-transparent text-black' : 'border-gray-700'
                  }`}>
                    {(h.id === 'reusedPasswords' ? !habits[h.id] : habits[h.id]) && <CheckCircle className="w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[var(--color-neon-purple)]/5 flex items-start gap-4">
             <Info className="w-5 h-5 text-[var(--color-neon-purple)] mt-1" />
             <p className="text-xs text-gray-400 leading-relaxed">
               This score is calculated using our <strong>Proprietary Privacy Logic</strong>. We analyze your breach history and combined with your reported habits to give an accurate threat assessment.
             </p>
          </div>
        </div>

        {/* Right: Results & Score */}
        <div className="md:w-1/2 space-y-6">
          <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center relative overflow-hidden">
            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Privacy_Score_Index</h3>
            
            {/* Circular Score Gauge */}
            <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="112" cy="112" r="100" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                <motion.circle 
                  cx="112" cy="112" r="100" fill="transparent" 
                  stroke={analysis.score > 70 ? '#22c55e' : analysis.score > 40 ? '#fb923c' : '#ef4444'} 
                  strokeWidth="16" 
                  strokeDasharray={628}
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 - (628 * analysis.score) / 100 }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="text-7xl font-black text-white">{Math.round(analysis.score)}</motion.span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">/ 100</span>
              </div>
            </div>

            <div className={`text-2xl font-black uppercase tracking-tighter italic mb-4 ${
              analysis.score > 70 ? 'text-green-500' : analysis.score > 40 ? 'text-orange-400' : 'text-red-500'
            }`}>
              {analysis.level} Detected
            </div>
            
            {/* Background Glow */}
            <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[120px] opacity-20 rounded-full transition-all duration-1000 ${
              analysis.score > 70 ? 'bg-green-600' : analysis.score > 40 ? 'bg-orange-600' : 'bg-red-600'
            }`}></div>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest px-2">Improvement_Suggestions</h4>
            {analysis.suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-5 rounded-xl border border-white/5 flex gap-4 items-start group hover:border-white/10"
              >
                <div className={`p-2 rounded-lg ${s.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {s.priority === 'High' ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">{s.title}</h5>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyScorePage;
