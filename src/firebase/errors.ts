import { auth } from './config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Converts Firebase Auth error codes into clear, human-readable guidance.
 */
export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';

  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please verify your credentials and try again.';
    case 'auth/user-not-found':
      return 'No account exists with this email address. Please register first.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with a combination of letters and numbers.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in your Firebase Console. Please go to Firebase Console > Authentication > Sign-in method to enable Email/Password or Google.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before finishing authentication.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to too many failed attempts. Try again in a few minutes or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/requires-recent-login':
      return 'This sensitive operation requires you to sign in again for security.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by an administrator.';
    default:
      if (message.includes('API key not valid')) {
        return 'Invalid Firebase API key. Please check your Firebase project configuration.';
      }
      return message || 'Authentication failed. Please try again.';
  }
}
