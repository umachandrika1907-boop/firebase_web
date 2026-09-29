import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';
import { formatAuthError } from './errors';
import type { UserProfileData } from '../types/auth';

/**
 * Sync or create user profile document in Firestore
 */
export async function syncUserProfile(user: User, additionalData?: Partial<UserProfileData>): Promise<UserProfileData> {
  const userDocRef = doc(db, 'users', user.uid);
  let profile: UserProfileData = {
    uid: user.uid,
    email: user.email || '',
    displayName: additionalData?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: additionalData?.photoURL || user.photoURL || '',
    bio: additionalData?.bio || 'Member since ' + new Date().toLocaleDateString(),
    createdAt: additionalData?.createdAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const existing = docSnap.data() as UserProfileData;
      profile = {
        ...existing,
        ...profile,
        // preserve original creation date
        createdAt: existing.createdAt || profile.createdAt,
      };
      await updateDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
        ...(additionalData?.displayName ? { displayName: additionalData.displayName } : {}),
        ...(additionalData?.photoURL ? { photoURL: additionalData.photoURL } : {}),
        ...(additionalData?.bio ? { bio: additionalData.bio } : {}),
      });
    } else {
      await setDoc(userDocRef, profile);
    }
  } catch (err) {
    // If Firestore is not enabled or rules prevent write, we gracefully preserve profile in-memory
    console.warn('Note: Firestore user sync notice:', err);
  }

  return profile;
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserProfileData | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
  } catch (err) {
    console.warn('Could not fetch Firestore user profile, using Auth fallback:', err);
  }
  return null;
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await syncUserProfile(cred.user);
    return cred.user;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Register with email and password
 */
export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName?.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    await syncUserProfile(cred.user, {
      displayName: displayName?.trim() || email.split('@')[0],
      createdAt: new Date().toISOString(),
    });
    // Trigger verification email in background
    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn('Auto verification email notice:', e);
    }
    return cred.user;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user, {
      displayName: cred.user.displayName || undefined,
      photoURL: cred.user.photoURL || undefined,
    });
    return cred.user;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Send password reset email
 */
export async function sendResetEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Send email verification link
 */
export async function triggerEmailVerification(user: User): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Update user profile
 */
export async function updateUserProfileData(
  user: User,
  data: { displayName?: string; photoURL?: string; bio?: string }
): Promise<UserProfileData> {
  try {
    if (data.displayName || data.photoURL) {
      await updateProfile(user, {
        displayName: data.displayName ?? user.displayName,
        photoURL: data.photoURL ?? user.photoURL,
      });
    }

    const updated = await syncUserProfile(user, data);
    return updated;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Sign out user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}
