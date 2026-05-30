import type { JSX } from "react";

export enum RouteName {
  Dashboard,
  Tasks,
  Board,
  Activity,
  Members,
  Profile,
  Logout,
}

export interface RouteProps {
  id: string;
  name: RouteName;
  path: string;
  element: JSX.Element;
  children?: RouteProps[];
}