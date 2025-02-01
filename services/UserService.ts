import { app, collections, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { FirestoreUser, User } from "@/types/User";
import {
  addDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export class UserService {
  private static auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

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

      const info: FirestoreUser = {
        user_id: createdUser.user.uid,
        name,
        is_premium: false,
      };

      await addDoc(collections.users, info);

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
      const userInfo = await this.getUserData();

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
      signOut(getAuth());
    } catch (e) {
      console.log("Failed to sign out: " + e);
    }
  }

  public static async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;

    if (!user) return null;

    const userData = await this.getUserData();

    if (!userData) throw new Error("Could not get user info");

    return {
      id: user.uid,
      email: user.email as string,
      ...userData,
    };
  }

  public static onAuthChanged(listener: (u: User | null) => void) {
    return onAuthStateChanged(this.auth, (user) => {
      if (!user) listener(null);
      this.getCurrentUser().then(listener);
    });
  }

  public static async updateUser(info: Partial<Omit<User, "id" | "email">>) {
    try {
      const updateInfo: Partial<Omit<FirestoreUser, "user_id">> = {
        is_premium: info.isPremium,
        name: info.name,
      };

      const userInfoDoc = await this.queryCurrentUser();
      const d = doc(db, "users", userInfoDoc.id);

      await updateDoc(d, JSON.parse(JSON.stringify(updateInfo)));

      return true;
    } catch (e) {
      console.log("Failed to update user: ", e);
      return false;
    }
  }

  public static getCurrentUserId() {
    return this.auth.currentUser?.uid;
  }

  public static userConstraint = where(
    "user_id",
    "==",
    this.auth.currentUser?.uid,
  );

  private static async queryCurrentUser() {
    const q = query(collections.users, this.userConstraint);

    const snapshot = await getDocs(q);

    return snapshot.docs[0];
  }

  private static async getUserData(): Promise<Omit<
    User,
    "email" | "id"
  > | null> {
    const userInfoDoc = await this.queryCurrentUser();
    const userInfo = userInfoDoc.data() as FirestoreUser;

    return {
      name: userInfo.name,
      isPremium: userInfo.is_premium,
    };
  }
}
