import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { STORAGE_KEYS, ROLES } from '../config/constants';

// Referințe la colecțiile Firestore
const db = firebase.firestore();
const usersCollection = db.collection('users');

/**
 * Înregistrează un nou utilizator
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: 'admin' | 'manager' | 'employee' = 'employee'
): Promise<User> => {
  try {
    // Creează utilizatorul în Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('Înregistrarea a eșuat');
    }

    // Actualizează profilul utilizatorului
    await user.updateProfile({
      displayName,
    });

    // Creează documentul utilizatorului în Firestore
    const userData: Omit<User, 'id'> = {
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
    };

    await usersCollection.doc(user.uid).set(userData);

    // Returnează datele utilizatorului
    return {
      id: user.uid,
      ...userData,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Autentifică un utilizator existent
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    // Autentifică utilizatorul în Firebase Auth
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('Autentificarea a eșuat');
    }

    // Obține datele utilizatorului din Firestore
    const userDoc = await usersCollection.doc(user.uid).get();
    
    if (!userDoc.exists) {
      throw new Error('Datele utilizatorului nu au fost găsite');
    }

    const userData = userDoc.data() as Omit<User, 'id'>;

    // Salvează token-ul în AsyncStorage pentru persistență
    const token = await user.getIdToken();
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    // Returnează datele utilizatorului
    return {
      id: user.uid,
      ...userData,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Deconectează utilizatorul curent
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await firebase.auth().signOut();
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Trimite un email pentru resetarea parolei
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Actualizează profilul utilizatorului
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  try {
    const user = firebase.auth().currentUser;

    if (!user) {
      throw new Error('Utilizatorul nu este autentificat');
    }

    // Actualizează displayName și photoURL în Firebase Auth dacă sunt furnizate
    if (data.displayName || data.photoURL) {
      await user.updateProfile({
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    }

    // Actualizează datele în Firestore
    await usersCollection.doc(userId).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Obține utilizatorul curent din Firebase Auth
 */
export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      unsubscribe();
      
      if (!firebaseUser) {
        resolve(null);
        return;
      }
      
      try {
        const userDoc = await usersCollection.doc(firebaseUser.uid).get();
        
        if (!userDoc.exists) {
          resolve(null);
          return;
        }
        
        const userData = userDoc.data() as Omit<User, 'id'>;
        
        resolve({
          id: firebaseUser.uid,
          ...userData,
        });
      } catch (error) {
        console.error('Error getting current user:', error);
        reject(error);
      }
    }, reject);
  });
};

/**
 * Schimbă parola utilizatorului
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = firebase.auth().currentUser;
    
    if (!user || !user.email) {
      throw new Error('Utilizatorul nu este autentificat');
    }
    
    // Reautentifică utilizatorul
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    
    await user.reauthenticateWithCredential(credential);
    
    // Schimbă parola
    await user.updatePassword(newPassword);
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}; 