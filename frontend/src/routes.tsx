import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./modules/Dashboard";
import CollegeList from "@/modules/college/CollegeList";
import ProgramList from "@/modules/program/ProgramList";
import StudentList from "./modules/student/StudentList";

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
