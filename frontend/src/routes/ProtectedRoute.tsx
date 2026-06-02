import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthCtx } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuthCtx();

  return isAuthenticated ? children : <Navigate to="/accounts/login" />;
};
