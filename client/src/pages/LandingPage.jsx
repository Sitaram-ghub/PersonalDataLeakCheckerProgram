import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ShieldAlert className="w-24 h-24 mx-auto text-[var(--color-neon-blue)] mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-wider">
          Is Your Data <span className="text-[var(--color-alert-red)] drop-shadow-[0_0_10px_rgba(255,51,51,0.5)]">Compromised?</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
          Check if your email, phone number, or username has been exposed in public data breaches. Stay one step ahead of threats.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
          <Link 
            to="/check" 
            className="px-8 py-4 bg-[var(--color-neon-blue)] text-black font-bold text-lg rounded shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:scale-105 transition-all duration-300 uppercase tracking-wide"
          >
            Start Scan Now
          </Link>
          <Link 
            to="/register" 
            className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white font-bold text-lg rounded hover:border-[var(--color-neon-purple)] hover:text-[var(--color-neon-purple)] hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] transform hover:scale-105 transition-all duration-300 uppercase tracking-wide"
          >
            Create Account
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard 
          icon={<Activity className="w-10 h-10 text-[var(--color-neon-blue)]" />}
          title="Real-time Scanning"
          desc="Access up-to-date databases to find out if your information has been leaked instantly."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Lock className="w-10 h-10 text-[var(--color-neon-purple)]" />}
          title="Secure & Private"
          desc="We never store your search queries. Your privacy is our top priority."
          delay={0.4}
        />
        <FeatureCard 
          icon={<ShieldAlert className="w-10 h-10 text-[var(--color-alert-red)]" />}
          title="Actionable Insights"
          desc="Get immediate steps to secure your accounts if a breach is detected."
          delay={0.6}
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="glass-panel p-8 rounded-xl hover:border-[var(--color-neon-blue)] transition-colors duration-300"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default LandingPage;
