import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { LookEntry } from './types';

const LOOKS_COLLECTION = 'looks';

async function uploadPhoto(photoData: string, entryId: string, userId: string): Promise<string> {
  const storageRef = ref(storage, `users/${userId}/looks/${entryId}.jpg`);
  await uploadString(storageRef, photoData, 'data_url');
  return await getDownloadURL(storageRef);
}

async function deletePhoto(entryId: string, userId: string): Promise<void> {
  try {
    const storageRef = ref(storage, `users/${userId}/looks/${entryId}.jpg`);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Failed to delete photo:', err);
  }
}

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
  const photoUrl = await uploadPhoto(entry.photo, `temp-${Date.now()}`, userId);
  const docRef = await addDoc(collection(db, LOOKS_COLLECTION), {
    ...entry,
    photo: photoUrl,
    userId,
  });
  const finalPhotoUrl = await uploadPhoto(entry.photo, docRef.id, userId);
  await updateDoc(docRef, { photo: finalPhotoUrl });
  return {
    id: docRef.id,
    ...entry,
    photo: finalPhotoUrl,
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
  await deletePhoto(id, userId);
}
