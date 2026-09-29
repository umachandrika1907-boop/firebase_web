import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyBu4JZ-Kuy4rQGOfHR0AKm0s9s3n1PObZs",
  authDomain: "project2-5a0ea.firebaseapp.com",
  projectId: "project2-5a0ea",
  storageBucket: "project2-5a0ea.firebasestorage.app",
  messagingSenderId: "41742510250",
  appId: "1:41742510250:web:8778af1e8f682d428a88d3",
  measurementId: "G-QG1SEV4D6G"
};

// Initialize Firebase once
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore
export const db = getFirestore(app);

// Safe Analytics initialization
export let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported environment (e.g. strict cookie/iframe context)
  });
}
