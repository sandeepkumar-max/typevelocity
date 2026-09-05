import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseAppletConfig from "../../firebase-applet-config.json";

// Web app's Firebase configuration using provisioned applet configuration
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey,
  authDomain: firebaseAppletConfig.authDomain,
  projectId: firebaseAppletConfig.projectId,
  storageBucket: firebaseAppletConfig.storageBucket,
  messagingSenderId: firebaseAppletConfig.messagingSenderId,
  appId: firebaseAppletConfig.appId,
  measurementId: firebaseAppletConfig.measurementId || undefined
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only supported in browser environments)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(() => {
  // Gracefully handle analytics initialization failure in sandbox
});

export const auth = getAuth(app);

// Initialize Firestore with the user's specific database ID
const databaseId = firebaseAppletConfig.firestoreDatabaseId || undefined;
export const db = !getApps().length
  ? initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, databaseId)
  : getFirestore(app, databaseId);

// Suppress Firestore offline and sandbox domain warning in sandbox
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
  if (
    msg.includes('Could not reach Cloud Firestore backend') ||
    msg.includes('FirebaseError: [code=unavailable]') ||
    msg.includes('auth/unauthorized-domain') ||
    msg.includes('Authorized Domains')
  ) {
    console.warn(...args);
    return;
  }
  originalConsoleError(...args);
};