import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import { getAuthUser } from '../utils/auth';
import { UsersIcon, ArrowRightIcon } from '../components/Icons';

const Join = () => {
  const [invite, setInvite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inviteCode = invite.trim();

    if (!inviteCode) {
      setError('Please enter an invite code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const groupRes = await axios.get(`http://localhost:5000/groupchat/${inviteCode}`);
      const group = groupRes.data.group;

      if (!group) {
        setError('No group found with this invite code.');
        setLoading(false);
        return;
      }

      const isMember = group.members?.some(
        (m) => (typeof m === 'object' ? m._id === user.id : m === user.id)
      );

      if (isMember) {
        sessionStorage.setItem('inviteCode', inviteCode);
        navigate('/groupchat');
        return;
      }

      const response = await axios.post(`http://localhost:5000/join-group/${inviteCode}`, {
        memberID: user.id
      });

      if (response.status === 200) {
        sessionStorage.setItem('inviteCode', inviteCode);
        navigate('/groupchat');
      } else {
        setError('Could not join group.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid invite code or group does not exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8 sm:py-14 flex flex-col justify-center">
        
        <div className="app-card p-6 sm:p-8">
          
          <div className="mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <UsersIcon className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Join an Existing Group</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter the invite code given by your group creator
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Invite Code
              </label>
              <input
                type="text"
                placeholder="e.g. 7Xq8kP"
                value={invite}
                onChange={(e) => {
                  setInvite(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 rounded-md app-input text-center font-mono text-base font-bold tracking-widest uppercase"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !invite.trim()}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Join Group</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/group" className="text-xs text-slate-400 hover:text-white">
                Want to create a new group? →
              </Link>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
};

export default Join;
