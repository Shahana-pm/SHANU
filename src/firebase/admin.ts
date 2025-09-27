// src/firebase/admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { firebaseConfig } from './config';

// IMPORTANT: Replace with your service account credentials
const serviceAccount = {
  projectId: firebaseConfig.projectId,
  // These are intentionally left blank. Firebase Admin SDK will use
  // Application Default Credentials when running in a Google Cloud environment.
  clientEmail: undefined,
  privateKey: undefined,
};

function createAdminApp(): App {
    if (getApps().length > 0) {
      return getApps()[0];
    }
  
    return initializeApp({
      credential: cert(serviceAccount),
    });
}
  
export const adminApp = createAdminApp();
