import { createContext, useContext } from "react";

interface AuthContextProps {
  userName: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

export const useAuthCtx = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("Context not Found");
  }

  return context;
};
