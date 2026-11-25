import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../HomePage/Navbar';
import {
  UsersIcon,
  PlusIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
  LogOutIcon,
  ScaleIcon,
  ArrowRightIcon,
  DownloadIcon,
  CheckCircleIcon
} from '../components/Icons';

const Dashboard = () => {
  const [group, setGroup] = useState(null);
  const [expenseList, setExpenseList] = useState([]);
  const [total, setTotal] = useState(0);
  const [share, setShare] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('debts'); // 'debts' or 'expenses'
  const [settlementData, setSettlementData] = useState({
    netBalances: [],
    settlements: [],
    transactionsSaved: 0
  });

  // Settle up modal state
  const [settleTarget, setSettleTarget] = useState(null); // { from, to, amount }
  const [settleLoading, setSettleLoading] = useState(false);

  const navigate = useNavigate();
  const inviteCode = sessionStorage.getItem('inviteCode');

  const fetchData = async () => {
    if (!inviteCode) {
      setLoading(false);
      return;
    }
    try {
      // 1. Fetch group details & raw expenses
      const response = await axios.get(`http://localhost:5000/groupchat/${inviteCode}`);
      const groupData = response.data.group;
      const expenses = response.data.expenses || [];

      setGroup(groupData);
      setExpenseList(expenses);

      // Only count actual purchases towards group total spend (ignore settlement transfers)
      const purchaseExpenses = expenses.filter((e) => !e.isSettlement);
      const totalAmount = purchaseExpenses.reduce((sum, item) => sum + (Number(item.expense) || 0), 0);
      setTotal(totalAmount);

      const numMembers = groupData?.members?.length || 1;
      const perPersonShare = totalAmount / numMembers;
      setShare(Math.round(perPersonShare * 100) / 100);

      // 2. Fetch Algorithmic Debt Simplification analysis
      try {
        const settleRes = await axios.get(`http://localhost:5000/group-settlements/${inviteCode}`);
        if (settleRes.data.success) {
          setSettlementData({
            netBalances: settleRes.data.netBalances || [],
            settlements: settleRes.data.settlements || [],
            transactionsSaved: settleRes.data.transactionsSaved || 0
          });
        }
      } catch (err) {
        console.error("Debt calculation error:", err);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO Real-time setup
  useEffect(() => {
    fetchData();

    if (!inviteCode) return;

    const socket = io('http://localhost:5000');
    socket.emit('join_group', inviteCode);

    socket.on('expense_updated', () => {
      fetchData();
    });

    return () => {
      socket.emit('leave_group', inviteCode);
      socket.disconnect();
    };
  }, [inviteCode]);

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/group-delete/${id}`);
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmSettle = async () => {
    if (!settleTarget) return;
    setSettleLoading(true);
    try {
      await axios.post(`http://localhost:5000/group-settle/${inviteCode}`, {
        fromName: settleTarget.from,
        toName: settleTarget.to,
        amount: settleTarget.amount
      });
      setSettleTarget(null);
      await fetchData();
    } catch (e) {
      console.error("Failed to record settlement:", e);
      alert(e.response?.data?.message || "Failed to settle up");
    } finally {
      setSettleLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveGroup = () => {
    sessionStorage.removeItem('inviteCode');
    navigate('/group');
  };

  // Export Group Expenses to CSV
  const handleExportCSV = () => {
    if (!expenseList.length) return;
    const headers = ["Date", "Category", "Description", "Paid By", "Settled With", "Amount (INR)", "Is Settlement"];
    const rows = expenseList.map((e) => [
      new Date(e.createdAt || Date.now()).toLocaleDateString(),
      `"${e.category || ''}"`,
      `"${e.description || ''}"`,
      `"${e.paidBy || ''}"`,
      `"${e.settledWith || ''}"`,
      e.expense,
      e.isSettlement ? "Yes" : "No"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${group?.name || 'Group'}_Expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!inviteCode) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1117]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="app-card p-6 max-w-sm w-full text-center">
            <div className="w-10 h-10 rounded-lg bg-[#1b202c] border border-[#283042] text-slate-300 flex items-center justify-center mx-auto mb-3">
              <UsersIcon className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">No Active Group</h2>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              You are not currently in a group. Create one or join using an invite code.
            </p>
            <div className="flex gap-2">
              <Link
                to="/group"
                className="flex-1 py-2 rounded-md font-medium text-white bg-emerald-600 hover:bg-emerald-500 text-xs transition-colors"
              >
                Create Group
              </Link>
              <Link
                to="/join-group"
                className="flex-1 py-2 rounded-md font-medium text-slate-300 bg-[#12151c] hover:bg-[#1b202c] border border-[#232936] text-xs transition-colors"
              >
                Join Group
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">

        {/* Header Card */}
        <div className="app-card p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <UsersIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Group Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" title="Real-time Live Sync"></span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {group?.name || 'Group Dashboard'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#12151c] hover:bg-[#1b202c] border border-[#232936] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                title="Click to copy invite code"
              >
                <span className="text-slate-500">Code:</span>
                <span className="font-mono text-emerald-400 font-bold">{inviteCode}</span>
                {copied ? (
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <CopyIcon className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <Link
                to="/group-expenses"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md font-medium text-white bg-emerald-600 hover:bg-emerald-500 text-xs transition-colors shadow-sm"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </Link>

              <button
                onClick={handleLeaveGroup}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span>Leave</span>
              </button>
            </div>
          </div>

          {/* Members Bar */}
          <div className="mt-4 pt-4 border-t border-[#1f2533] flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 mr-1.5">
              Members ({group?.members?.length || 0}):
            </span>
            {group?.members && group.members.map((member) => (
              <span
                key={member._id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#12151c] border border-[#232936] text-xs text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{member.name || member.username || 'Member'}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="app-card p-4 sm:p-5">
            <span className="text-xs text-slate-400 font-medium">Total Group Purchases</span>
            <p className="text-2xl font-bold text-white mt-1.5">
              ₹{total.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="app-card p-4 sm:p-5">
            <span className="text-xs text-slate-400 font-medium">Equal Share / Person</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1.5">
              ₹{share.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="app-card p-4 sm:p-5">
            <span className="text-xs text-slate-400 font-medium">Active Members</span>
            <p className="text-2xl font-bold text-white mt-1.5">
              {group?.members?.length || 0}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#232936] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('debts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'debts'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-[#161a23]'
                }`}
            >
              <ScaleIcon className="w-3.5 h-3.5" />
              <span>Smart Settlement & Balances</span>
              {settlementData.settlements.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
                  {settlementData.settlements.length} payments
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'expenses'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-[#161a23]'
                }`}
            >
              <span>Expenses History</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-400">
                {expenseList.length}
              </span>
            </button>
          </div>

          {expenseList.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-white bg-[#12151c] hover:bg-[#1b202c] border border-[#232936] transition-colors cursor-pointer"
              title="Export statement to CSV"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>

        {/* Tab 1: Smart Debt Settlement */}
        {activeTab === 'debts' && (
          <div className="space-y-6">

            <div className="app-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141822]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Smart Settlement
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                    Fewest Payments
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  We automatically combine mutual debts so everyone settles up in the fewest possible payments — no messy back-and-forth transfers.
                </p>
              </div>

              {settlementData.transactionsSaved > 0 && (
                <div className="shrink-0 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  Saved {settlementData.transactionsSaved} extra {settlementData.transactionsSaved === 1 ? 'payment' : 'payments'}
                </div>
              )}
            </div>

            {/* Optimal Settlement Steps */}
            <div className="app-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#232936] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Recommended Settlements ({settlementData.settlements.length})
                </span>
                <span className="text-xs text-slate-400">
                  {settlementData.settlements.length === 0 ? 'All settled' : 'Direct repayments'}
                </span>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Calculating optimal settlements...
                </div>
              ) : settlementData.settlements.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckIcon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">All debts are settled!</p>
                  <p className="text-xs text-slate-400 mt-1">
                    No pending repayments among group members.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#232936]">
                  {settlementData.settlements.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1b202c]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#12151c] border border-[#232936] text-[11px] font-mono text-slate-400 flex items-center justify-center">
                          {idx + 1}
                        </span>

                        {/* Payer */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                            {item.from}
                          </span>

                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span>pays</span>
                            <ArrowRightIcon className="w-3.5 h-3.5 text-slate-500" />
                          </span>

                          {/* Recipient */}
                          <span className="text-sm font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                            {item.to}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-9 sm:pl-0">
                        <span className="text-base font-extrabold text-white">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </span>

                        {/* Settle Up Action Button */}
                        <button
                          onClick={() => setSettleTarget(item)}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          <span>Settle Up</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Member Net Balances Table */}
            <div className="app-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#232936]">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Individual Net Balances
                </span>
              </div>

              <div className="divide-y divide-[#232936]">
                {settlementData.netBalances.map((item) => (
                  <div
                    key={item.name}
                    className="px-5 py-3 flex items-center justify-between hover:bg-[#1b202c]/40 transition-colors text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-slate-500 ml-2">
                        (Paid: ₹{item.paid.toLocaleString('en-IN')} | Share: ₹{item.share.toLocaleString('en-IN')})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'gets' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Gets back ₹{Math.abs(item.netBalance).toLocaleString('en-IN')}
                        </span>
                      )}

                      {item.status === 'owes' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Owes ₹{Math.abs(item.netBalance).toLocaleString('en-IN')}
                        </span>
                      )}

                      {item.status === 'settled' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400">
                          Settled (₹0)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Raw Expenses History */}
        {activeTab === 'expenses' && (
          <div className="app-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#232936] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Group Expenses ({expenseList.length})
              </span>
              <Link
                to="/group-expenses"
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                + Add Item
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Loading transactions...
              </div>
            ) : expenseList.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 rounded-lg bg-[#1b202c] border border-[#283042] flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <UsersIcon className="w-5 h-5 text-slate-300" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">No group expenses recorded</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                  Log purchases made on behalf of the group to calculate equal shares.
                </p>
                <Link
                  to="/group-expenses"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add Group Expense</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#232936]">
                {expenseList.map((exp) => (
                  <div
                    key={exp._id}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-[#1b202c]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md border flex items-center justify-center text-xs font-semibold ${exp.isSettlement
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-[#12151c] border-[#232936] text-slate-300'
                        }`}>
                        {exp.isSettlement ? '✓' : (exp.category ? exp.category.charAt(0).toUpperCase() : 'G')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-200">
                            {exp.isSettlement ? (
                              <span className="text-emerald-300">Debt Settlement: {exp.description}</span>
                            ) : (
                              exp.category
                            )}
                          </p>
                          {!exp.isSettlement && exp.description && (
                            <span className="text-xs text-slate-500">— {exp.description}</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {exp.isSettlement
                            ? `Settled between ${exp.paidBy} and ${exp.settledWith}`
                            : `Paid by ${exp.paidBy || 'Member'}`}
                          {exp.createdAt && ` • ${new Date(exp.createdAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${exp.isSettlement ? 'text-emerald-400' : 'text-white'}`}>
                        ₹{Number(exp.expense)?.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp._id)}
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
        )}

      </main>

      {/* Settle Up Confirmation Modal */}
      {settleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="app-card max-w-sm w-full p-5 bg-[#161a23] shadow-2xl">
            <div className="flex items-center gap-2.5 mb-2 text-emerald-400">
              <CheckCircleIcon className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Record Settlement</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Confirm that <strong className="text-rose-300">{settleTarget.from}</strong> has paid{' '}
              <strong className="text-white">₹{settleTarget.amount.toLocaleString('en-IN')}</strong> to{' '}
              <strong className="text-emerald-300">{settleTarget.to}</strong>?
            </p>

            <div className="p-3 rounded-md bg-[#12151c] border border-[#232936] text-xs text-slate-400 mb-5">
              This will update both members' balances and reduce group debt accordingly.
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSettleTarget(null)}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-[#12151c]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={settleLoading}
                onClick={handleConfirmSettle}
                className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-50"
              >
                {settleLoading ? "Recording..." : "Yes, Mark as Paid"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
