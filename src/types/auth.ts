import type { User } from 'firebase/auth';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string; bio?: string }) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}
