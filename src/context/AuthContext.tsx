import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase.ts';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  country: string;
  highestEducation?: string;
  experienceLevel?: string;
  workPreference?: string;
  skills?: string[];
  targetCategories?: string[];
  industries?: string[];
  isOnboarded?: boolean;
  role?: 'user' | 'admin';
  plan?: 'free' | 'premium';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  authModalOpen: boolean;
  openAuthModal: (mode?: 'signin' | 'register') => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, country: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_EMAIL = 'kosisochukwuvictor07@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || userProfile?.role === 'admin';

  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
      } else {
        // Create initial user document
        const newProfile: UserProfile = {
          uid: user.uid,
          fullName: user.displayName || 'Opportunity Seeker',
          email: user.email || '',
          country: 'Nigeria',
          highestEducation: 'Undergraduate',
          experienceLevel: '1–3 years',
          workPreference: 'remote',
          skills: ['Communication', 'Research', 'Problem Solving'],
          targetCategories: ['Jobs', 'Scholarships', 'Remote Work'],
          industries: ['Technology', 'Education'],
          isOnboarded: false,
          role: user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          plan: 'free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Failed to fetch/create user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'register' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await fetchUserProfile(res.user);
        closeAuthModal();
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, country: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        fullName: name,
        email: email,
        country: country || 'Nigeria',
        highestEducation: 'Undergraduate',
        experienceLevel: '1–3 years',
        workPreference: 'remote',
        skills: ['Communication', 'Research'],
        targetCategories: ['Jobs', 'Remote Work'],
        industries: ['Technology'],
        isOnboarded: false,
        role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
        plan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
      closeAuthModal();
    } catch (err: any) {
      console.error('Registration Error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await fetchUserProfile(cred.user);
      closeAuthModal();
    } catch (err: any) {
      console.error('Login Error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('Not authenticated');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updated = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(userRef, updated);
      setUserProfile((prev) => (prev ? { ...prev, ...updated } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        registerWithEmail,
        loginWithEmail,
        logout,
        resetPassword,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
