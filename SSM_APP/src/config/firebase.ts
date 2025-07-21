import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { Platform } from 'react-native';

/**
 * Configurația Firebase pentru aplicația SSM
 */
const firebaseConfig = {
  apiKey: "AIzaSyC2eQGFlQ1Z4gdi8u8ibetJfKntvhoW_FA",
  authDomain: "ssmapp-52687.firebaseapp.com",
  projectId: "ssmapp-52687",
  storageBucket: "ssmapp-52687.firebasestorage.app",
  messagingSenderId: "125482949228",
  appId: "1:125482949228:web:ffe622fe6985f7dbd5d649",
  measurementId: "G-HWML60MP12"
};

// Inițializare Firebase
const app = initializeApp(firebaseConfig);

// Inițializare Analytics doar pe web
let analytics = null;
if (Platform.OS === 'web') {
  analytics = getAnalytics(app);
}

// Exportare servicii Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 