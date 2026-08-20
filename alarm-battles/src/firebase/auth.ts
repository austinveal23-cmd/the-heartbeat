import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from '@react-native-firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { auth, firestore } from './config';
import type { UserDoc } from './schema';

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Creates the Firebase Auth account and its users/{uid} profile document.
 * Not wrapped in a transaction across two systems (Auth + Firestore) — if
 * the profile write fails after the account is created, the user still
 * exists in Auth. fetchUserProfile()/authStore treat a signed-in user with
 * no profile doc as "needs profile setup" rather than crashing, so a retry
 * (e.g. re-attempting sign up, which Firebase will reject as email-in-use,
 * or a future "complete your profile" step) can recover from that.
 */
export async function signUp(email: string, password: string, displayName: string): Promise<void> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  const profile: UserDoc = {
    uid: credential.user.uid,
    displayName,
    email,
    photoURL: null,
    points: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    friendIds: [],
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(firestore, 'users', credential.user.uid), profile);
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function fetchUserProfile(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(firestore, 'users', uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}
