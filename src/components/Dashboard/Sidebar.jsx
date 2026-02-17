import { React, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Home from "../../assets/home.svg";
import LogoutIcon from "../../assets/logout.svg";
import Reports from "../../assets/reports.svg";
import Transit from "../../assets/transit.svg";
import Government from "../../assets/government.svg";
import Box from "../../assets/box.svg";
import Reports1 from "../../assets/reports1.svg";
import Dispatch from "../../assets/dispatch.svg";
import Postshiping from "../../assets/postshipping.svg";
import UserIcon from "../../assets/user.svg";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ isOpen, mobileOpen }) {
    const { user, initializing, logout } = useAuth();
    const navigate = useNavigate();


    const location = useLocation();
    const [openProcesos, setOpenProcesos] = useState(false);
    const rutasProcesos = ["/inicioproceso", "/preembarque", "/postembarque", "/aduana", "/despacho"];
    const isProcesoActive = rutasProcesos.includes(location.pathname);
    if (initializing || !user) return null;

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch {
            toast.error("Error al cerrar sesión");
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? "" : "collapsed"} ${mobileOpen ? "open" : ""}`}>
            <div className="sidebar-content">
                <NavLink to="/dashboard">
                    <img src={Home} alt="Dashboard" className="sidebar-icon" />
                    {isOpen && <span>Dashboard</span>}
                </NavLink>

                {user.role === "admin" && (
                    <div className="admin-item">
                        {/* DISPARADOR CON ESTILO DINÁMICO */}
                        <div
                            className="admin-link"
                            onClick={() => setOpenProcesos(!openProcesos)}
                            style={{
                                cursor: "pointer",
                                background: (openProcesos || isProcesoActive) ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                fontWeight: (openProcesos || isProcesoActive) ? "600" : "500"
                            }}
                        >
                            <img src={Box} alt="Procesos" className="sidebar-icon" />
                            {isOpen && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                    <span>Procesos</span>
                                </div>
                            )}
                        </div>

                        {/* SUBMENÚ */}
                        {openProcesos && isOpen && (
                            <div className="submenu" style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
                                <NavLink to="/inicioproceso">
                                    <img src={Box} alt="Iniciar" className="sidebar-icon" />
                                    <span>Iniciar Proceso</span>
                                </NavLink>
                                <NavLink to="/preembarque">
                                    <img src={Transit} alt="Preembarque" className="sidebar-icon" />
                                    <span>Preembarque</span>
                                </NavLink>
                                <NavLink to="/postembarque">
                                    <img src={Postshiping} alt="Postembarque" className="sidebar-icon" />
                                    <span>Postembarque</span>
                                </NavLink>
                                <NavLink to="/aduana">
                                    <img src={Government} alt="Aduana" className="sidebar-icon" />
                                    <span>Aduana</span>
                                </NavLink>
                                <NavLink to="/despacho">
                                    <img src={Dispatch} alt="Despacho" className="sidebar-icon" />
                                    <span>Despachos</span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                )}

                {/* Resto de links (Control Import, Comercial, etc.) */}
                <NavLink to="/controlimport">
                    <img src={Reports} alt="Control Import" className="sidebar-icon" />
                    {isOpen && <span>Control Import</span>}
                </NavLink>

                <NavLink to="/comercial">
                    <img src={Reports} alt="Comercial" className="sidebar-icon" />
                    {isOpen && <span>Comercial</span>}
                </NavLink>

                <NavLink to="/tiempos">
                    <img src={Dispatch} alt="Tiempos" className="sidebar-icon" />
                    {isOpen && <span>Tiempos</span>}
                </NavLink>

                <NavLink to="/reportes">
                    <img src={Reports1} alt="Reportes" className="sidebar-icon" />
                    {isOpen && <span>Reportes</span>}
                </NavLink>
            </div>

            {/* Sección inferior y Logout se mantienen igual... */}
            <div className="sidebar-bottom">
                {user.role === "admin" && (
                    <div>
                        <NavLink to="/catalogos">
                            <img src={Reports} alt="Catalogos" className="sidebar-icon" />
                            {isOpen && <span>Catálogos</span>}
                        </NavLink>
                        <NavLink to="/admin/usuario">
                            <img src={UserIcon} alt="Usuarios" className="sidebar-icon" />
                            {isOpen && <span>Usuarios</span>}
                        </NavLink>
                    </div>
                )}
                <button onClick={handleLogout} className="sidebar-item logout-link" type="button">
                    <img src={LogoutIcon} alt="Cerrar sesión" className="sidebar-icon" />
                    {isOpen && <span>Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
}
