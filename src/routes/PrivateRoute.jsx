import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function PrivateRoute({ children, allowedRoles }) {
    const { user, initializing } = useAuth();
    const location = useLocation();

    if (initializing) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // ❌ No autenticado
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 🔒 Forzar cambio de contraseña (permitir acceso si ya está en /change-password)
    if (user.passwordMustChange && location.pathname !== "/change-password") {
        return <Navigate to="/change-password" replace />;
    }

    // ✅ Acceso permitido
    if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
