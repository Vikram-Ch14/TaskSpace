import { AuthProvider } from "./context/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";

export const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
