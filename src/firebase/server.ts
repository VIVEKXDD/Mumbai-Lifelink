import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): { firebaseApp: FirebaseApp | null; firestore: Firestore | null } {
  if (typeof window !== 'undefined') {
    console.warn("initializeFirebase (server) called on the client");
    return { firebaseApp: null, firestore: null };
  }

  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      console.error('Failed to initialize Firebase on server.', e);
      return { firebaseApp: null, firestore: null };
    }
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    firestore: getFirestore(firebaseApp)
  };
}
