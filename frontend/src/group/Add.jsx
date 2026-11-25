import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser } from '../utils/auth';
import { UsersIcon, PlusIcon, ArrowLeftIcon } from '../components/Icons';

const GROUP_CATEGORIES = [
  'Dinner & Food',
  'Groceries',
  'Stay & Hotel',
  'Cab & Fuel',
  'Tickets & Outing',
  'Drinks & Snacks',
  'Other'
];

const Add = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expense, setExpense] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invite = sessionStorage.getItem('inviteCode');
    const paidBy = user.id || sessionStorage.getItem('id');

    if (!invite) {
      setError('No active group found. Please rejoin your group.');
      return;
    }

    if (!paidBy) {
      setError('User session not found. Please log in again.');
      return;
    }

    if (!category.trim() || !expense) {
      setError('Please provide category and amount.');
      return;
    }

    setLoading(true);
    setError('');

    const desc = description.trim() || category.trim();

    try {
      const response = await axios.post(`http://localhost:5000/group-expenses/${invite}`, {
        paidBy,
        expense: Number(expense),
        category: category.trim(),
        description: desc
      });

      if (response.data.success) {
        navigate('/groupchat');
      } else {
        setError(response.data.message || 'Failed to record group expense.');
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12">
        
        <div className="mb-6">
          <Link
            to="/groupchat"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back to Group Dashboard</span>
          </Link>
        </div>

        <div className="app-card p-6 sm:p-8">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UsersIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Add Group Expense</h1>
              <p className="text-xs text-slate-400">Record a payment made for the group</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {GROUP_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      category === cat
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-[#12151c] text-slate-300 hover:text-white border border-[#232936]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or custom category..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-md app-input text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Note / Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dinner at Paradise, Highway toll"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-md app-input text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Amount Paid (INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-medium text-sm pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="any"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-md app-input text-base font-semibold"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
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
                    <span>Save Group Expense</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/groupchat')}
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
};

export default Add;
