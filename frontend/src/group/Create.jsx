import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser } from '../utils/auth';
import { UsersIcon, PlusIcon, CopyIcon, CheckIcon, ArrowRightIcon } from '../components/Icons';

const Create = () => {
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [fetchingGroups, setFetchingGroups] = useState(true);

  const navigate = useNavigate();
  const user = getAuthUser();

  const fetchMyGroups = async () => {
    const identifier = user.id || user.username;
    if (!identifier) {
      setFetchingGroups(false);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/my-groups/${identifier}`);
      if (res.data.success) {
        setMyGroups(res.data.groups || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingGroups(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, [user.id, user.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a group name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/group', {
        name: name.trim(),
        createdBy: user.id
      });

      if (response.status === 200) {
        const code = response.data.inviteCode;
        sessionStorage.setItem('inviteCode', code);
        setInviteCode(code);
        await fetchMyGroups();
      }
    } catch (err) {
      setError('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGroup = (code) => {
    sessionStorage.setItem('inviteCode', code);
    navigate('/groupchat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12">
        
        {/* Create Group Box */}
        <div className="app-card p-6 sm:p-8 mb-8">
          
          <div className="mb-6">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <UsersIcon className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Create a New Group</h1>
            <p className="text-xs text-slate-400 mt-1">
              Start a shared spending pool for trips, roommates, or outings
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {!inviteCode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manali Trip, Flat 204"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md app-input text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Group</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link to="/join-group" className="text-xs text-slate-400 hover:text-white">
                  Have an invite code? Join a group instead →
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="p-4 rounded-lg bg-[#12151c] border border-[#232936]">
                <span className="text-xs text-slate-400 block mb-2">
                  Share this code with your friends:
                </span>
                
                <div className="flex items-center justify-center gap-2">
                  <div className="px-4 py-2 rounded-md bg-[#0f1117] border border-[#283042] font-mono text-xl font-bold tracking-widest text-emerald-400 select-all">
                    {inviteCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(inviteCode)}
                    className="p-2 rounded-md bg-[#161a23] hover:bg-[#1b202c] text-slate-300 border border-[#232936] transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate('/groupchat')}
                className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Go to Group Dashboard</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* My Groups List */}
        <div className="app-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              My Groups ({myGroups.length})
            </h2>
            <Link to="/join-group" className="text-xs text-emerald-400 hover:underline">
              + Join with Code
            </Link>
          </div>

          {fetchingGroups ? (
            <p className="text-xs text-slate-400 py-3">Loading your groups...</p>
          ) : myGroups.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              You haven't joined or created any groups yet.
            </p>
          ) : (
            <div className="divide-y divide-[#232936]">
              {myGroups.map((g) => (
                <div
                  key={g._id}
                  className="py-3.5 flex items-center justify-between hover:bg-[#1b202c]/40 transition-colors rounded px-2 -mx-2"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white">{g.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{g.membersCount} {g.membersCount === 1 ? 'member' : 'members'}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">Code: {g.inviteCode}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openGroup(g.inviteCode)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors cursor-pointer"
                  >
                    <span>Open</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Create;
