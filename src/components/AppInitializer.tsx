'use client';

import { useAuth, useFirestore, useUser } from '@/firebase';
import { seedFirestore } from '@/lib/seed';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { initializeFirebase } from '@/firebase/client-provider';
import { useEffect, useState } from 'react';

export function AppInitializer() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (firestore && auth && !isUserLoading && !isSeeding) {
      const signInAndSeed = async () => {
        setIsSeeding(true);
        try {
          if (!user) {
            console.log('Signing in anonymously to seed data...');
            // We await this to ensure we have a user for seeding
            await initiateAnonymousSignIn(auth);
            console.log('Signed in anonymously.');
          }
          
          console.log('Starting to seed firestore');
          // No try-catch here. Let errors propagate to be caught by the listener.
          await seedFirestore(firestore, auth);
          console.log('Finished seeding firestore');

        } catch (err) {
            console.error("Error during sign-in or seeding:", err);
        }
      };
      signInAndSeed();
    }
  }, [firestore, auth, user, isUserLoading, isSeeding]);

  return null;
}
