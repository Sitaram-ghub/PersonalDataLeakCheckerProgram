import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, CheckCircle, Activity, Calendar, Hash, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import ModernRiskGauge from '../components/ModernRiskGauge';
import ModernRecommendations from '../components/ModernRecommendations';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyRes = await api.get('/user/history');
        setHistory(historyRes.data.history);
        setLoading(false);

        const analysisRes = await api.get('/ai/analysis');
        setAnalysis(analysisRes.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setAnalysisLoading(false);
      }
    };
    fetchData();
  }, []);

  const lastChecked = history.length > 0 ? history[0].created_at : 'Never';
  const compromisedCount = history.filter(s => s.result.toLowerCase().includes('compromised')).length;

  // Simple hardcoded security score if AI fails
  const securityScore = analysis?.risk_metrics?.score || (100 - (compromisedCount * 15));
  const finalScore = Math.max(0, Math.min(100, securityScore));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Section: Welcome & Stats Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10 items-stretch">
        
        {/* Welcome Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:w-1/3 glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="z-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">System_Online</h1>
            <p className="text-gray-400 text-sm font-mono uppercase tracking-widest">User: {user?.name}</p>
          </div>
          
          <div className="mt-10 space-y-4 z-10">
            <div className="flex items-center gap-3 text-gray-400">
              <Calendar className="w-4 h-4 text-[var(--color-neon-blue)]" />
              <span className="text-xs font-bold uppercase tracking-tighter">Last Scan: {new Date(lastChecked).toLocaleDateString() || 'No Data'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Hash className="w-4 h-4 text-[var(--color-neon-blue)]" />
              <span className="text-xs font-bold uppercase tracking-tighter">Total Scans: {history.length}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Shield className="w-4 h-4 text-[var(--color-neon-blue)]" />
              <span className="text-xs font-bold uppercase tracking-tighter">Status: Active Monitoring</span>
            </div>
          </div>

          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--color-neon-blue)]/5 blur-3xl rounded-full"></div>
        </motion.div>

        {/* Risk Meter Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-1/3"
        >
          <ModernRiskGauge score={finalScore} level={analysis?.risk_metrics?.level || 'Analyzing...'} />
        </motion.div>

        {/* Stats Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/3 grid grid-cols-1 gap-4"
        >
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-6 group hover:border-red-500/20 transition-all">
            <div className="p-4 bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total_Compromised</p>
              <h3 className="text-3xl font-black text-white">{compromisedCount}</h3>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-6 group hover:border-green-500/20 transition-all">
            <div className="p-4 bg-green-500/10 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Security_Posture</p>
              <h3 className="text-3xl font-black text-white">{100 - finalScore}%</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Section */}
      <ModernRecommendations items={analysis?.recommendations} />

      {/* Scan History Table */}
      <div className="mt-12 glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[var(--color-neon-blue)]" />
            <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity Log</h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Live_Updates_Enabled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Access_Point</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((scan, index) => (
                <tr key={index} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    {new Date(scan.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white group-hover:text-[var(--color-neon-blue)] transition-colors">
                      {scan.input}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${
                      scan.result.toLowerCase().includes('compromised') 
                        ? 'border-red-500/30 text-red-500 bg-red-500/5' 
                        : 'border-green-500/30 text-green-500 bg-green-500/5'
                    }`}>
                      {scan.result.toLowerCase().includes('compromised') ? 'BREACH_DETECTED' : 'SECURE'}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-500 font-mono text-sm tracking-widest">
                    NO_DATA_LOGGED_YET
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
