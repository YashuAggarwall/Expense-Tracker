import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuthUser, clearAuthData } from '../utils/auth';
import { WalletIcon, UsersIcon, CalculatorIcon, LogOutIcon, LogInIcon, MenuIcon, CloseIcon, ChartBarIcon } from '../components/Icons';

const Navbar = () => {
  const [user, setUser] = useState(getAuthUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getAuthUser());
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthData();
    setUser({ token: null, username: '', id: '' });
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#12151c]/90 backdrop-blur-md border-b border-[#1f2533]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <WalletIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-white">monetraq</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-white bg-[#1b202c]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a23]'
              }`}
            >
              Overview
            </Link>

            <Link
              to="/expenses"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/expenses') || isActive('/add-expense')
                  ? 'text-white bg-[#1b202c]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a23]'
              }`}
            >
              <WalletIcon className="w-3.5 h-3.5" />
              <span>Expenses</span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/analytics')
                  ? 'text-white bg-[#1b202c]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a23]'
              }`}
            >
              <ChartBarIcon className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </Link>

            <Link
              to="/group"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/group') || isActive('/join-group') || isActive('/groupchat') || isActive('/group-expenses')
                  ? 'text-white bg-[#1b202c]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a23]'
              }`}
            >
              <UsersIcon className="w-3.5 h-3.5" />
              <span>Groups</span>
            </Link>

            <Link
              to="/divider"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/divider')
                  ? 'text-white bg-[#1b202c]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a23]'
              }`}
            >
              <CalculatorIcon className="w-3.5 h-3.5" />
              <span>Bill Splitter</span>
            </Link>
          </nav>

          {/* User / Authentication Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user.token ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161a23] border border-[#232936] text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-300 font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                >
                  <LogOutIcon className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-[#161a23] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#161a23]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12151c] border-b border-[#1f2533] px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/') ? 'bg-[#1b202c] text-white' : 'text-slate-300 hover:bg-[#161a23]'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/expenses"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/expenses') ? 'bg-[#1b202c] text-white' : 'text-slate-300 hover:bg-[#161a23]'
            }`}
          >
            Expenses
          </Link>
          <Link
            to="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/analytics') ? 'bg-[#1b202c] text-white' : 'text-slate-300 hover:bg-[#161a23]'
            }`}
          >
            Analytics & Insights
          </Link>
          <Link
            to="/group"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/group') ? 'bg-[#1b202c] text-white' : 'text-slate-300 hover:bg-[#161a23]'
            }`}
          >
            Groups
          </Link>
          <Link
            to="/divider"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/divider') ? 'bg-[#1b202c] text-white' : 'text-slate-300 hover:bg-[#161a23]'
            }`}
          >
            Bill Splitter
          </Link>

          <div className="pt-3 border-t border-[#1f2533] mt-2">
            {user.token ? (
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-400">Signed in as {user.username}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-1.5 rounded-md text-sm font-medium bg-[#161a23] text-slate-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-1.5 rounded-md text-sm font-medium bg-emerald-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
