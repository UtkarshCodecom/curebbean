// src/lib/firebase.js
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  // connectAuthEmulator, // <- optional (see emulator section)
} from "firebase/auth";
import {
  getFirestore,
  // connectFirestoreEmulator, // <- optional (see emulator section)
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // measurementId is optional for analytics; not needed for M1
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ---- Initialize (guard against re-init) ----
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth + persistence (keeps user signed in across reloads)
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Firestore
const db = getFirestore(app);


export { app, auth, db };

/**
 * Anonymous sign-in (keeps M1 "no PII" promise).
 * Call this in a Client Component (e.g., useEffect on mount).
 */
export async function loginAnonymous() {
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

/**
 * If later you decide to use email/password, uncomment these:
 */
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// export async function register(email, password) {
//   const { user } = await createUserWithEmailAndPassword(auth, email, password);
//   return user;
// }
// export async function login(email, password) {
//   const { user } = await signInWithEmailAndPassword(auth, email, password);
//   return user;
// }
