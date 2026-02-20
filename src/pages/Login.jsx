import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const providers = [{ id: "credentials", name: "Credenciales" }];

/* ======================
   CAMPOS PERSONALIZADOS
====================== */

function CustomEmailField() {
    return (
        <FormControl fullWidth variant="outlined" sx={{ my: 2 }}>
            <InputLabel htmlFor="email-input" size="small">
                Correo electrónico
            </InputLabel>

            <OutlinedInput
                id="email-input"
                name="email"
                type="email"
                size="small"
                label="Correo electrónico"
                endAdornment={
                    <InputAdornment position="end">
                        <AccountCircle fontSize="inherit" />
                    </InputAdornment>
                }
                sx={{
                    borderRadius: "15px",
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(8px)",
                }}
            />
        </FormControl>
    );
}




function CustomPasswordField() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl fullWidth variant="outlined" sx={{ my: 2 }}>
            <InputLabel htmlFor="password-input" size="small">Contraseña</InputLabel>
            <OutlinedInput
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                size="small"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <VisibilityOff fontSize="inherit" />
                            ) : (
                                <Visibility fontSize="inherit" />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
                label="Contraseña"
                sx={{
                    borderRadius: "15px",
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(8px)",
                }}
            />
        </FormControl>
    );
}

function CustomButton() {
    return (
        <Button
            type="submit"
            variant="contained"
            color="info"
            size="small"
            fullWidth
            sx={{ my: 2, borderRadius: "20px" }}
        >
            Iniciar sesión
        </Button>
    );
}


/* ======================
   LOGIN PRINCIPAL
====================== */

export default function Login() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login, user, initializing } = useAuth();
    const [loading, setLoading] = useState(false);

    // 🔒 Si ya está logueado → dashboard
    useEffect(() => {
        if (!initializing && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, initializing, navigate]);

    const BRANDING = {
        logo: (
            <img
                src="https://grupolopezmena.com/wp-content/uploads/2023/05/Logo-lopezmena-color.png"
                alt="Logo"
                style={{ height: 150 }}
            />
        ),
        title: "",
    };

    const handleSignIn = async (_provider, formData) => {
        if (loading) return;
        setLoading(true);

        try {
            const emailRaw = formData.get("email");
            const password = formData.get("password");

            if (!emailRaw || !password) {
                toast.error("Completa todos los campos");
                setLoading(false);
                return;
            }

            // 🔒 NORMALIZACIÓN
            const email = emailRaw.trim().toLowerCase();

            const res = await login(email, password);

            // La navegación la maneja el useEffect al detectar user en el contexto
            if (res.passwordMustChange) {
                navigate("/change-password", { replace: true });
            } else {
                toast.success(`¡Bienvenido ${res.user.name}!`);
            }

        } catch (err) {
            toast.error(err.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };


    const background = {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,245,0.95))",
    };

    return (
        <AppProvider branding={BRANDING} theme={theme}>
            <div style={background}>
                <SignInPage
                    signIn={handleSignIn}
                    providers={providers}
                    slots={{
                        emailField: CustomEmailField,
                        passwordField: CustomPasswordField,
                        submitButton: CustomButton,
                        signUpLink: () => null,
                        forgotPasswordLink: () => null,
                        subtitle: () => (
                            <span style={{ color: "#666", fontSize: 14 }}>
                                Ingresa tus credenciales para continuar
                            </span>
                        ),
                        title: () => (
                            <h2 style={{ margin: 0, fontWeight: 700 }}>
                                Iniciar sesión
                            </h2>
                        ),
                    }}
                    slotProps={{ form: { noValidate: true } }}
                />
            </div>
            <Toaster position="top-right" />
        </AppProvider>
    );
}
