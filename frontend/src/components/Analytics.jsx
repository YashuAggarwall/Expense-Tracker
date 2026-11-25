import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser } from '../utils/auth';
import {
  ChartBarIcon,
  TrendingUpIcon,
  PieChartIcon,
  WalletIcon,
  PlusIcon,
  RefreshIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from './Icons';

const PALETTE = [
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#14b8a6', // teal
  '#ec4899', // pink
  '#6366f1', // indigo
];

// Helper to compute SVG donut slice paths
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, innerRadius, startAngle, endAngle) => {
  // If complete circle (360 deg), adjust slightly to prevent zero-arc SVG bug
  const adjustedEnd = endAngle - startAngle >= 360 ? startAngle + 359.999 : endAngle;

  const start = polarToCartesian(x, y, radius, adjustedEnd);
  const end = polarToCartesian(x, y, radius, startAngle);
  const innerStart = polarToCartesian(x, y, innerRadius, startAngle);
  const innerEnd = polarToCartesian(x, y, innerRadius, adjustedEnd);

  const arcSweep = adjustedEnd - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    'L', innerStart.x, innerStart.y,
    'A', innerRadius, innerRadius, 0, arcSweep, 1, innerEnd.x, innerEnd.y,
    'Z'
  ].join(' ');
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const user = getAuthUser();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/analytics/${user.username}`);
      if (res.data && res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username) {
      fetchAnalytics();
    }
  }, [user.username]);

  // Compute donut slices
  const categorySlices = [];
  if (data && data.categoryBreakdown && data.totalSpent > 0) {
    let currentAngle = 0;
    data.categoryBreakdown.forEach((cat, index) => {
      const sliceAngle = (cat.total / data.totalSpent) * 360;
      categorySlices.push({
        ...cat,
        color: PALETTE[index % PALETTE.length],
        startAngle: currentAngle,
        endAngle: currentAngle + sliceAngle,
        path: describeArc(100, 100, 85, 55, currentAngle, currentAngle + sliceAngle),
      });
      currentAngle += sliceAngle;
    });
  }

  // Monthly trend max for scaling
  const maxMonthly = data && data.monthlyTrend
    ? Math.max(1, ...data.monthlyTrend.map((m) => m.total))
    : 1;

  // Active hover category details or default total
  const activeHover = hoveredCategory
    ? categorySlices.find((s) => s.category === hoveredCategory)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">

        {/* Header / Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <ChartBarIcon className="w-3.5 h-3.5" />
              <span>Financial Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Visual Analytics & Insights</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deep breakdown of spending behavior, category velocity, and month-over-month trends
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalytics}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-slate-300 bg-[#161a23] hover:bg-[#1b202c] border border-[#232936] transition-colors cursor-pointer"
              title="Refresh data"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <Link
              to="/expenses"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-slate-300 bg-[#161a23] hover:bg-[#1b202c] border border-[#232936] transition-colors"
            >
              <WalletIcon className="w-3.5 h-3.5" />
              <span>Ledger View</span>
            </Link>

            <Link
              to="/add-expense"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="app-card p-16 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-white">Crunching your financial data...</p>
            <p className="text-xs text-slate-400 mt-1">Aggregating categories and time-series history</p>
          </div>
        ) : !data || data.totalCount === 0 ? (
          <div className="app-card p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#161a23] border border-[#283042] flex items-center justify-center mx-auto mb-3 text-slate-400">
              <ChartBarIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">No spending data yet</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-5">
              Add your first expenses to unlock interactive donut charts, monthly burn velocity, and category insights.
            </p>
            <Link
              to="/add-expense"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Record First Expense</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Spent */}
              <div className="app-card p-4 sm:p-5">
                <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>Total Outlay</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {data.totalCount} txns
                  </span>
                </span>
                <p className="text-2xl font-extrabold text-white mt-2">
                  ₹{data.totalSpent.toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  Avg. ₹{data.avgPerExpense.toLocaleString('en-IN')} / purchase
                </span>
              </div>

              {/* Month-over-Month Velocity */}
              <div className="app-card p-4 sm:p-5">
                <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>This Month vs Last</span>
                  <TrendingUpIcon className="w-4 h-4 text-slate-500" />
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-white">
                    ₹{data.currentMonthTotal.toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      data.momPercent <= 0
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {data.momPercent > 0 ? `+${data.momPercent}%` : `${data.momPercent}%`}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  {data.prevMonthTotal > 0
                    ? `Last month was ₹${data.prevMonthTotal.toLocaleString('en-IN')}`
                    : 'First month on record'}
                </span>
              </div>

              {/* Dominant Category */}
              <div className="app-card p-4 sm:p-5">
                <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>Top Spending Bucket</span>
                  <PieChartIcon className="w-4 h-4 text-slate-500" />
                </span>
                <p className="text-2xl font-extrabold text-white mt-2 truncate">
                  {data.topCategory ? data.topCategory.category : 'N/A'}
                </p>
                <span className="text-xs text-emerald-400 mt-1 block font-medium">
                  {data.topCategory
                    ? `₹${data.topCategory.total.toLocaleString('en-IN')} (${data.topCategory.percentage}% of wallet)`
                    : 'No expenses'}
                </span>
              </div>

              {/* Daily Burn Rate */}
              <div className="app-card p-4 sm:p-5">
                <span className="text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>Daily Burn Rate</span>
                  <span className="text-[10px] text-slate-400 font-mono">This Month</span>
                </span>
                <p className="text-2xl font-extrabold text-white mt-2">
                  ₹{data.dailyBurnRate.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-400"> / day</span>
                </p>
                <span className="text-xs text-slate-400 mt-1 block truncate">
                  {data.largestExpense
                    ? `Max: ₹${data.largestExpense.price} (${data.largestExpense.category})`
                    : 'Paced evenly'}
                </span>
              </div>

            </div>

            {/* Interactive Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Chart 1: Category Distribution Donut */}
              <div className="lg:col-span-5 app-card p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#232936] mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">Category Allocation</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Share of wallet per category</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {categorySlices.length} {categorySlices.length === 1 ? 'bucket' : 'buckets'}
                    </span>
                  </div>

                  {/* SVG Donut */}
                  <div className="relative flex items-center justify-center py-2">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-52 h-52 sm:w-56 sm:h-56 transform -rotate-90"
                    >
                      {categorySlices.map((slice, idx) => (
                        <path
                          key={idx}
                          d={slice.path}
                          fill={slice.color}
                          className="cursor-pointer transition-all duration-200 hover:opacity-80"
                          style={{
                            opacity: hoveredCategory && hoveredCategory !== slice.category ? 0.35 : 1,
                            transformOrigin: '100px 100px',
                            transform: hoveredCategory === slice.category ? 'scale(1.04)' : 'scale(1)',
                          }}
                          onMouseEnter={() => setHoveredCategory(slice.category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        />
                      ))}
                    </svg>

                    {/* Donut Center Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                      {activeHover ? (
                        <>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
                            {activeHover.category}
                          </span>
                          <span className="text-xl font-extrabold text-white mt-0.5">
                            {activeHover.percentage}%
                          </span>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            ₹{activeHover.total.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Total Spent
                          </span>
                          <span className="text-lg font-extrabold text-white mt-0.5">
                            ₹{data.totalSpent.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Hover slice
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="mt-4 pt-3 border-t border-[#232936] space-y-2 max-h-48 overflow-y-auto pr-1">
                  {categorySlices.map((slice, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`flex items-center justify-between text-xs p-1.5 rounded transition-colors cursor-pointer ${
                        hoveredCategory === slice.category ? 'bg-[#1b202c]' : 'hover:bg-[#161a23]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: slice.color }}
                        ></span>
                        <span className="text-slate-200 font-medium truncate">{slice.category}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-400 text-[11px]">{slice.percentage}%</span>
                        <span className="text-white font-semibold">
                          ₹{slice.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Monthly Spending Trend (Last 6 Months) */}
              <div className="lg:col-span-7 app-card p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#232936] mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">Monthly Spending Trend</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Month-by-month historical progression</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Current</span>
                      </span>
                    </div>
                  </div>

                  {/* Bar Chart Container */}
                  <div className="h-64 sm:h-72 w-full flex flex-col justify-end pt-8 pb-2">
                    
                    {/* Y-axis Guides */}
                    <div className="relative w-full h-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                      
                      {/* Horizontal Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-b border-[#283042]">
                        <div className="border-b border-dashed border-slate-500"></div>
                        <div className="border-b border-dashed border-slate-500"></div>
                        <div className="border-b border-dashed border-slate-500"></div>
                      </div>

                      {/* Monthly Bars */}
                      {data.monthlyTrend.map((m, idx) => {
                        const heightPct = maxMonthly > 0 ? Math.max(6, Math.round((m.total / maxMonthly) * 88)) : 6;
                        const isCurrent = idx === data.monthlyTrend.length - 1;
                        const isHovered = hoveredMonth === m.key;

                        return (
                          <div
                            key={m.key}
                            className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                            onMouseEnter={() => setHoveredMonth(m.key)}
                            onMouseLeave={() => setHoveredMonth(null)}
                          >
                            {/* Hover Tooltip */}
                            {isHovered && (
                              <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-md bg-[#161a23] border border-[#2e3748] shadow-xl text-center pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                                <span className="text-[10px] text-slate-400 block">{m.label}</span>
                                <span className="text-xs font-bold text-white block">
                                  ₹{m.total.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[9px] text-emerald-400 block">
                                  {m.count} {m.count === 1 ? 'expense' : 'expenses'}
                                </span>
                              </div>
                            )}

                            {/* Bar column */}
                            <div className="w-full max-w-[48px] flex flex-col justify-end items-center h-full">
                              
                              {/* Amount text on top if space allows */}
                              {m.total > 0 && (
                                <span className="text-[10px] font-mono text-slate-400 mb-1 hidden sm:block">
                                  {m.total >= 1000 ? `₹${Math.round(m.total / 1000)}k` : `₹${m.total}`}
                                </span>
                              )}

                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-md transition-all duration-300 relative ${
                                  isCurrent
                                    ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20'
                                    : m.total > 0
                                    ? 'bg-gradient-to-t from-slate-700 to-slate-500 hover:from-slate-600 hover:to-slate-400'
                                    : 'bg-[#1a1f2c]'
                                }`}
                              >
                                {isCurrent && (
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></div>
                                )}
                              </div>
                            </div>

                            {/* Month Label */}
                            <span
                              className={`text-[11px] font-medium mt-2 transition-colors ${
                                isCurrent
                                  ? 'text-emerald-400 font-bold'
                                  : isHovered
                                  ? 'text-white'
                                  : 'text-slate-400'
                              }`}
                            >
                              {m.label.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Trend Note */}
                <div className="mt-4 pt-3 border-t border-[#232936] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <TrendingUpIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {data.currentMonthTotal >= data.prevMonthTotal
                        ? `Pacing ₹${(data.currentMonthTotal - data.prevMonthTotal).toLocaleString('en-IN')} ahead of last month`
                        : `Saved ₹${(data.prevMonthTotal - data.currentMonthTotal).toLocaleString('en-IN')} compared to last month`}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">6 Month Window</span>
                </div>
              </div>

            </div>

            {/* Category Breakdown Table */}
            <div className="app-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#232936] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Category Metrics & Performance
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Breakdown of volume, wallet share, and average ticket size
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {data.categoryBreakdown.length} Categories
                  </span>
                  <Link
                    to="/expenses"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-[#161a23] hover:bg-[#1b202c] border border-[#232936] transition-colors"
                  >
                    <span>View Ledger</span>
                    <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#232936] text-slate-400 bg-[#12151c]">
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Volume</th>
                      <th className="py-3 px-4 font-semibold">Share</th>
                      <th className="py-3 px-4 font-semibold">Avg / Expense</th>
                      <th className="py-3 px-4 font-semibold text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232936]">
                    {data.categoryBreakdown.map((item, idx) => {
                      const avgItem = item.count > 0 ? Math.round(item.total / item.count) : 0;
                      const color = PALETTE[idx % PALETTE.length];

                      return (
                        <tr key={idx} className="hover:bg-[#1b202c]/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            ></span>
                            <span>{item.category}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {item.count} {item.count === 1 ? 'txn' : 'txns'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 sm:w-28 h-1.5 rounded-full bg-[#161a23] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: color
                                  }}
                                ></div>
                              </div>
                              <span className="text-slate-300 font-mono text-[11px]">
                                {item.percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            ₹{avgItem.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 font-bold text-white text-right">
                            ₹{item.total.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Analytics;