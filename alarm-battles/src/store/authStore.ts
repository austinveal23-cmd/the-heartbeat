import { create } from 'zustand';
import type { User } from '@react-native-firebase/auth';
import {
  fetchUserProfile,
  signIn as firebaseSignIn,
  signOutUser as firebaseSignOut,
  signUp as firebaseSignUp,
  subscribeToAuthState,
} from '../firebase/auth';
import type { UserDoc } from '../firebase/schema';

export type AuthStatus = 'initializing' | 'signedOut' | 'signedIn';

interface AuthStoreState {
  status: AuthStatus;
  firebaseUser: User | null;
  profile: UserDoc | null;
  error: string | null;

  /** Idempotent — call once from App.tsx. Restores the existing Firebase
   *  session on app launch and keeps `profile` in sync afterwards. */
  initAuthListener: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

let listenerStarted = false;

export const useAuthStore = create<AuthStoreState>()((set) => ({
  status: 'initializing',
  firebaseUser: null,
  profile: null,
  error: null,

  initAuthListener: () => {
    if (listenerStarted) return;
    listenerStarted = true;

    subscribeToAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        set({ status: 'signedOut', firebaseUser: null, profile: null });
        return;
      }
      set({ status: 'signedIn', firebaseUser });
      try {
        const profile = await fetchUserProfile(firebaseUser.uid);
        set({ profile });
      } catch (error) {
        console.warn('[auth] failed to load user profile:', error);
      }
    });
  },

  signIn: async (email, password) => {
    set({ error: null });
    try {
      await firebaseSignIn(email, password);
    } catch (error) {
      set({ error: describeAuthError(error) });
      throw error;
    }
  },

  signUp: async (email, password, displayName) => {
    set({ error: null });
    try {
      await firebaseSignUp(email, password, displayName);
    } catch (error) {
      set({ error: describeAuthError(error) });
      throw error;
    }
  },

  signOut: async () => {
    await firebaseSignOut();
    set({ status: 'signedOut', firebaseUser: null, profile: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

function describeAuthError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered — try logging in instead.';
    case 'auth/invalid-email':
      return "That doesn't look like a valid email address.";
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    default:
      return error instanceof Error ? error.message : 'Something went wrong. Try again.';
  }
}
