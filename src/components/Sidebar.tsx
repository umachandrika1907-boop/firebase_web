import React from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseConfig } from '../firebase/config';
import { Activity, LogOut, ShieldCheck, UserCheck, KeyRound, Sparkles, Terminal } from 'lucide-react';

interface SidebarProps {
  onOpenDiagnostics: () => void;
  activeTab?: 'login' | 'register';
  setActiveTab?: (tab: 'login' | 'register') => void;
  onOpenEditProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenDiagnostics,
  activeTab,
  setActiveTab,
  onOpenEditProfile,
}) => {
  const { user, userProfile, signOutUser } = useAuth();

  return (
    <aside className="w-full md:w-[280px] shrink-0 bg-[#141417] border-b md:border-b-0 md:border-r border-[#27272A] p-6 sm:p-8 flex flex-col justify-between select-none">
      {/* Top / Brand */}
      <div className="space-y-6">
        <div className="border-b border-[#27272A] pb-6">
          <div className="font-['Oswald'] text-2xl tracking-[0.1em] uppercase leading-tight text-white flex items-center justify-between">
            <span>
              VIOLET<br />NOIR
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] shadow-[0_0_12px_#A78BFA]" />
          </div>
          <span className="font-['Geist_Mono'] text-[10px] text-[#71717A] uppercase tracking-[0.2em] mt-1 block">
            Firebase Auth Engine
          </span>
        </div>

        {/* System Meta List */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="label">Project Code</span>
            <div className="font-['Geist_Mono'] text-xs text-white tracking-wide">
              {firebaseConfig.projectId}
            </div>
          </div>

          <div>
            <span className="label">Platform</span>
            <div className="font-['Geist_Mono'] text-xs text-white tracking-wide flex items-center gap-2">
              <span>Firebase v11.10+</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div>
            <span className="label">State // Status</span>
            <div className="font-['Geist_Mono'] text-xs text-[#A78BFA] flex items-center gap-1.5">
              <span className="text-[10px]">●</span>
              <span>{user ? 'AUTHENTICATED' : 'WAITING_SESSION'}</span>
            </div>
          </div>
        </div>

        {/* Navigation / Switcher */}
        {!user && setActiveTab && (
          <div className="pt-2 border-t border-[#27272A] space-y-2">
            <span className="label">Access Mode</span>
            <div className="grid grid-cols-2 gap-1.5 bg-[#0C0C0E] p-1 border border-[#27272A]">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-2 px-3 text-[11px] font-['Geist_Mono'] uppercase tracking-wider transition ${
                  activeTab === 'login'
                    ? 'bg-[#A78BFA] text-[#0C0C0E] font-medium'
                    : 'text-[#71717A] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2 px-3 text-[11px] font-['Geist_Mono'] uppercase tracking-wider transition ${
                  activeTab === 'register'
                    ? 'bg-[#A78BFA] text-[#0C0C0E] font-medium'
                    : 'text-[#71717A] hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Quick User Actions if Logged In */}
        {user && (
          <div className="pt-3 border-t border-[#27272A] space-y-2">
            <span className="label">User Session</span>
            <div className="space-y-1">
              {onOpenEditProfile && (
                <button
                  onClick={onOpenEditProfile}
                  className="w-full text-left py-2 px-3 text-xs font-['Geist_Mono'] text-[#A78BFA] hover:text-white hover:bg-[#1E1E24] border border-transparent hover:border-[#27272A] transition flex items-center justify-between"
                >
                  <span>Edit Identity</span>
                  <span className="text-[10px]">→</span>
                </button>
              )}
              <button
                onClick={onOpenDiagnostics}
                className="w-full text-left py-2 px-3 text-xs font-['Geist_Mono'] text-zinc-400 hover:text-white hover:bg-[#1E1E24] border border-transparent hover:border-[#27272A] transition flex items-center justify-between"
              >
                <span>Diagnostics</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls & Diagnostics */}
      <div className="mt-8 pt-6 border-t border-[#27272A] space-y-4">
        {!user && (
          <button
            onClick={onOpenDiagnostics}
            className="w-full py-2.5 px-3 bg-[#0C0C0E] hover:bg-[#1A1A1E] border border-[#27272A] hover:border-[#3F3F46] text-zinc-300 hover:text-white font-['Geist_Mono'] text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Connection Status</span>
          </button>
        )}

        <footer className="font-['Geist_Mono'] text-[10px] text-[#71717A] leading-relaxed tracking-wider uppercase">
          © 2024 IDENTITY_MODULE<br />
          ALL RIGHTS RESERVED
        </footer>
      </div>
    </aside>
  );
};
