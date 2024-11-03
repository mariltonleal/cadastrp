import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXizFKBB_p0Xxtilq6ryxOK7t6cJzLmfY",
  authDomain: "cadastro-de-produto-2b642.firebaseapp.com",
  projectId: "cadastro-de-produto-2b642",
  storageBucket: "cadastro-de-produto-2b642.firebasestorage.app",
  messagingSenderId: "643715194322",
  appId: "1:643715194322:web:8c18a421d97b3b14873c0b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);