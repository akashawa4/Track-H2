import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAd5l2zGFmc-f0uVlCC25JkojY3R8tsh-M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'h2oo-a4378.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'h2oo-a4378',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'h2oo-a4378.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '506767007644',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ?? '1:506767007644:web:baf84f39f8a02b7017b259',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-949F0RQEHM',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ??
    'https://h2oo-a4378-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);

// Analytics only works in browser environments.
export const analytics =
  typeof window !== 'undefined' ? getAnalytics(app) : undefined;
export const database = getDatabase(app);
export default app;
