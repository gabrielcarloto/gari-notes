import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  initializeAuth,
  onAuthStateChanged,
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { FirestoreUser, User } from "@/types/User";

export class Firebase {
  private static config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "gari-notes-6a170.firebaseapp.com",
    projectId: "gari-notes-6a170",
    storageBucket: "gari-notes-6a170.firebasestorage.app",
    messagingSenderId: "440213330944",
    appId: "1:440213330944:web:6b0225c271358667a70ce5",
  } as const;

  private static app = initializeApp(this.config);

  private static db = getFirestore(this.app);
  private static auth = initializeAuth(this.app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  private static collections = {
    users: collection(this.db, "users"),
  } as const;

  public static async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const createdUser = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      const info: Omit<FirestoreUser, "is_premium"> = {
        user_id: createdUser.user.uid,
        name,
      };

      await addDoc(this.collections.users, info);

      return {
        id: createdUser.user.uid,
        email: createdUser.user.email as string,
        name,
        isPremium: false,
      };
    } catch (e) {
      console.log("Failed to sign up: " + e);
      return null;
    }
  }

  public static async signIn(
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);

      const userInfo = await this.getUserData(user.user.uid);

      if (!userInfo) throw new Error("Could not get user info");

      return {
        id: user.user.uid,
        email: user.user.email as string,
        ...userInfo,
      };
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

  public static async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;

    if (!user) return null;

    const userData = await this.getUserData(user.uid);

    if (!userData) throw new Error("Could not get user info");

    return {
      id: user.uid,
      email: user.email as string,
      ...userData,
    };
  }

  private static async getUserData(
    userId: string,
  ): Promise<Omit<User, "email" | "id"> | null> {
    const q = query(this.collections.users, where("user_id", "==", userId));

    const snapshot = await getDocs(q);

    const userInfo = snapshot.docs[0].data() as FirestoreUser;

    return {
      name: userInfo.name,
      isPremium: userInfo.is_premium,
    };
  }

  public static onAuthChanged(listener: (u: User | null) => void) {
    return onAuthStateChanged(this.auth, (user) => {
      if (!user) listener(null);
      this.getCurrentUser().then(listener);
    });
  }
}
