import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { FirebaseDiagnosticsModal } from './components/FirebaseDiagnosticsModal';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleOpenForgotPassword = (email: string) => {
    setForgotPasswordEmail(email);
    setForgotPasswordOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0C0C0E] flex flex-col items-center justify-center text-white gap-3 select-none">
        <div className="font-['Oswald'] text-2xl uppercase tracking-[0.2em] text-[#A78BFA] animate-pulse">
          VIOLET // NOIR
        </div>
        <div className="flex items-center gap-2 font-['Geist_Mono'] text-xs text-[#71717A]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A78BFA]" />
          <span>Synchronizing Identity Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen w-full bg-[#0C0C0E] text-white flex flex-col md:grid md:grid-cols-[280px_1fr] md:overflow-hidden font-['Geist'] selection:bg-[#A78BFA] selection:text-[#0C0C0E]">
      {/* Sidebar (Variation 9 aside) */}
      <Sidebar
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEditProfile={() => setIsEditingProfile(true)}
      />

      {/* Main Content Area (Variation 9 main) */}
      <main
        className="flex-1 p-6 sm:p-10 md:p-14 overflow-y-auto flex flex-col justify-center relative"
        style={{
          background: 'radial-gradient(circle at 80% 20%, #1E1B4B 0%, transparent 40%), #0C0C0E',
        }}
      >
        {user ? (
          <Dashboard
            onOpenDiagnostics={() => setDiagnosticsOpen(true)}
            isEditing={isEditingProfile}
            setIsEditing={setIsEditingProfile}
          />
        ) : (
          <div className="w-full max-w-4xl py-6 flex flex-col justify-center">
            {/* Top Minimal Navigation Tag */}
            <div className="mb-8 p-6 border border-white bg-[#141417]/50" style={{ borderColor: '#ffffff' }}>
              <span className="label text-[#A78BFA]">
                GATE // {activeTab === 'login' ? 'AUTHENTICATION' : 'INITIALIZATION'}
              </span>
              <h1 className="font-['Oswald'] text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight uppercase leading-[0.95] text-white mt-1">
                {activeTab === 'login' ? 'ACCESS // PORTAL' : 'IDENTITY // REGISTRY'}
              </h1>
              <p className="font-light text-base sm:text-lg text-[#71717A] mt-2 font-['Geist'] max-w-xl">
                Cryptographic authentication service connected to Firebase database node.
              </p>
              <div className="divider my-6" />
            </div>

            {/* Auth Form */}
            {activeTab === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => setActiveTab('register')}
                onOpenForgotPassword={handleOpenForgotPassword}
              />
            ) : (
              <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        defaultEmail={forgotPasswordEmail}
      />

      <FirebaseDiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
