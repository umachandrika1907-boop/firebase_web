import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { onAuthStateChanged, reload, type User } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  loginWithEmail,
  registerWithEmail as apiRegisterWithEmail,
  loginWithGoogle,
  sendResetEmail,
  triggerEmailVerification,
  updateUserProfileData,
  logoutUser,
  fetchUserProfile,
} from '../firebase/authService';
import type { AuthContextType, UserProfileData } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const clearError = () => setError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await fetchUserProfile(currentUser.uid);
          setUserProfile(
            profile || {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              photoURL: currentUser.photoURL || '',
              bio: 'Active account member',
              createdAt: currentUser.metadata.creationTime || new Date().toISOString(),
              lastLoginAt: currentUser.metadata.lastSignInTime || new Date().toISOString(),
            }
          );
        } catch (err) {
          console.warn('Profile fetch error:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    try {
      await reload(auth.currentUser);
      setUser({ ...auth.currentUser });
      const profile = await fetchUserProfile(auth.currentUser.uid);
      if (profile) setUserProfile(profile);
    } catch (err) {
      console.warn('Error reloading user:', err);
    }
  };

  const signInWithGoogle = async () => {
    clearError();
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    clearError();
    try {
      await loginWithEmail(email, pass);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
    clearError();
    try {
      await apiRegisterWithEmail(email, pass, displayName);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    clearError();
    try {
      await sendResetEmail(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    clearError();
    if (!auth.currentUser) throw new Error('No user is currently logged in');
    try {
      await triggerEmailVerification(auth.currentUser);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
      throw err;
    }
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string; bio?: string }) => {
    clearError();
    if (!auth.currentUser) throw new Error('No user is currently logged in');
    try {
      const updated = await updateUserProfileData(auth.currentUser, data);
      startTransition(() => {
        setUserProfile(updated);
        if (auth.currentUser) {
          setUser({ ...auth.currentUser });
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const signOutUser = async () => {
    clearError();
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        clearError,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        resetPassword,
        sendVerificationEmail,
        updateUserProfile,
        signOutUser,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
