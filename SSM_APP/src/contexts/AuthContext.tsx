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
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
}

// Context pentru autentificare
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizat pentru a folosi contextul de autentificare
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props pentru AuthProvider
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
      const user = await authService.loginUser(email, password);
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

  // Funcție pentru autentificare cu Microsoft
  const loginWithMicrosoft = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await authService.signInWithMicrosoft();
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la autentificarea cu Microsoft',
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
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.logoutUser();
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la deconectare',
      }));
      throw error;
    }
  };

  // Funcție pentru resetarea parolei
  const resetPassword = async (email: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.resetPassword(email);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la resetarea parolei',
      }));
      throw error;
    }
  };

  // Funcție pentru actualizarea profilului
  const updateProfile = async (data: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      if (!authState.user) {
        throw new Error('Utilizatorul nu este autentificat');
      }
      
      const updatedUser = await authService.updateUserProfile(authState.user.id, data);
      
      setAuthState({
        user: updatedUser,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Eroare la actualizarea profilului',
      }));
      throw error;
    }
  };

  // Valoarea contextului
  const value = {
    authState,
    login,
    loginWithMicrosoft,
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