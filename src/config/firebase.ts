import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Configurația Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "ssm-app.firebaseapp.com",
  projectId: "ssm-app",
  storageBucket: "ssm-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-XXXXXXXXXX"
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

export default firebase; 