import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { AuthState } from "./authTypes";

export default function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  const fetchCredentials = useCallback(async () => {
    try {
      console.log("Fetching credentials from /auth/me...");
      const res = await api.get("/auth/me");
      console.log("Auth response:", res.data);

      if (res.data.success && res.data.user) {
        console.log("Setting authenticated with user:", res.data.user);
        setAuth({ status: "authenticated", user: res.data.user });
      } else {
        console.log("Setting unauthenticated");
        setAuth({ status: "unauthenticated", user: null });
      }
    } catch (error) {
      console.error("Error fetching auth:", error);
      setAuth({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => {
    console.log("Initial auth check");
    fetchCredentials();
  }, [fetchCredentials]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setAuth({ status: "unauthenticated", user: null });
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  return {
    auth,
    fetchCredentials,
    logout,
  };
}
