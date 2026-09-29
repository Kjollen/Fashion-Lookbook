import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBQ09W9R9zrTDNpTjMbIaZegnXHYBLXv8k",
  authDomain: "fashion-lookbook-d9807.firebaseapp.com",
  projectId: "fashion-lookbook-d9807",
  storageBucket: "fashion-lookbook-d9807.firebasestorage.app",
  messagingSenderId: "141247616449",
  appId: "1:141247616449:web:a9ebc43c3ee24f96110b40",
  measurementId: "G-F2PR1SWTK5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
