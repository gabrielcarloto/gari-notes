import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  initializeAuth,
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export class Firebase {
  private static config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "gari-notes-6a170.firebaseapp.com",
    projectId: "gari-notes-6a170",
    storageBucket: "gari-notes-6a170.firebasestorage.app",
    messagingSenderId: "440213330944",
    appId: "1:440213330944:web:6b0225c271358667a70ce5",
  };

  private static app = initializeApp(this.config);
  private static auth = initializeAuth(this.app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  public static async signUp(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      return res.user;
    } catch (e) {
      console.log("Failed to sign up: " + e);
      return null;
    }
  }

  public static async signIn(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, password);
      return res.user;
    } catch (e) {
      console.log("Failed to sign in: " + e);
      return null;
    }
  }

  public static async signOut() {
    try {
      await signOut(this.auth);
    } catch (e) {
      console.log("Failed to sign out: " + e);
    }
  }
}
