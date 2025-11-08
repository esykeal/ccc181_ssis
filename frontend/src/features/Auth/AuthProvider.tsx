import { AuthContext } from "./AuthContext";
import useAuth from "./useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, fetchCredentials, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ auth, fetchCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
