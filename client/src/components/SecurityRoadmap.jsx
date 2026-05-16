import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Zap, Shield, Lock, Layout, Activity } from 'lucide-react';

const SecurityRoadmap = ({ data, loading }) => {
  const roadmap = data || [];

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-[var(--color-alert-red)] bg-red-500/10 border-[var(--color-alert-red)]/30';
      case 'medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'low': return 'text-[var(--color-safe-green)] bg-green-500/10 border-[var(--color-safe-green)]/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'authentication': return <Lock className="w-4 h-4" />;
      case 'privacy': return <ShieldCheck className="w-4 h-4" />;
      case 'network': return <Zap className="w-4 h-4" />;
      case 'maintenance': return <Layout className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-xl text-center mb-8 border border-white/5">
        <Activity className="w-12 h-12 text-[var(--color-neon-blue)] animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Initializing_AI_Analysis...</p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Security Roadmap</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Personalized_Mitigation_Steps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {roadmap.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-xl border border-white/5 hover:border-[var(--color-neon-blue)]/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black border ${getPriorityColor(item.priority)} uppercase tracking-widest`}>
                  {item.priority}
                </span>
                <span className="text-gray-600 group-hover:text-[var(--color-neon-blue)] transition-colors">
                  {getCategoryIcon(item.category)}
                </span>
              </div>
              
              <h3 className="text-md font-bold text-white mb-2 group-hover:text-[var(--color-neon-blue)] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SecurityRoadmap;
