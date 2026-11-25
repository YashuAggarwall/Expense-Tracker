import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser } from '../utils/auth';
import { WalletIcon, PlusIcon, TrashIcon, EditIcon, DownloadIcon, ChartBarIcon } from './Icons';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState(null); // { _id, category, price }
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const user = getAuthUser();
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/expenses/${user.username}`);
      if (res.data) {
        setExpenses(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username) {
      fetchExpenses();
    }
  }, [user.username]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      await fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(`http://localhost:5000/expense-delete/${user.username}`);
      setExpenses([]);
      setTotal(0);
      setShowClearModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingExpense.category.trim() || !editingExpense.price) {
      setEditError("Please enter both category and price.");
      return;
    }

    setEditLoading(true);
    setEditError('');

    try {
      await axios.put(`http://localhost:5000/expense-edit/${editingExpense._id}`, {
        category: editingExpense.category.trim(),
        price: Number(editingExpense.price)
      });
      setEditingExpense(null);
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setEditError("Failed to update expense.");
    } finally {
      setEditLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!expenses.length) return;
    const headers = ["Date", "Category", "Amount (INR)"];
    const rows = expenses.map((e) => [
      new Date(e.createdAt || Date.now()).toLocaleDateString(),
      `"${e.category || ''}"`,
      e.price
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Personal_Expenses_${user.username}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averageExpense = expenses.length > 0 ? Math.round(total / expenses.length) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Personal Expenses</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review and manage your tracked purchases
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/analytics"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-colors"
              title="View Visual Analytics & Charts"
            >
              <ChartBarIcon className="w-3.5 h-3.5" />
              <span>Analytics & Insights</span>
            </Link>

            {expenses.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-slate-300 bg-[#161a23] hover:bg-[#1b202c] border border-[#232936] transition-colors cursor-pointer"
                title="Download CSV report"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}

            <Link
              to="/add-expense"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </Link>

            {expenses.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="px-3 py-2 rounded-md text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="app-card p-4 sm:p-5">
            <span className="text-xs text-slate-400 font-medium">Total Spent</span>
            <p className="text-2xl font-bold text-white mt-1.5">
              ₹{total.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="app-card p-4 sm:p-5">
            <span className="text-xs text-slate-400 font-medium">Transactions</span>
            <p className="text-2xl font-bold text-white mt-1.5">
              {expenses.length}
            </p>
          </div>

          <div className="app-card p-4 sm:p-5">
            <span className="text-xs text-slate-400 font-medium">Average Per Expense</span>
            <p className="text-2xl font-bold text-white mt-1.5">
              ₹{averageExpense.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Transactions Table/List */}
        <div className="app-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#232936] flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Recent Transactions ({expenses.length})
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-lg bg-[#1b202c] border border-[#283042] flex items-center justify-center mx-auto mb-3 text-slate-400">
                <WalletIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">No expenses recorded yet</h3>
              <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                Log your first expense to begin tracking your spending history.
              </p>
              <Link
                to="/add-expense"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add an Expense</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#232936]">
              {expenses.map((exp, index) => (
                <div
                  key={exp._id || index}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-[#1b202c]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#12151c] border border-[#232936] flex items-center justify-center text-xs font-semibold text-slate-300">
                      {exp.category ? exp.category.charAt(0).toUpperCase() : '₹'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{exp.category}</p>
                      <span className="text-[11px] text-slate-500">
                        {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : 'Personal Log'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">
                      ₹{exp.price?.toLocaleString('en-IN')}
                    </span>
                    
                    {/* Inline Edit Button */}
                    <button
                      onClick={() => setEditingExpense({ _id: exp._id, category: exp.category, price: exp.price })}
                      className="p-1.5 rounded text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      title="Edit expense"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete expense"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="app-card max-w-sm w-full p-5 bg-[#161a23] shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1.5">Edit Expense</h3>
            <p className="text-xs text-slate-400 mb-4">Update the category or price</p>

            {editError && (
              <div className="mb-3 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingExpense.category}
                  onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-md app-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Price (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-xs pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingExpense.price}
                    onChange={(e) => setEditingExpense({ ...editingExpense, price: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 rounded-md app-input text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-[#12151c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="app-card max-w-sm w-full p-5 bg-[#161a23] shadow-xl">
            <h3 className="text-base font-bold text-white mb-1.5">Clear all expenses?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              This will permanently delete all of your logged personal expenses. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-[#12151c]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-sm"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ExpenseList;
