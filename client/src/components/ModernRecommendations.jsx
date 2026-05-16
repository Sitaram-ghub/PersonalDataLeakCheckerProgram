import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Key, Lock, Globe } from 'lucide-react';

const ModernRecommendations = ({ items }) => {
  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('password')) return <Key className="w-4 h-4" />;
    if (t.includes('auth') || t.includes('2fa')) return <Lock className="w-4 h-4" />;
    if (t.includes('public') || t.includes('web')) return <Globe className="w-4 h-4" />;
    return <ShieldAlert className="w-4 h-4" />;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-[var(--color-neon-blue)] rounded-full"></div>
        <h3 className="text-xl font-bold text-white tracking-tight">Security Recommendations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items?.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex gap-4 items-start group"
          >
            <div className={`p-3 rounded-lg ${item.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'} group-hover:scale-110 transition-transform`}>
              {getIcon(item.title)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-white group-hover:text-[var(--color-neon-blue)] transition-colors">{item.title}</h4>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${item.priority === 'High' ? 'border-red-500/50 text-red-500' : 'border-blue-500/50 text-blue-500'}`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModernRecommendations;
