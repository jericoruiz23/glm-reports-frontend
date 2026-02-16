import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Manage/Manage";
import Reportes from "./pages/Reports";
import ManageUsers from "./pages/Manage/ManageUsers";
import ManageShipping from "./pages/Manage/ManagePreshiping";
import PrivateRoute from "./routes/PrivateRoute";
import ManageImports from "./pages/Manage/ManageImports";
import ManageHistorical from "./pages/Manage/ManageHistorical";
import ManageForms from "./pages/Manage/Forms/ManageForms";
import ManageIProcess from "./pages/Manage/InitialProcess/ManageIProcess";
import ManagePostShipping from "./pages/Manage/PostShipping/ManagePostShipping";
import ManageCustoms from "./pages/Manage/Customs/ManageCustoms";
import ManageDispatch from "./pages/Manage/Dispatch/ManageDispatch";
import ManageControlImport from "./pages/Manage/ManageControlImport";
import ManageCommerce from "./pages/Manage/Commerce/ManageCommerce";
import ManageAutomatic from "./pages/Manage/Automatic/ManageAutomatic";
import ManageReports from "./pages/Manage/Reports/ManageReports";
import ChangePassword from "./pages/ChangePassword";
import ManageCatalog from "./pages/Manage/Catalog/ManageCatalog";
import ManageTimes from "./pages/Manage/Times/ManageTimes";
export default function App() {
  return (
    <Routes>

      {/* 🌐 Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

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
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      >
        <Route path="usuario" element={<ManageUsers />} />
      </Route>

      <Route
        path="/procesos"
        element={
          <PrivateRoute>
            <Reportes />
          </PrivateRoute>
        }
      />

      <Route
        path="/preembarque"
        element={
          <PrivateRoute>
            <ManageShipping />
          </PrivateRoute>
        }
      />

      <Route
        path="/importaciones"
        element={
          <PrivateRoute>
            <ManageImports />
          </PrivateRoute>
        }
      />

      <Route
        path="/historico"
        element={
          <PrivateRoute>
            <ManageHistorical />
          </PrivateRoute>
        }
      />

      <Route
        path="/gestion/facturas"
        element={
          <PrivateRoute>
            <ManageForms />
          </PrivateRoute>
        }
      />

      <Route
        path="/postembarque"
        element={
          <PrivateRoute>
            <ManagePostShipping />
          </PrivateRoute>
        }
      />

      <Route
        path="/aduana"
        element={
          <PrivateRoute>
            <ManageCustoms />
          </PrivateRoute>
        }
      />

      <Route
        path="/despacho"
        element={
          <PrivateRoute>
            <ManageDispatch />
          </PrivateRoute>
        }
      />

      <Route
        path="/inicioproceso"
        element={
          <PrivateRoute>
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
        path="/automatico"
        element={
          <PrivateRoute>
            <ManageAutomatic />
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
          <PrivateRoute>
            <ManageCatalog />
          </PrivateRoute>
        }
      />
      <Route
        path="/tiempos"
        element={
          <PrivateRoute>
            <ManageTimes/>
          </PrivateRoute>
        }
      />

      {/* 🧭 Catch-all seguro */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}
