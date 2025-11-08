export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: User | null;
}

export interface AuthContextType {
  auth: AuthState;
  fetchCredentials: () => Promise<void>;
  logout: () => void;
}
