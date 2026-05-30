import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Tasks } from "@/pages/tasks/Tasks";
import { Layout } from "@/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteName, type RouteProps } from "./types";

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
    ],
  },
];
