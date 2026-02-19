import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../../components/Dashboard/Layout";

export default function Admin() {
    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1>Administración</h1>
                </div>

                {/* Submenú de administración
                <div className="admin-submenu">
                    <NavLink
                        to="usuario"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Usuarios
                    </NavLink>
                    <NavLink
                        to="proveedor"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Proveedores
                    </NavLink>
                </div> */}

                {/* Aquí se renderizan los componentes hijos */}
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </Layout>
    );
}
