const fs = require('fs');

const newFirebaseTs = `
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSuPdwVgUZDKMcpesQxTTD2h5J96JK4_k",
  authDomain: "typevelocity-f63e7.firebaseapp.com",
  projectId: "typevelocity-f63e7",
  storageBucket: "typevelocity-f63e7.firebasestorage.app",
  messagingSenderId: "39928537003",
  appId: "1:39928537003:web:5aafc3a9f1d9d530423cee",
  measurementId: "G-XDKB8X5XZ7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only supported in browser environments)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export const auth = getAuth(app);

// Initialize Firestore
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

// Suppress Firestore offline warning in sandbox
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = args.join(' ');
  if (msg.includes('Could not reach Cloud Firestore backend') || msg.includes('FirebaseError: [code=unavailable]')) {
    return;
  }
  originalConsoleError(...args);
};
`;

fs.writeFileSync('src/lib/firebase.ts', newFirebaseTs.trim() + '\\n');
