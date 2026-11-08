import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';

export interface RecentSearchItem {
  id: string;
  userId: string;
  query: string;
  category?: string;
  resultCount?: number;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'opportunity_recent_searches_guest';

/**
 * Fetch recent searches for a user from Firestore (or localStorage if guest)
 */
export async function fetchRecentSearches(
  userId?: string,
  maxLimit: number = 8
): Promise<RecentSearchItem[]> {
  if (!userId) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const list: RecentSearchItem[] = JSON.parse(raw);
      return list.slice(0, maxLimit);
    } catch {
      return [];
    }
  }

  const collectionPath = 'recent_searches';
  try {
    const q = query(
      collection(db, collectionPath),
      where('userId', '==', userId),
      limit(25)
    );
    const snap = await getDocs(q);
    const items: RecentSearchItem[] = [];
    snap.forEach((d) => {
      const data = d.data();
      items.push({
        id: d.id,
        userId: data.userId,
        query: data.query,
        category: data.category,
        resultCount: data.resultCount,
        createdAt: data.createdAt,
      });
    });

    // Client-side sort by createdAt descending (avoids requiring compound Firestore composite index)
    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return items.slice(0, maxLimit);
  } catch (error) {
    console.warn('Could not fetch recent searches from Firestore:', error);
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return [];
  }
}

/**
 * Save a new search query to Firestore. Deduplicates identical recent queries.
 */
export async function saveRecentSearch(
  userId: string | undefined,
  queryText: string,
  category?: string,
  resultCount?: number
): Promise<RecentSearchItem | null> {
  const cleanQuery = queryText.trim();
  if (!cleanQuery) return null;

  const nowIso = new Date().toISOString();

  // Guest fallback
  if (!userId) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: RecentSearchItem[] = raw ? JSON.parse(raw) : [];
      // Remove previous duplicate of same query
      list = list.filter((item) => item.query.toLowerCase() !== cleanQuery.toLowerCase());
      const newItem: RecentSearchItem = {
        id: 'guest_' + Date.now(),
        userId: 'guest',
        query: cleanQuery,
        category: category && category !== 'All Categories' ? category : undefined,
        resultCount,
        createdAt: nowIso,
      };
      list.unshift(newItem);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.slice(0, 15)));
      return newItem;
    } catch {
      return null;
    }
  }

  const collectionPath = 'recent_searches';
  try {
    // Check if duplicate already exists in user's recent list to remove it first
    const existingQ = query(
      collection(db, collectionPath),
      where('userId', '==', userId),
      limit(20)
    );
    const existingSnap = await getDocs(existingQ);
    const toDelete: string[] = [];

    existingSnap.forEach((d) => {
      const data = d.data();
      if (data.query?.toLowerCase() === cleanQuery.toLowerCase()) {
        toDelete.push(d.id);
      }
    });

    // Delete existing duplicate doc to keep list clean
    for (const docId of toDelete) {
      await deleteDoc(doc(db, collectionPath, docId));
    }

    // Add fresh record
    const payload = {
      userId,
      query: cleanQuery,
      category: category && category !== 'All Categories' ? category : '',
      resultCount: resultCount ?? 0,
      createdAt: nowIso,
    };

    const docRef = await addDoc(collection(db, collectionPath), payload);

    return {
      id: docRef.id,
      ...payload,
    };
  } catch (error) {
    console.error('Error saving recent search:', error);
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
    return null;
  }
}

/**
 * Delete an individual search entry by ID
 */
export async function deleteRecentSearch(
  searchId: string,
  userId?: string
): Promise<void> {
  if (!userId || searchId.startsWith('guest_')) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        let list: RecentSearchItem[] = JSON.parse(raw);
        list = list.filter((i) => i.id !== searchId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
    return;
  }

  const collectionPath = 'recent_searches';
  try {
    await deleteDoc(doc(db, collectionPath, searchId));
  } catch (error) {
    console.error('Error deleting recent search:', error);
    handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${searchId}`);
  }
}

/**
 * Clear all recent searches for a user
 */
export async function clearAllRecentSearches(userId?: string): Promise<void> {
  if (!userId) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return;
  }

  const collectionPath = 'recent_searches';
  try {
    const q = query(
      collection(db, collectionPath),
      where('userId', '==', userId),
      limit(50)
    );
    const snap = await getDocs(q);
    const deletes = snap.docs.map((d) => deleteDoc(doc(db, collectionPath, d.id)));
    await Promise.all(deletes);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    handleFirestoreError(error, OperationType.DELETE, collectionPath);
  }
}
