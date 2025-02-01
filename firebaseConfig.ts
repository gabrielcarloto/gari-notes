import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "gari-notes-6a170.firebaseapp.com",
  projectId: "gari-notes-6a170",
  storageBucket: "gari-notes-6a170.firebasestorage.app",
  messagingSenderId: "440213330944",
  appId: "1:440213330944:web:6b0225c271358667a70ce5",
} as const;

export const app = initializeApp(config);

export const db = getFirestore(app);

export const collections = {
  users: collection(db, "users"),
  folders: collection(db, "folders"),
  notes: collection(db, "notes"),
} as const;
