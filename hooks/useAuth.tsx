import { UserService } from "@/services/UserService";
import { User } from "@/types/User";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthAPI {
  user: User | null;
  refetch: () => void;
}

const AuthContext = createContext<AuthAPI | null>(null);

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth hook must be used in a component wrapped by AuthProvider",
    );
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return UserService.onAuthChanged(setUser);
  }, []);

  function refetch() {
    UserService.getCurrentUser().then(setUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
