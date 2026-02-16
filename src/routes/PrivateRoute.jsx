import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
    const { user, initializing } = useAuth();

    if (initializing) {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <span>Cargando...</span>
            </div>
        );
    }

    // ❌ No autenticado
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 🔒 Forzar cambio de contraseña
    if (user.passwordMustChange) {
        return <Navigate to="/change-password" replace />;
    }

    // ✅ Acceso permitido
    return children;
}
