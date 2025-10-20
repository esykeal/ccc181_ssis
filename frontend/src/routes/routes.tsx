import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/features/Components/Dashboard";
import CollegePage from "@/pages/College/College";
import ProgramPage from "@/pages/Program/Program";
import StudentPage from "@/pages/Student/Student";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "colleges", element: <CollegePage /> },
      {
        path: "programs",
        element: <ProgramPage />,
      },
      {
        path: "students",
        element: <StudentPage />,
      },
    ],
  },
]);
