import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, Activity, ShieldAlert } from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading admin data...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[var(--color-neon-purple)] mb-8 uppercase tracking-widest">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Users />} title="Total Users" value={stats.total_users} color="text-blue-400" />
        <StatCard icon={<Search />} title="Total Scans" value={stats.total_scans} color="text-green-400" />
        <StatCard icon={<ShieldAlert />} title="Compromised Scans" value={stats.compromised_scans} color="text-red-400" />
        <StatCard icon={<Activity />} title="System Status" value="Online" color="text-[var(--color-neon-blue)]" />
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Recent System Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 uppercase text-xs">
                <th className="p-3">Time</th>
                <th className="p-3">Action</th>
                <th className="p-3">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_logs?.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                  <td className="p-3 text-sm text-gray-400">{new Date(log.time).toLocaleString()}</td>
                  <td className="p-3 text-sm text-white">{log.action}</td>
                  <td className="p-3 text-sm font-mono text-gray-500">{log.ip || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`glass-panel p-6 rounded-xl flex items-center justify-between border-l-4 ${color.replace('text-', 'border-')}`}>
    <div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
    <div className={`p-4 bg-black/40 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

export default AdminPanel;
