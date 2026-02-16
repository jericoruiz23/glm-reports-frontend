import React from "react";
import logo from "../../components/Dashboard/Logo-GLP-color-opt-recor.png";
import { useAuth } from "../../context/AuthContext";

export default function Header({ toggleSidebar }) {
    const { user, initializing } = useAuth();

    if (initializing) return null; // o skeleton


    const roleLabel =
        user?.role === "admin" ? "Administrador" : "Visualización";

    const avatarBg =
        user?.role === "admin" ? "#1d4ed8" : "#64748b";

    const initial =
        user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <header className="header">
            {/* IZQUIERDA */}
            <div className="left">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    ☰
                </button>

                <img
                    src={logo}
                    alt="Grupo López Mena"
                    className="header-logo"
                />
            </div>

            {/* PERFIL */}
            <div className="profile">
                <div className="profile-text">
                    <span className="profile-name">
                        {user?.name || "Usuario"}
                    </span>
                    <span className="profile-role">{roleLabel}</span>
                </div>

                <div
                    className="profile-avatar"
                    style={{ backgroundColor: avatarBg }}
                >
                    {initial}
                </div>
            </div>
        </header>
    );
}
