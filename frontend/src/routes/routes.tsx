import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/features/Components/Dashboard";
import CollegeList from "@/features/College/CollegeList";
import ProgramList from "@/features/Programs/ProgramList";
import StudentList from "@/features/Student/StudentList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "colleges", element: <CollegeList /> },
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
