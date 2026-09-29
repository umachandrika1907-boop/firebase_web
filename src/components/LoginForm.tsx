import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onOpenForgotPassword: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onOpenForgotPassword,
}) => {
  const { signInWithEmail, signInWithGoogle, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch {
      // Handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled in AuthContext
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemoAccount = () => {
    clearError();
    setEmail('demo.user@example.com');
    setPassword('DemoPass123!');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#141417] border border-[#27272A] p-7 sm:p-9 shadow-2xl relative">
        {/* Header */}
        <div className="space-y-1.5 mb-6">
          <span className="label text-[#A78BFA]">Identity Gate // Step 01</span>
          <h2 className="font-['Oswald'] text-3xl sm:text-4xl uppercase tracking-wider text-white">
            Access System
          </h2>
          <p className="font-['Geist'] text-xs text-[#71717A]">
            Authenticate using verified credentials or registered identity provider.
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="mb-5">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-1.5 px-3 bg-[#0C0C0E] hover:bg-[#1A1A1E] border border-[#27272A] hover:border-[#A78BFA] text-[#A78BFA] font-['Geist_Mono'] text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA] group-hover:rotate-12 transition-transform" />
            <span>Load Sample Credentials</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 bg-[#1F1315] border border-rose-500/40 text-rose-300 font-['Geist_Mono'] text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-rose-400 block font-semibold">
                Auth Error
              </span>
              <span className="text-xs leading-relaxed">{error}</span>
            </div>
          </div>
        )}

        {/* Google OAuth Option */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isSubmitting}
          className="w-full py-3 px-4 bg-[#0C0C0E] hover:bg-[#1A1A1E] border border-[#27272A] hover:border-[#3F3F46] text-white font-['Geist_Mono'] text-xs uppercase tracking-widest transition flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#A78BFA]" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>Sign In With Google</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#27272A]" />
          <span className="font-['Geist_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
            OR PASSWORD
          </span>
          <div className="h-px flex-1 bg-[#27272A]" />
        </div>

        {/* Email / Pass Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="label">Registered Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) clearError();
              }}
              placeholder="user@domain.com"
              className="w-full mt-1.5 px-3.5 py-2.5 bg-[#0C0C0E] border border-[#27272A] focus:border-[#A78BFA] text-sm font-['Geist_Mono'] text-white placeholder-[#71717A] focus:outline-none transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="label">Access Password</span>
              <button
                type="button"
                onClick={() => onOpenForgotPassword(email)}
                className="font-['Geist_Mono'] text-[10px] text-[#A78BFA] hover:underline uppercase tracking-wider"
              >
                Forgot?
              </button>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#0C0C0E] border border-[#27272A] focus:border-[#A78BFA] text-sm font-['Geist_Mono'] text-white placeholder-[#71717A] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#71717A] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#A78BFA] bg-[#0C0C0E] border-[#27272A] rounded-none"
              />
              <span className="font-['Geist_Mono'] text-[11px] text-[#71717A]">
                Preserve Session
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || googleLoading}
            className="w-full mt-2 py-3.5 px-4 bg-[#A78BFA] hover:bg-[#C4B5FD] text-[#0C0C0E] font-['Geist_Mono'] font-medium text-xs uppercase tracking-[0.2em] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0C0C0E]" />
            ) : null}
            <span>Validate & Enter</span>
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 pt-5 border-t border-[#27272A] text-center">
          <p className="font-['Geist_Mono'] text-xs text-[#71717A]">
            No active record?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#A78BFA] hover:text-white uppercase tracking-wider font-semibold transition inline-flex items-center gap-1 hover:underline"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
