import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Tasks } from "@/pages/tasks/Tasks";
import { Layout } from "@/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteName, type RouteProps } from "./types";
import { Board } from "@/pages/board/Board";
import { Activity } from "@/pages/activity/Activity";

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
];
