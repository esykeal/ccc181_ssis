import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/features/Auth/AuthContext";
import { useEffect } from "react";

import App from "@/App";
import Dashboard from "@/features/Components/Dashboard";
import CollegePage from "@/pages/College/College";
import ProgramPage from "@/pages/Program/Program";
import StudentPage from "@/pages/Student/Student";
import LoginPage from "@/pages/LogIn/LogIn";
import SignupPage from "@/pages/SignUp/SignUp";

function ProtectedLayout() {
  const { auth, fetchCredentials } = useAuthContext();

  useEffect(() => {
    if (auth.status === "loading") {
      fetchCredentials();
    }
  }, [auth.status, fetchCredentials]);

  if (auth.status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  if (auth.status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicLayout() {
  const { auth } = useAuthContext();

  if (auth.status === "authenticated") return <Navigate to="/" />;

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },

  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "colleges", element: <CollegePage /> },
          { path: "programs", element: <ProgramPage /> },
          { path: "students", element: <StudentPage /> },
        ],
      },
    ],
  },
]);
