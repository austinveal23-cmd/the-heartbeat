import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

/**
 * @react-native-firebase reads its config from the native
 * google-services.json / GoogleService-Info.plist files (see repo root),
 * not from JS — there is no web-style apiKey/authDomain object to fill in here.
 * Replace those two placeholder files with the ones from your Firebase
 * console before this becomes anything other than a non-functional stub.
 */
export const firebaseApp = getApp();
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
