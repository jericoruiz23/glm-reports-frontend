import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
    InputAdornment,
    Link,
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
        <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            size="small"
            required
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AccountCircle fontSize="inherit" />
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: "15px",
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(8px)",
                },
            }}
            variant="outlined"
            sx={{ mb: 2 }}
        />
    );
}

function CustomPasswordField() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl fullWidth variant="outlined" sx={{ my: 2 }}>
            <InputLabel size="small">Contraseña</InputLabel>
            <OutlinedInput
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

function SignUpLink() {
    return (
        <Link href="/" variant="body2">
            Registrarse
        </Link>
    );
}

function ForgotPasswordLink() {
    return (
        <Link href="/" variant="body2">
            ¿Olvidaste tu contraseña?
        </Link>
    );
}

/* ======================
   LOGIN PRINCIPAL
====================== */

export default function Login() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login, user, initializing } = useAuth();

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
        try {
            const emailRaw = formData.get("email");
            const password = formData.get("password");

            if (!emailRaw || !password) {
                toast.error("Completa todos los campos");
                return;
            }

            // 🔒 NORMALIZACIÓN
            const email = emailRaw.trim().toLowerCase();

            const res = await login(email, password);

            if (res.mustChangePassword) {
                navigate("/change-password");
                return;
            }

            toast.success(`¡Bienvenido ${res.user.name}!`);
            navigate("/dashboard");

        } catch (err) {
            toast.error(err.message || "Credenciales incorrectas");
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
                        signUpLink: SignUpLink,
                        // forgotPasswordLink: ForgotPasswordLink,
                    }}
                    slotProps={{ form: { noValidate: true } }}
                />
            </div>
            <Toaster position="top-right" />
        </AppProvider>
    );
}
