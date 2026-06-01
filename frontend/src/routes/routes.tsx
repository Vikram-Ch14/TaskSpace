import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Tasks } from "@/pages/tasks/Tasks";
import { Layout } from "@/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteName, type RouteProps } from "./types";
import { Board } from "@/pages/board/Board";
import { Activity } from "@/pages/activity/Activity";
import { Login } from "@/pages/Login/Login";
import { Signup } from "@/pages/Signup/Signup";

export const routes: RouteProps[] = [
  {
    id: "app",
    name: RouteName.Dashboard,
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        id: "dashboard",
        name: RouteName.Dashboard,
        path: "/",
        element: <Dashboard />,
      },
      {
        id: "tasks",
        name: RouteName.Tasks,
        path: "/tasks",
        element: <Tasks />,
      },
      {
        id: "board",
        name: RouteName.Board,
        path: "/board",
        element: <Board />,
      },
      {
        id: "activity",
        name: RouteName.Activity,
        path: "/activity",
        element: <Activity />,
      },
    ],
  },
  {
    id: "login",
    name: RouteName.Login,
    path: "/accounts/login",
    element: <Login />,
  },
  {
    id: "signup",
    name: RouteName.Signup,
    path: "/accounts/signup",
    element: <Signup />,
  }
];
