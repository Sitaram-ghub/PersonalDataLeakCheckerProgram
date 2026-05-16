import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

const RiskAnalyzer = ({ metrics }) => {
  if (!metrics) return null;

  const { score, level, summary } = metrics;

  const getLevelColor = (level) => {
    switch (level) {
      case 'High Risk': return 'text-[var(--color-alert-red)]';
      case 'Medium Risk': return 'text-orange-400';
      case 'Safe': return 'text-[var(--color-safe-green)]';
      default: return 'text-gray-400';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'High Risk': return <ShieldAlert className="w-12 h-12" />;
      case 'Medium Risk': return <AlertTriangle className="w-12 h-12" />;
      case 'Safe': return <ShieldCheck className="w-12 h-12" />;
      default: return null;
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl border border-white/5 mb-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* Risk Gauge */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke={level === 'High Risk' ? 'var(--color-alert-red)' : level === 'Medium Risk' ? '#fb923c' : 'var(--color-safe-green)'}
              strokeWidth="12"
              strokeDasharray={440}
              initial={{ strokeDashoffset: 440 }}
              animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white">{score}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">RISK_SCORE</span>
          </div>
        </div>

        {/* Risk Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            <div className={getLevelColor(level)}>
              {getLevelIcon(level)}
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">STATUS_ANALYSIS</p>
              <h2 className={`text-3xl font-black uppercase tracking-tight ${getLevelColor(level)}`}>
                {level}
              </h2>
            </div>
          </div>
          <p className="text-gray-300 text-lg font-medium leading-tight mb-4">
            {summary}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold">
              ANALYZED_BY_AI_V4
            </span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold">
              REAL_TIME_BREACH_DATA
            </span>
          </div>
        </div>
      </div>

      {/* Background Decorative Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -mr-32 -mt-32 rounded-full ${level === 'High Risk' ? 'bg-red-600' : level === 'Medium Risk' ? 'bg-orange-600' : 'bg-green-600'}`}></div>
    </div>
  );
};

export default RiskAnalyzer;
