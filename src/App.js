import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Manage/Manage";
import ManageUsers from "./pages/Manage/ManageUsers";
import ManageShipping from "./pages/Manage/ManagePreshipping";
import PrivateRoute from "./routes/PrivateRoute";
import ManageIProcess from "./pages/Manage/InitialProcess/ManageIProcess";
import ManagePostShipping from "./pages/Manage/PostShipping/ManagePostShipping";
import ManageCustoms from "./pages/Manage/Customs/ManageCustoms";
import ManageDispatch from "./pages/Manage/Dispatch/ManageDispatch";
import ManageControlImport from "./pages/Manage/ManageControlImport";
import ManageCommerce from "./pages/Manage/Commerce/ManageCommerce";
import ManageReports from "./pages/Manage/Reports/ManageReports";
import ChangePassword from "./pages/ChangePassword";
import ManageCatalog from "./pages/Manage/Catalog/ManageCatalog";
import ManageTimes from "./pages/Manage/Times/ManageTimes";
export default function App() {
  return (
    <Routes>

      {/* 🌐 Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

      {/* 🔐 Privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <Admin />
          </PrivateRoute>
        }
      >
        <Route path="usuario" element={<ManageUsers />} />
      </Route>

      <Route
        path="/preembarque"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManageShipping />
          </PrivateRoute>
        }
      />

      <Route
        path="/postembarque"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManagePostShipping />
          </PrivateRoute>
        }
      />

      <Route
        path="/aduana"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManageCustoms />
          </PrivateRoute>
        }
      />

      <Route
        path="/despacho"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManageDispatch />
          </PrivateRoute>
        }
      />

      <Route
        path="/inicioproceso"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManageIProcess />
          </PrivateRoute>
        }
      />

      <Route
        path="/controlimport"
        element={
          <PrivateRoute>
            <ManageControlImport />
          </PrivateRoute>
        }
      />

      <Route
        path="/comercial"
        element={
          <PrivateRoute>
            <ManageCommerce />
          </PrivateRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <PrivateRoute>
            <ManageReports />
          </PrivateRoute>
        }
      />
      <Route
        path="/catalogos"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManageCatalog />
          </PrivateRoute>
        }
      />
      <Route
        path="/tiempos"
        element={
          <PrivateRoute>
            <ManageTimes />
          </PrivateRoute>
        }
      />

      {/* 🧭 Catch-all seguro */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}
