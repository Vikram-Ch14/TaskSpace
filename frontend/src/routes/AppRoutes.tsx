import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

export const AppRoutes = () => {
  const appRoutes = routes;

  return (
    <Router>
      <Routes>
        {appRoutes?.map((r) => (
          <Route id={r.id} path={r.path} element={r.element}>
            {r?.children?.length &&
              r?.children?.map((rc) => (
                <Route id={rc.id} path={rc.path} element={rc.element} />
              ))}
          </Route>
        ))}
      </Routes>
    </Router>
  );
};
