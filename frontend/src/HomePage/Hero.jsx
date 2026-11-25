import React from 'react';
import { Link } from 'react-router-dom';
import { WalletIcon, UsersIcon, CalculatorIcon, PlusIcon, ArrowRightIcon } from '../components/Icons';
import { isAuthenticated } from '../utils/auth';

const Hero = () => {
  const isAuth = isAuthenticated();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Intro Header */}
      <div className="max-w-2xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161a23] border border-[#232936] text-xs font-medium text-emerald-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Personal & Shared Finance
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Track expenses and split bills with friends.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          Log daily transactions, create shared tabs for roommates or trips with 6-character invite codes, and calculate fair bill splits in seconds.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={isAuth ? "/add-expense" : "/login"}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add an Expense</span>
          </Link>

          <Link
            to={isAuth ? "/group" : "/login"}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-slate-200 bg-[#161a23] hover:bg-[#1b202c] border border-[#232936] transition-colors"
          >
            <UsersIcon className="w-4 h-4 text-slate-400" />
            <span>Group Hub</span>
          </Link>

          <Link
            to="/divider"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-slate-200 bg-[#161a23] hover:bg-[#1b202c] border border-[#232936] transition-colors"
          >
            <CalculatorIcon className="w-4 h-4 text-slate-400" />
            <span>Split a Bill</span>
          </Link>
        </div>
      </div>

      {/* 3 Practical Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Personal Log Card */}
        <div className="app-card p-6 flex flex-col justify-between hover:border-[#323b4e] transition-colors">
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#1b202c] border border-[#283042] flex items-center justify-center text-emerald-400 mb-4">
              <WalletIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Personal Expenses</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Record daily purchases with categories, keep track of accumulated totals, and manage your transaction history.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1f2533] flex items-center gap-2">
            <Link
              to="/add-expense"
              className="flex-1 text-center py-2 px-3 rounded-md text-xs font-semibold bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 transition-colors"
            >
              + Add Expense
            </Link>
            <Link
              to="/expenses"
              className="flex-1 text-center py-2 px-3 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-[#12151c] hover:bg-[#1b202c] border border-[#232936] transition-colors"
            >
              View Log
            </Link>
          </div>
        </div>

        {/* Group Collaboration Card */}
        <div className="app-card p-6 flex flex-col justify-between hover:border-[#323b4e] transition-colors">
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#1b202c] border border-[#283042] flex items-center justify-center text-indigo-400 mb-4">
              <UsersIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Group Spending</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create a group for trips or flatmates. Share your invite code and log collective expenses with automated equal split calculations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1f2533] flex items-center gap-2">
            <Link
              to="/group"
              className="flex-1 text-center py-2 px-3 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
            >
              New Group
            </Link>
            <Link
              to="/join-group"
              className="flex-1 text-center py-2 px-3 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-[#12151c] hover:bg-[#1b202c] border border-[#232936] transition-colors"
            >
              Join Group
            </Link>
          </div>
        </div>

        {/* Bill Splitter Card */}
        <div className="app-card p-6 flex flex-col justify-between hover:border-[#323b4e] transition-colors">
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#1b202c] border border-[#283042] flex items-center justify-center text-amber-400 mb-4">
              <CalculatorIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Bill & Tip Splitter</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculate exact per-person costs with custom tips in seconds, then optionally push your portion directly to your personal logs.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1f2533]">
            <Link
              to="/divider"
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
            >
              <span>Open Splitter</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Hero;
