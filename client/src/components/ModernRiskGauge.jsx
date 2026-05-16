import React from 'react';
import { motion } from 'framer-motion';

const ModernRiskGauge = ({ score, level }) => {
  const getColor = () => {
    if (score > 70) return '#ff4d4d'; // Red
    if (score > 30) return '#fb923c'; // Orange
    return '#22c55e'; // Green
  };

  const getGlow = () => {
    if (score > 70) return '0 0 20px rgba(255, 77, 77, 0.4)';
    if (score > 30) return '0 0 20px rgba(251, 146, 60, 0.4)';
    return '0 0 20px rgba(34, 197, 94, 0.4)';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-white/5 h-full min-h-[280px] relative overflow-hidden group">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 z-10">Risk_Meter_v2</h3>
      
      <div className="relative w-44 h-44 flex items-center justify-center z-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88" cy="88" r="75"
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="10"
          />
          <motion.circle
            cx="88" cy="88" r="75"
            fill="transparent"
            stroke={getColor()}
            strokeWidth="12"
            strokeDasharray={471}
            initial={{ strokeDashoffset: 471 }}
            animate={{ strokeDashoffset: 471 - (471 * score) / 100 }}
            transition={{ duration: 2, ease: "circOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(${getGlow()})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl font-black text-white"
          >
            {score}
          </motion.span>
          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${score > 70 ? 'text-red-500' : score > 30 ? 'text-orange-400' : 'text-green-500'}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 transition-all group-hover:opacity-20" style={{ background: getColor() }}></div>
    </div>
  );
};

export default ModernRiskGauge;
