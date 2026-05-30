import type { RouteProps } from "./types";

export const getRoute = (currentRoute: string, routes: RouteProps[]): RouteProps | undefined => {
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