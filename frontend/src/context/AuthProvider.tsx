import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkIsAuthenticated = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(false);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userName, isLoading, isAuthenticated, setIsAuthenticated }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
