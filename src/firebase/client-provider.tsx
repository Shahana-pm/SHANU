'use client';

import { ReactNode } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This provider is intended to be used in a client-side layout (`'use client'`)
// It will initialize Firebase on the client and provide it to all children.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = initializeFirebase();
  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
