import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser } from '../utils/auth';
import { WalletIcon, PlusIcon, ArrowLeftIcon, CheckIcon } from './Icons';

const CATEGORY_PRESETS = [
  'Food & Dining',
  'Groceries',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Other'
];

function AddExpense() {
  const [form, setForm] = useState({ category: '', price: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getAuthUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (successMsg) setSuccessMsg('');
    if (errorMsg) setErrorMsg('');
  };

  const handleSelectPreset = (cat) => {
    setForm({ ...form, category: cat });
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category.trim() || !form.price) {
      setErrorMsg('Please enter both category and amount.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await axios.post('http://localhost:5000/add-expense', {
        category: form.category.trim(),
        price: Number(form.price),
        username: user.username
      });
      setSuccessMsg(`Added ₹${form.price} under "${form.category}"`);
      setForm({ category: '', price: '' });
    } catch (err) {
      setErrorMsg('Failed to record expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12">
        
        {/* Back Link */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/expenses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back to All Expenses</span>
          </Link>
          <Link
            to="/expenses"
            className="text-xs font-medium text-emerald-400 hover:underline"
          >
            View History →
          </Link>
        </div>

        {/* Card */}
        <div className="app-card p-6 sm:p-8">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <WalletIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Add Personal Expense</h1>
              <p className="text-xs text-slate-400">Record a new transaction</p>
            </div>
          </div>

          {successMsg && (
            <div className="mb-5 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
              <button
                onClick={() => navigate('/expenses')}
                className="text-xs font-semibold text-emerald-400 underline ml-2"
              >
                View
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Category Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleSelectPreset(cat)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      form.category === cat
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-[#12151c] text-slate-300 hover:text-white border border-[#232936]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                name="category"
                placeholder="Or type custom category..."
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md app-input text-sm"
                required
              />
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-medium text-sm pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="any"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 rounded-md app-input text-base font-semibold"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    <span>Save Expense</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/expenses')}
                className="py-2.5 px-4 rounded-md text-sm font-medium text-slate-300 bg-[#12151c] hover:bg-[#1b202c] border border-[#232936] transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default AddExpense;
