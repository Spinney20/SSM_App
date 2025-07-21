import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import { COLLECTIONS, USER_ROLES } from '../config/constants';
import { Platform } from 'react-native';

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
): Promise<User> => {
  try {
    // Actualizează datele în Firestore
    await setDoc(
      doc(db, COLLECTIONS.USERS, userId),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    
    // Obține documentul actualizat
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    
    if (!userDoc.exists()) {
      throw new Error('Utilizatorul nu a fost găsit');
    }
    
    const userData = userDoc.data();
    
    // Returnează utilizatorul actualizat
    return {
      id: userId,
      ...userData,
      createdAt: userData.createdAt instanceof Date ? userData.createdAt.getTime() : 
                (userData.createdAt?.seconds ? userData.createdAt.seconds * 1000 : new Date().getTime()),
      updatedAt: userData.updatedAt instanceof Date ? userData.updatedAt.getTime() : 
                (userData.updatedAt?.seconds ? userData.updatedAt.seconds * 1000 : new Date().getTime()),
    } as User;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Autentificare cu Microsoft
export const signInWithMicrosoft = async (): Promise<User> => {
  try {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    let result;
    
    if (Platform.OS === 'web') {
      // Pe web, putem folosi popup sau redirect
      if (window.innerWidth < 768) {
        // Pe dispozitive mici, folosim redirect
        await signInWithRedirect(auth, provider);
        result = await getRedirectResult(auth);
      } else {
        // Pe desktop, folosim popup
        result = await signInWithPopup(auth, provider);
      }
    } else {
      // Pe mobil, folosim doar redirect
      await signInWithRedirect(auth, provider);
      result = await getRedirectResult(auth);
    }

    if (!result || !result.user) {
      throw new Error('Autentificarea cu Microsoft a eșuat');
    }

    const firebaseUser = result.user;
    
    // Verifică dacă utilizatorul există deja în Firestore
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
    
    if (userDoc.exists()) {
      // Utilizator existent, returnează datele
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        ...userData,
      } as User;
    } else {
      // Utilizator nou, creează profil în Firestore
      const nameParts = firebaseUser.displayName?.split(' ') || ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const userData = {
        email: firebaseUser.email || '',
        firstName,
        lastName,
        role: USER_ROLES.WORKER, // rol implicit pentru utilizatori noi
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), userData);
      
      return {
        id: firebaseUser.uid,
        ...userData,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      } as User;
    }
  } catch (error) {
    console.error('Error signing in with Microsoft:', error);
    throw error;
  }
}; 

// Funcții pentru administrarea utilizatorilor

// Obține toți utilizatorii
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, COLLECTIONS.USERS);
    const usersSnapshot = await getDocs(usersCollection);
    
    const users: User[] = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        ...userData,
        createdAt: userData.createdAt instanceof Date ? userData.createdAt.getTime() : 
                  (userData.createdAt?.seconds ? userData.createdAt.seconds * 1000 : new Date().getTime()),
        updatedAt: userData.updatedAt instanceof Date ? userData.updatedAt.getTime() : 
                  (userData.updatedAt?.seconds ? userData.updatedAt.seconds * 1000 : new Date().getTime()),
      } as User);
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Creează un utilizator de către administrator (fără autentificare)
export const createUserByAdmin = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'worker' | 'team_leader' | 'ssm_responsible' | 'admin' = 'worker',
  employeeCode?: string
): Promise<User> => {
  try {
    // Verifică dacă utilizatorul curent este administrator
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== USER_ROLES.ADMIN) {
      throw new Error('Nu aveți permisiunea de a crea utilizatori');
    }
    
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
    
    // Deconectare utilizator nou creat pentru a reveni la contul administratorului
    await firebaseSignOut(auth);
    
    // Reconectare cu contul administratorului
    if (currentUser) {
      await signInWithEmailAndPassword(auth, currentUser.email, password); // Notă: Acest pas necesită parola administratorului
    }
    
    // Returnare utilizator cu ID
    return {
      id: firebaseUser.uid,
      ...userData,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    } as User;
  } catch (error) {
    console.error('Error creating user by admin:', error);
    throw error;
  }
};

// Actualizare utilizator de către administrator
export const updateUserByAdmin = async (
  userId: string,
  data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>
): Promise<User> => {
  try {
    // Verifică dacă utilizatorul curent este administrator
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== USER_ROLES.ADMIN) {
      throw new Error('Nu aveți permisiunea de a actualiza utilizatori');
    }
    
    // Actualizează datele în Firestore
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    
    // Obține documentul actualizat
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    
    if (!userDoc.exists()) {
      throw new Error('Utilizatorul nu a fost găsit');
    }
    
    const userData = userDoc.data();
    
    // Returnează utilizatorul actualizat
    return {
      id: userId,
      ...userData,
      createdAt: userData.createdAt instanceof Date ? userData.createdAt.getTime() : 
                (userData.createdAt?.seconds ? userData.createdAt.seconds * 1000 : new Date().getTime()),
      updatedAt: userData.updatedAt instanceof Date ? userData.updatedAt.getTime() : 
                (userData.updatedAt?.seconds ? userData.updatedAt.seconds * 1000 : new Date().getTime()),
    } as User;
  } catch (error) {
    console.error('Error updating user by admin:', error);
    throw error;
  }
};

// Ștergere utilizator de către administrator
export const deleteUserByAdmin = async (userId: string): Promise<void> => {
  try {
    // Verifică dacă utilizatorul curent este administrator
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== USER_ROLES.ADMIN) {
      throw new Error('Nu aveți permisiunea de a șterge utilizatori');
    }
    
    // Șterge documentul utilizatorului din Firestore
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
    
    // Notă: Ștergerea utilizatorului din Firebase Auth necesită reautentificare și token-uri speciale
    // Această funcționalitate ar trebui implementată într-un backend securizat
  } catch (error) {
    console.error('Error deleting user by admin:', error);
    throw error;
  }
}; 