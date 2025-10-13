import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/features/Components/Dashboard";
import CollegePage from "@/pages/College/College";
import ProgramList from "@/features/Programs/ProgramList";
import StudentList from "@/features/Student/StudentList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "colleges", element: <CollegePage /> },
      {
        path: "programs",
        element: <ProgramList />,
      },
      {
        path: "students",
        element: <StudentList />,
      },
    ],
  },
]);
