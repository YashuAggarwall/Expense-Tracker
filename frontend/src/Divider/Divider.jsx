import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser, isAuthenticated } from '../utils/auth';
import { CalculatorIcon, PlusIcon, CheckIcon, WalletIcon } from '../components/Icons';

const TIP_PERCENTAGES = [0, 5, 10, 15, 20];

const Divider = () => {
  const [amount, setAmount] = useState('');
  const [tip, setTip] = useState(0);
  const [member, setMember] = useState(2);
  const [amountshare, setAmountshare] = useState(0);
  const [tipshare, setTipshare] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getAuthUser();
  const isAuth = isAuthenticated();

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    const billAmount = Number(amount) || 0;
    const numMembers = Number(member) || 0;
    const tipAmount = Number(tip) || 0;

    if (billAmount <= 0 || numMembers <= 0) return;

    setLoading(true);
    setAddedMsg('');

    try {
      const response = await axios.post('http://localhost:5000/divider', {
        amount: billAmount,
        tip: tipAmount,
        member: numMembers
      });

      if (response.status === 200) {
        setAmountshare(response.data.amountShare);
        setTipshare(response.data.tipShare);
        setCalculated(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback local math
      const billShare = Math.round((billAmount / numMembers) * 100) / 100;
      const tipPerPerson = Math.round((tipAmount / numMembers) * 100) / 100;
      setAmountshare(billShare);
      setTipshare(tipPerPerson);
      setCalculated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTipPercent = (pct) => {
    const billAmount = Number(amount) || 0;
    const calculatedTip = Math.round((billAmount * pct) / 100);
    setTip(calculatedTip);
  };

  const handleAddToExpense = async () => {
    if (!isAuth) {
      setAddedMsg('Log in to save this share to your personal expenses.');
      return;
    }

    const totalShare = Math.round(Number(amountshare) + Number(tipshare));
    try {
      await axios.post('http://localhost:5000/add-expense', {
        category: 'Split Bill',
        price: totalShare,
        username: user.username
      });
      setAddedMsg(`Saved ₹${totalShare} to your personal expenses.`);
    } catch (e) {
      console.error(e);
      setAddedMsg('Could not save expense. Please try again.');
    }
  };

  const totalSharePerPerson = Math.round((Number(amountshare) + Number(tipshare)) * 100) / 100;
  const totalBillWithTip = (Number(amount) || 0) + (Number(tip) || 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <CalculatorIcon className="w-3.5 h-3.5" />
            <span>Split Utility</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Bill & Tip Splitter</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Split restaurant checks, fuel, or group expenses equally among friends
          </p>
        </div>

        {addedMsg && (
          <div className="mb-6 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-400" />
              <span>{addedMsg}</span>
            </div>
            {isAuth && (
              <Link to="/expenses" className="text-xs font-medium text-emerald-400 hover:underline">
                View Expenses →
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Inputs */}
          <div className="md:col-span-7 app-card p-5 sm:p-6 space-y-5">
            
            {/* Bill Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Total Bill Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-base pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCalculate(e);
                  }}
                  className="w-full pl-8 pr-3 py-2 rounded-md app-input text-base font-semibold"
                />
              </div>
            </div>

            {/* Tip Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Tip
                </label>
                <span className="text-xs text-slate-400 font-medium">₹{tip}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {TIP_PERCENTAGES.map((pct) => (
                  <button
                    type="button"
                    key={pct}
                    onClick={() => handleTipPercent(pct)}
                    className="py-1.5 rounded text-xs font-medium bg-[#12151c] hover:bg-[#1b202c] text-slate-300 border border-[#232936] transition-colors cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs pointer-events-none">
                  Custom ₹
                </span>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className="w-full pl-18 pr-3 py-1.5 rounded-md app-input text-xs"
                />
              </div>
            </div>

            {/* People Count Stepper */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Number of People
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={Number(member) <= 0}
                  onClick={() => {
                    const nextVal = Math.max(0, Number(member) - 1);
                    setMember(nextVal);
                    if (nextVal <= 0) setCalculated(false);
                  }}
                  className="w-10 h-10 rounded-md bg-[#12151c] hover:bg-[#1b202c] text-white font-bold border border-[#232936] flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={member}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setMember(0);
                      setCalculated(false);
                    } else {
                      const num = parseInt(val, 10);
                      const nextVal = isNaN(num) ? 0 : Math.max(0, num);
                      setMember(nextVal);
                      if (nextVal <= 0) setCalculated(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCalculate(e);
                  }}
                  className="flex-1 py-2 text-center rounded-md app-input font-bold text-base"
                />
                <button
                  type="button"
                  onClick={() => setMember(Number(member) + 1)}
                  className="w-10 h-10 rounded-md bg-[#12151c] hover:bg-[#1b202c] text-white font-bold border border-[#232936] flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
              {Number(member) <= 0 && (
                <p className="text-[11px] text-amber-400 mt-1.5">
                  Must be at least 1 person to calculate split.
                </p>
              )}
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={handleCalculate}
              disabled={loading || !amount || Number(amount) <= 0 || Number(member) <= 0}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <CalculatorIcon className="w-4 h-4" />
                  <span>Calculate Split</span>
                </>
              )}
            </button>

          </div>

          {/* Breakdown Card */}
          <div className="md:col-span-5 app-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Split Summary
              </span>
              <span className="text-xs text-slate-400">
                {Number(member) <= 0 ? '0 people' : `${member} ${Number(member) === 1 ? 'person' : 'people'}`}
              </span>
            </div>

            {/* Per Person Highlight Box */}
            <div className="p-4 rounded-lg bg-[#12151c] border border-[#232936] text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Each Person Pays
              </span>
              <p className="text-3xl font-extrabold text-emerald-400">
                ₹{Number(member) <= 0 ? 0 : totalSharePerPerson.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Bill share + Tip share
              </span>
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Bill Total</span>
                <span className="text-white font-medium">₹{Number(amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tip Added</span>
                <span className="text-white font-medium">₹{Number(tip || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1.5 border-t border-[#232936]">
                <span className="font-medium">Total Bill + Tip</span>
                <span className="text-white font-bold">₹{totalBillWithTip.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Per Person Base</span>
                <span className="text-white font-medium">₹{Number(member) <= 0 ? 0 : amountshare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Per Person Tip</span>
                <span className="text-white font-medium">₹{Number(member) <= 0 ? 0 : tipshare.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {calculated && Number(member) > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToExpense}
                  className="w-full py-2 px-3 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <WalletIcon className="w-3.5 h-3.5" />
                  <span>Add My Share (₹{totalSharePerPerson}) to Expenses</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
};

export default Divider;
