import React, { useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const CheckerPage = () => {
  const [input, setInput] = useState('');
  const [type, setType] = useState('email');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    
    if (type === 'phone' && input.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/check/', { input, type });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error performing check');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-black uppercase tracking-wider mb-4">Threat Scanner</h1>
        <p className="text-gray-400">Enter your details below to check against our aggregated database of public data breaches.</p>
      </motion.div>

      <div className="glass-panel p-6 md:p-10 rounded-2xl neon-border mb-10">
        <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4">
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-700 text-white rounded px-4 py-3 md:w-1/4 focus:outline-none focus:border-[var(--color-neon-blue)]"
          >
            <option value="email">Email Address</option>
            <option value="phone">Phone Number</option>
            <option value="username">Username</option>
          </select>
          <input 
            type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
            value={input}
            onChange={(e) => {
              if (type === 'phone') {
                const val = e.target.value.replace(/\D/g, ''); // only numbers
                if (val.length <= 10) setInput(val);
              } else {
                setInput(e.target.value);
              }
            }}
            placeholder={type === 'phone' ? "Enter 10-digit phone number..." : `Enter your ${type}...`}
            className="flex-grow bg-[#1a1a1a] border border-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:border-[var(--color-neon-blue)]"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[var(--color-neon-blue)] text-black font-bold px-8 py-3 rounded uppercase tracking-wider hover:bg-[#00d0e0] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 min-w-[160px]"
          >
            {loading ? <span className="animate-pulse">Scanning...</span> : <><Search className="w-5 h-5" /> Scan</>}
          </button>
        </form>
        {error && <div className="mt-4 text-[var(--color-alert-red)]">{error}</div>}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {result.status === 'COMPROMISED' ? (
              <div className="bg-red-900/20 border border-[var(--color-alert-red)] rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle className="w-48 h-48 text-[var(--color-alert-red)]" /></div>
                <div className="relative z-10 flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[var(--color-alert-red)] rounded-full text-black">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-[var(--color-alert-red)] tracking-widest">COMPROMISED</h2>
                    <p className="text-xl text-white">Found in {result.breach_count} data breach{result.breach_count > 1 ? 'es' : ''}</p>
                  </div>
                </div>

                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Breach Details</h3>
                  {result.details?.map((breach, idx) => (
                    <div key={idx} className="bg-black/40 p-4 rounded-lg border border-red-500/30">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-bold text-red-300">{breach.Name}</h4>
                        <span className="text-sm text-gray-400">{breach.BreachDate}</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2"><strong>Exposed Data:</strong> {breach.DataClasses?.join(', ')}</p>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 mt-8 bg-black/40 p-6 rounded-lg border border-red-500/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[var(--color-alert-red)]" /> Recommended Actions
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Immediately change the password for the affected accounts.</li>
                    <li>Enable Two-Factor Authentication (2FA) wherever possible.</li>
                    <li>Ensure you are not reusing the compromised password on other sites.</li>
                    <li>Monitor your accounts for suspicious activities.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-green-900/20 border border-[var(--color-safe-green)] rounded-2xl p-8 flex items-center gap-6">
                <div className="p-4 bg-[var(--color-safe-green)] rounded-full text-black">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[var(--color-safe-green)] tracking-widest">NO BREACH FOUND</h2>
                  <p className="text-lg text-gray-300 mt-2">Your data does not appear in any known public databases we scanned. Keep up the good security practices!</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckerPage;
