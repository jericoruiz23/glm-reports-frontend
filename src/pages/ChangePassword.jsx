import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";


export default function ChangePassword() {
    const [newPassword, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const navigate = useNavigate();
    const { passwordChanged } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validación mínima de 8 caracteres
        if (newPassword.trim().length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }


        // ✅ Validación de confirmación
        if (newPassword !== confirm) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            await api.post("/api/auth/change-password", {
                newPassword: newPassword.trim(),
            });

            toast.success("Contraseña actualizada. Inicia sesión nuevamente");

            passwordChanged(); // ✅ elimina el bloqueo
            navigate("/login", { replace: true });

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al cambiar contraseña");
        } finally {
            setLoading(false);
        }

    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))",
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: 380,
                    p: 4,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(255,255,255,0.4)",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={1}
                    textAlign="center"
                >
                    Cambia tu contraseña
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                    textAlign="center"
                >
                    Por seguridad, debes establecer una nueva contraseña
                </Typography>

                <TextField
                    label="Nueva contraseña"
                    type="password"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    value={newPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                <TextField
                    label="Confirmar contraseña"
                    type="password"
                    fullWidth
                    required
                    sx={{ mb: 3 }}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={loading}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                    }}
                >
                    {loading ? "Cambiando..." : "Cambiar contraseña"}
                </Button>
            </Box>
        </Box>
    );

}
