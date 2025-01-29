export interface User {
  name: string;
  email: string;
  id: string;
  isPremium: boolean;
}

export interface FirestoreUser {
  user_id: string;
  name: string;
  is_premium: boolean;
}
