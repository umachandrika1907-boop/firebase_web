import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide registered email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch password recovery link.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C0C0E]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#141417] border border-[#27272A] p-7 shadow-2xl relative text-white">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-[#71717A] hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-left space-y-4 py-2">
            <span className="label text-[#A78BFA]">Recovery Dispatch // Complete</span>
            <h3 className="font-['Oswald'] text-3xl uppercase tracking-wider text-white">
              Reset Token Sent
            </h3>
            <p className="font-['Geist'] text-xs text-[#71717A] leading-relaxed">
              Firebase Auth has dispatched password reset instructions to{' '}
              <span className="text-white font-['Geist_Mono']">{email}</span>. Please verify your inbox and follow the secure link.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#A78BFA] hover:bg-[#C4B5FD] text-[#0C0C0E] font-['Geist_Mono'] text-xs uppercase tracking-widest font-medium transition cursor-pointer"
              >
                Return to Access Gate
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="label text-[#A78BFA]">Recovery Protocol</span>
              <h3 className="font-['Oswald'] text-3xl uppercase tracking-wider text-white">
                Reset Credential
              </h3>
              <p className="font-['Geist'] text-xs text-[#71717A]">
                Provide your registered identity email. A single-use Firebase password reset link will be generated.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-[#1F1315] border border-rose-500/40 text-rose-300 font-['Geist_Mono'] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <span className="label">Registered Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@domain.com"
                className="w-full mt-1.5 px-3.5 py-2.5 bg-[#0C0C0E] border border-[#27272A] focus:border-[#A78BFA] text-sm font-['Geist_Mono'] text-white placeholder-[#71717A] focus:outline-none transition"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-1/3 py-3 border border-[#27272A] text-[#71717A] hover:text-white font-['Geist_Mono'] text-xs uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 bg-[#A78BFA] hover:bg-[#C4B5FD] disabled:opacity-50 text-[#0C0C0E] font-['Geist_Mono'] text-xs uppercase tracking-widest font-medium transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Send Link</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
