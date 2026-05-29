import type { JSX } from "react";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Tasks } from "@/pages/tasks/Tasks";
import { Layout } from "@/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

interface RouteProps {
  id: string;
  name: number;
  path: string;
  element: JSX.Element;
  children?: RouteProps[];
}

export enum RouteName {
  Dashboard,
  Tasks,
}

export const getRoute = (currentRoute: string): RouteProps | undefined => {
  let ctRoute: RouteProps | undefined = undefined;

  const findRoute = (ctr: string, routes: RouteProps[]) => {
    for (const route of routes) {
      if (route.path === ctr) {
        ctRoute = route;
      }
      if (route?.children?.length) {
        findRoute(ctr, route.children);
      }
    }
  };

  findRoute(currentRoute, routes);

  return ctRoute;
};

export const routes: RouteProps[] = [
  {
    id: "app",
    name: RouteName.Dashboard,
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        id: "dashboard",
        name: RouteName.Dashboard,
        path: "/dashboard",
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
