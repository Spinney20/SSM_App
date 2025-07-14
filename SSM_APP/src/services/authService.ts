import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import { COLLECTIONS, USER_ROLES } from '../config/constants';

// Înregistrare utilizator nou
export const registerUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string,
  role: 'worker' | 'team_leader' | 'ssm_responsible' | 'admin' = 'worker',
  employeeCode?: string
): Promise<User> => {
  try {
    // Creare utilizator în Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Actualizare profil cu nume
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Creare document utilizator în Firestore
    const userData = {
      email,
      firstName,
      lastName,
      role,
      employeeCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), userData);
    
    // Returnare utilizator cu ID
    return {
      id: firebaseUser.uid,
      ...userData,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    } as User;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Autentificare utilizator
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Obținere date utilizator din Firestore
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        ...userData,
      } as User;
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Deconectare utilizator
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Resetare parolă
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Obținere utilizator curent
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;
  
  if (!firebaseUser) {
    return null;
  }
  
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        ...userData,
      } as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Actualizare profil utilizator
export const updateUserProfile = async (
  userId: string,
  data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    await setDoc(
      doc(db, COLLECTIONS.USERS, userId),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 