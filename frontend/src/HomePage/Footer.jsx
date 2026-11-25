import React from 'react';
import { Link } from 'react-router-dom';
import { WalletIcon } from '../components/Icons';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#1f2533] bg-[#12151c] mt-auto py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <WalletIcon className="w-3 h-3" />
          </div>
          <span className="font-semibold text-slate-300">monetraq</span>
          <span>— Simple expense tracking & bill splitting</span>
        </div>

        <div className="flex items-center gap-5 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Overview</Link>
          <Link to="/expenses" className="hover:text-white transition-colors">Expenses</Link>
          <Link to="/group" className="hover:text-white transition-colors">Groups</Link>
          <Link to="/divider" className="hover:text-white transition-colors">Splitter</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
