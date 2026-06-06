import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";

export const App = () => (
  <AuthProvider>
    <AppRoutes />
    <Toaster
      richColors
      position="bottom-right"
      className="border border-[--bg-sidebar]"
    />
  </AuthProvider>
);
