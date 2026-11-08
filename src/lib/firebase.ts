import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { INITIAL_OPPORTUNITIES, INITIAL_COURSES, INITIAL_SOURCES } from './seedData.ts';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must use firestoreDatabaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Check connection and seed data if collection is empty (Admin only per security rules)
export async function initializeDatabaseSeed() {
  // Only authenticated admin can write to opportunities collection per firestore.rules
  if (!auth.currentUser || auth.currentUser.email !== 'kosisochukwuvictor07@gmail.com') {
    return;
  }

  try {
    const oppsRef = collection(db, 'opportunities');
    const existingSnap = await getDocs(query(oppsRef, limit(1)));

    if (existingSnap.empty) {
      console.log('Admin seeding initial verified opportunities and courses...');
      // Seed opportunities
      for (const opp of INITIAL_OPPORTUNITIES) {
        await setDoc(doc(db, 'opportunities', opp.id), opp);
      }
      // Seed courses
      for (const course of INITIAL_COURSES) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
      // Seed sources
      for (const src of INITIAL_SOURCES) {
        await setDoc(doc(db, 'opportunity_sources', src.id), src);
      }
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    // If not admin or offline, log gracefully
    console.warn('Initial seed check note:', error);
  }
}
