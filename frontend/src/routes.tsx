import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "@/modules/Dashboard";
import CollegeList from "@/modules/college/CollegeList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "colleges",
        element: <CollegeList />,
      },
      {
        path: "programs",
        element: <div className="p-8">Program Component Coming Soon</div>,
      },
      {
        path: "students",
        element: <div className="p-8">Students Component Coming Soon</div>,
      },
    ],
  },
]);
