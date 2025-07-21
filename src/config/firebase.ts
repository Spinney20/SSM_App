import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/analytics';
import { Platform } from 'react-native';

// Configurația Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2eQGFlQ1Z4gdi8u8ibetJfKntvhoW_FA",
  authDomain: "ssmapp-52687.firebaseapp.com",
  projectId: "ssmapp-52687",
  storageBucket: "ssmapp-52687.appspot.com",
  messagingSenderId: "125482949228",
  appId: "1:125482949228:web:ffe622fe6985f7dbd5d649",
  measurementId: "G-HWML60MP12"
};

// Inițializează Firebase dacă nu este deja inițializat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Exportă instanțele Firebase
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Activează persistența pentru Firestore (opțional)
firestore.enablePersistence({ synchronizeTabs: true })
  .catch((err: { code: string }) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Persistența Firestore nu poate fi activată: mai multe taburi sunt deschise');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Persistența Firestore nu este suportată de acest browser');
    }
  });

// Inițializează Analytics doar pentru web
let analytics = null;
if (Platform.OS === 'web') {
  analytics = firebase.analytics();
}

export { analytics };
export default firebase; 