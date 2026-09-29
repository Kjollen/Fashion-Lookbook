import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { LookEntry } from './types';

const LOOKS_COLLECTION = 'looks';

export async function getAllEntries(userId: string): Promise<LookEntry[]> {
  const q = query(
    collection(db, LOOKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LookEntry[];
}

export async function addEntry(entry: Omit<LookEntry, 'id'>, userId: string): Promise<LookEntry> {
  const docRef = await addDoc(collection(db, LOOKS_COLLECTION), {
    ...entry,
    userId,
  });
  return {
    id: docRef.id,
    ...entry,
    userId,
  } as LookEntry;
}

export async function updateEntry(entry: LookEntry, userId: string): Promise<void> {
  const docRef = doc(db, LOOKS_COLLECTION, entry.id);
  const { id, ...data } = entry;
  await updateDoc(docRef, data);
}

export async function deleteEntry(id: string, userId: string): Promise<void> {
  await deleteDoc(doc(db, LOOKS_COLLECTION, id));
}
