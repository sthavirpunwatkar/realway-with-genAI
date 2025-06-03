
// IMPORTANT: Replace with your actual Firebase project configuration!
// Go to your Firebase project console > Project settings > General > Your apps > Web app SDK setup.
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else if (getApps().length) {
  app = getApps()[0];
  auth = getAuth(app);
}

// Export a function to get auth, ensuring it's initialized
export const getFirebaseAuth = () => {
  if (!auth) {
    if (!getApps().length) {
        const currentApp = initializeApp(firebaseConfig);
        auth = getAuth(currentApp);
    } else {
        auth = getAuth(getApps()[0]);
    }
  }
  return auth;
};

// Export app if needed elsewhere, though auth is primary for this feature
export { app };
