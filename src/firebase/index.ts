import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

function initializeFirebase(): { app: FirebaseApp; auth: Auth; firestore: Firestore } {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
    // Important: The connectXXXEmulator functions below will fail if the emulators
    // are not running. Make sure you have started the emulators with `firebase emulators:start`
    // before running the app.
    try {
      connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
      connectFirestoreEmulator(firestore, host, 8080);
    } catch (e) {
      console.error(
        "Could not connect to Firebase emulators. Make sure they are running."
      );
      console.error(e);
    }
  }
  
  return { app, auth, firestore };
}

export { initializeFirebase };
export * from './provider';
export * from './auth/use-user';
