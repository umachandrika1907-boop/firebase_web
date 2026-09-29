import React from 'react';
import { ShieldCheck, Flame, LogOut, Activity, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenDiagnostics: () => void;
  activeTab?: 'login' | 'register';
  setActiveTab?: (tab: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDiagnostics,
  activeTab,
  setActiveTab,
}) => {
  const { user, userProfile, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/10">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AuthGate
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase v11
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Connected to <code className="text-slate-300 font-mono">project2-5a0ea</code>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDiagnostics}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            title="Inspect Firebase Config & Connection"
          >
            <Activity className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Firebase Status</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 border border-slate-700 flex items-center justify-center text-white text-xs font-semibold">
                  {userProfile?.photoURL || user.photoURL ? (
                    <img
                      src={userProfile?.photoURL || user.photoURL || ''}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    (userProfile?.displayName || user.email || 'U')[0].toUpperCase()
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium text-slate-200 truncate max-w-[130px]">
                    {userProfile?.displayName || user.displayName || 'Authenticated User'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => signOutUser()}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-lg transition"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : setActiveTab ? (
            <div className="flex items-center rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  activeTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  activeTab === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
