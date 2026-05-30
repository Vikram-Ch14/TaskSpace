import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const isAuthenticated = true;
  const location = useLocation();

  return isAuthenticated ? children : <Navigate to="/accounts/login" />;
};
