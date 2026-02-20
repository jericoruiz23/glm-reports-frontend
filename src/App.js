import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import { routesConfig } from "./routes/routesConfig";

function buildRouteElement(route) {
  const Page = route.component;
  const pageElement = <Page />;

  if (route.isPublic) return pageElement;

  return (
    <PrivateRoute allowedRoles={route.allowedRoles}>
      {pageElement}
    </PrivateRoute>
  );
}

function renderRoute(route) {
  return (
    <Route key={route.path} path={route.path} element={buildRouteElement(route)}>
      {route.children?.map((child) => {
        const ChildPage = child.component;
        return <Route key={`${route.path}:${child.path}`} path={child.path} element={<ChildPage />} />;
      })}
    </Route>
  );
}

export default function App() {
  return (
    <Routes>
      {routesConfig.map(renderRoute)}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
