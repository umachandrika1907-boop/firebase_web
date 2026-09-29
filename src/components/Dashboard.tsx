import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseConfig } from '../firebase/config';
import {
  Copy,
  Check,
  Send,
  Loader2,
  RefreshCw,
  Edit3,
  Save,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Terminal,
} from 'lucide-react';

interface DashboardProps {
  onOpenDiagnostics: () => void;
  isEditing?: boolean;
  setIsEditing?: (val: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenDiagnostics,
  isEditing: externalEditing,
  setIsEditing: setExternalEditing,
}) => {
  const {
    user,
    userProfile,
    signOutUser,
    sendVerificationEmail,
    updateUserProfile,
    refreshUserData,
  } = useAuth();

  const [copiedUid, setCopiedUid] = useState(false);
  const [internalEditing, setInternalEditing] = useState(false);
  const isEditing = externalEditing !== undefined ? externalEditing : internalEditing;
  const setIsEditing = setExternalEditing || setInternalEditing;

  const [editName, setEditName] = useState(
    userProfile?.displayName || user?.displayName || ''
  );
  const [editBio, setEditBio] = useState(userProfile?.bio || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(
    userProfile?.photoURL || user?.photoURL || ''
  );

  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!user) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyUid = () => {
    if (user.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      showToast('UID copied to clipboard');
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
      showToast('Verification token sent to your email.');
    } catch (err: any) {
      showToast(err.message || 'Could not send verification email.');
    } finally {
      setSendingVerification(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateUserProfile({
        displayName: editName.trim(),
        bio: editBio.trim(),
        photoURL: editPhotoUrl.trim() || undefined,
      });
      setIsEditing(false);
      showToast('Identity profile updated in Firestore.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
    showToast('Session tokens refreshed.');
  };

  // Provider formatting
  const providerId = user.providerData?.[0]?.providerId || 'password';
  const providerDisplay =
    providerId === 'google.com'
      ? 'GOOGLE_OAUTH'
      : providerId === 'password'
      ? 'EMAIL_PASS'
      : providerId.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  // Format display name with stylized line break if long or compound
  const rawDisplayName =
    userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Umachandrika';
  const nameParts = rawDisplayName.split(' ');
  const formattedFirstPart = nameParts[0] + (nameParts.length > 1 ? '.' : '');
  const formattedSecondPart = nameParts.slice(1).join(' ');

  // Truncate UID preview
  const truncatedUid =
    user.uid.length > 15
      ? `${user.uid.slice(0, 8)}...${user.uid.slice(-5)}`
      : user.uid;

  return (
    <div className="w-full max-w-4xl py-6 sm:py-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141417] border border-[#A78BFA] text-white font-['Geist_Mono'] text-xs px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="profile-container" style={{ borderColor: '#ffffff' }}>
        {/* Label */}
        <div className="flex items-center justify-between mb-3">
          <span className="label text-[#A78BFA] tracking-[0.2em]">
            Account // Identity
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-[#71717A] hover:text-white font-['Geist_Mono'] text-[11px] tracking-wider uppercase transition flex items-center gap-1.5"
              title="Refresh auth state"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <button
              onClick={() => {
                setEditName(userProfile?.displayName || user.displayName || '');
                setEditBio(userProfile?.bio || '');
                setEditPhotoUrl(userProfile?.photoURL || user.photoURL || '');
                setIsEditing(!isEditing);
              }}
              className="text-[#A78BFA] hover:text-white font-['Geist_Mono'] text-[11px] tracking-wider uppercase transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Identity'}</span>
            </button>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-['Oswald'] text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight uppercase leading-[0.95] text-white">
          {formattedFirstPart}
          {formattedSecondPart && (
            <>
              <br />
              <span className="text-zinc-200">{formattedSecondPart}</span>
            </>
          )}
        </h1>

        {/* Email Hero */}
        <p className="email-hero font-light text-xl sm:text-2xl text-[#71717A] mt-3 font-['Geist'] tracking-tight">
          {user.email}
        </p>

        {/* User Bio if present */}
        {userProfile?.bio && !isEditing && (
          <p className="text-xs text-zinc-400 mt-2 font-['Geist_Mono'] max-w-xl leading-relaxed">
            // {userProfile.bio}
          </p>
        )}

        {/* Obsidian Accent Divider */}
        <div className="divider my-8" />

        {/* Edit Identity Mode */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mb-8 p-6 bg-[#141417] border border-[#27272A] space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <span className="label text-[#A78BFA]">Identity Editor</span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[#71717A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="label">Display Name</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Venkata Umachandrika"
                  className="w-full mt-1 px-3 py-2 bg-[#0C0C0E] border border-[#27272A] text-xs font-['Geist_Mono'] text-white focus:outline-none focus:border-[#A78BFA] transition"
                />
              </div>

              <div>
                <span className="label">Avatar URL (Optional)</span>
                <input
                  type="url"
                  value={editPhotoUrl}
                  onChange={(e) => setEditPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2 bg-[#0C0C0E] border border-[#27272A] text-xs font-['Geist_Mono'] text-white focus:outline-none focus:border-[#A78BFA] transition"
                />
              </div>
            </div>

            <div>
              <span className="label">Bio // Note</span>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Developer, researcher, architect..."
                className="w-full mt-1 px-3 py-2 bg-[#0C0C0E] border border-[#27272A] text-xs font-['Geist_Mono'] text-white focus:outline-none focus:border-[#A78BFA] transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[#27272A] text-[#71717A] hover:text-white font-['Geist_Mono'] text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2 bg-[#A78BFA] text-[#0C0C0E] hover:bg-[#C4B5FD] font-['Geist_Mono'] text-xs uppercase tracking-widest font-medium transition flex items-center gap-1.5"
              >
                {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Record</span>
              </button>
            </div>
          </form>
        )}

        {/* Grid Stats (from Variation 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#27272A] border border-[#27272A] mt-8 sm:mt-12">
          {/* Stat 1: UID */}
          <div
            onClick={handleCopyUid}
            className="bg-[#0C0C0E] p-6 sm:p-8 cursor-pointer group hover:bg-[#141417] transition relative"
          >
            <div className="flex items-center justify-between">
              <span className="label">UID Registry</span>
              <span className="text-[10px] text-[#71717A] group-hover:text-[#A78BFA] font-['Geist_Mono'] uppercase tracking-wider">
                {copiedUid ? 'COPIED' : 'COPY'}
              </span>
            </div>
            <div className="font-['Geist_Mono'] text-sm sm:text-base text-[#A78BFA] mt-2 font-medium tracking-tight truncate">
              {truncatedUid}
            </div>
            <div className="text-[10px] text-[#71717A] font-['Geist_Mono'] mt-1 truncate">
              ID: {user.uid}
            </div>
          </div>

          {/* Stat 2: Method */}
          <div className="bg-[#0C0C0E] p-6 sm:p-8">
            <span className="label">Method</span>
            <div className="font-['Geist_Mono'] text-sm sm:text-base text-white mt-2 font-medium tracking-tight">
              {providerDisplay}
            </div>
            <div className="text-[10px] text-[#71717A] font-['Geist_Mono'] mt-1">
              PROV: {providerId}
            </div>
          </div>

          {/* Stat 3: Access Status */}
          <div className="bg-[#0C0C0E] p-6 sm:p-8">
            <span className="label">Access Status</span>
            <div
              className={`font-['Geist_Mono'] text-sm sm:text-base mt-2 font-medium tracking-tight ${
                user.emailVerified ? 'text-emerald-400' : 'text-[#A78BFA]'
              }`}
            >
              {user.emailVerified ? 'VERIFIED' : 'PENDING_VERIFY'}
            </div>
            <div className="text-[10px] text-[#71717A] font-['Geist_Mono'] mt-1">
              AUTH_LEVEL: {user.emailVerified ? 'TIER_1' : 'TIER_0'}
            </div>
          </div>
        </div>

        {/* Verification banner if status is PENDING_VERIFY */}
        {!user.emailVerified && (
          <div className="mt-4 p-4 bg-[#141417] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <div className="font-['Geist_Mono'] text-xs text-zinc-300">
                Email verification link required to confirm full identity.
              </div>
            </div>
            <button
              onClick={handleSendVerification}
              disabled={sendingVerification || verificationSent}
              className="py-1.5 px-3 bg-transparent border border-[#A78BFA] hover:bg-[#A78BFA] text-[#A78BFA] hover:text-[#0C0C0E] font-['Geist_Mono'] text-[11px] uppercase tracking-widest transition disabled:opacity-50 shrink-0"
            >
              {sendingVerification ? 'Dispatching...' : verificationSent ? 'Email Dispatched' : 'Dispatch Verification'}
            </button>
          </div>
        )}

        {/* Detailed Timestamps info */}
        <div className="mt-8 pt-6 border-t border-[#27272A] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-['Geist_Mono'] text-[#71717A]">
          <div>
            <span className="label">Creation Registry</span>
            <span className="text-zinc-300">
              {user.metadata.creationTime || 'N/A'}
            </span>
          </div>
          <div>
            <span className="label">Latest Token Issuance</span>
            <span className="text-zinc-300">
              {user.metadata.lastSignInTime || 'N/A'}
            </span>
          </div>
        </div>

        {/* Action Button: Sign Out */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button onClick={() => signOutUser()} className="btn-signout">
            Request Sign Out
          </button>
          <button
            onClick={onOpenDiagnostics}
            className="px-6 py-3 border border-[#27272A] text-zinc-400 hover:text-white hover:border-[#3F3F46] font-['Geist_Mono'] text-xs uppercase tracking-widest transition"
          >
            Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
