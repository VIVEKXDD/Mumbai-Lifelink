'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously as firebaseSignInAnonymously,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (blocking). */
export async function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  await firebaseSignInAnonymously(authInstance);
}

/** Initiate email/password sign-up (blocking). */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  await firebaseCreateUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (blocking). */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  await firebaseSignInWithEmailAndPassword(authInstance, email, password);
}
