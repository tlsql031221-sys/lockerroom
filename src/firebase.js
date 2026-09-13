import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwzcoxZbVJiDdWIgULBkltzuzdD60Myw0",
  authDomain: "lockerroom-17d03.firebaseapp.com",
  projectId: "lockerroom-17d03",
  storageBucket: "lockerroom-17d03.firebasestorage.app",
  messagingSenderId: "508387832543",
  appId: "1:508387832543:web:18aa8f6b8571d3fcebaf6a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);