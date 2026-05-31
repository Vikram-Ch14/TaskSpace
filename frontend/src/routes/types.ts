import type { JSX } from "react";

export enum RouteName {
  Dashboard,
  Tasks,
  Board,
  Activity,
  Members,
  Profile,
  Logout,
  Login
}

export interface RouteProps {
  id: string;
  name: RouteName;
  path: string;
  element: JSX.Element;
  children?: RouteProps[];
}