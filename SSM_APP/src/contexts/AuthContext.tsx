import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User, AuthState } from '../types';
import * as authService from '../services/authService';

// Definire tipuri pentru context
interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role?: 'worker' | 'team_leader' | 'ssm_responsible' | 'admin', employeeCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
}

// Creare context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook pentru utilizarea contextului
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth trebuie utilizat în interiorul unui AuthProvider');
  }
  return context;
};

// Props pentru provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Stare autentificare
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Efect pentru monitorizarea stării autentificării
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Utilizator autentificat, obținem datele din Firestore
          const userData = await authService.getCurrentUser();
          setAuthState({
            user: userData,
            loading: false,
            error: null,
          });
        } else {
          // Utilizator neautentificat
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: 'Eroare la obținerea datelor utilizatorului',
        });
      }
    });

    // Cleanup la unmount
    return () => unsubscribe();
  }, []);

  // Funcție pentru autentificare
  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authService.signIn(email, password);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la autentificare',
      }));
      throw error;
    }
  };

  // Funcție pentru înregistrare
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'worker' | 'team_leader' | 'ssm_responsible' | 'admin' = 'worker',
    employeeCode?: string
  ): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authService.registerUser(email, password, firstName, lastName, role, employeeCode);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la înregistrare',
      }));
      throw error;
    }
  };

  // Funcție pentru deconectare
  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Eroare la deconectare',
      }));
      throw error;
    }
  };

  // Funcție pentru resetarea parolei
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await authService.resetPassword(email);
    } catch (error: any) {
      throw error;
    }
  };

  // Funcție pentru actualizarea profilului
  const updateProfile = async (
    data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> => {
    if (!authState.user) {
      throw new Error('Utilizatorul nu este autentificat');
    }

    try {
      await authService.updateUserProfile(authState.user.id, data);
      // Actualizăm starea locală
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));
    } catch (error: any) {
      throw error;
    }
  };

  // Valoarea contextului
  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 