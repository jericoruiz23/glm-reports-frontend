import { React, useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "../../assets/logout.svg";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { routesConfig, sidebarGroupsConfig } from "../../routes/routesConfig";

function joinPaths(basePath, childPath) {
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const normalizedChild = childPath.startsWith("/") ? childPath.slice(1) : childPath;
  return `${normalizedBase}/${normalizedChild}`;
}

function canAccessRoute(route, role) {
  return !route.allowedRoles?.length || route.allowedRoles.includes(role);
}

export default function Sidebar({ isOpen, mobileOpen, onExpand }) {
  const { user, initializing, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openProcesos, setOpenProcesos] = useState(false);

  const sidebarRoutes = useMemo(() => {
    const routes = [];

    routesConfig.forEach((route) => {
      if (route.showInSidebar) {
        routes.push(route);
      }

      (route.children || []).forEach((child) => {
        if (!child.showInSidebar) return;
        routes.push({
          ...child,
          path: joinPaths(route.path, child.path),
          allowedRoles: child.allowedRoles || route.allowedRoles,
        });
      });
    });

    return routes
      .filter((route) => canAccessRoute(route, user?.role))
      .sort((a, b) => (a.sidebarOrder || 999) - (b.sidebarOrder || 999));
  }, [user?.role]);

  const mainRoutes = sidebarRoutes.filter((route) => route.sidebarGroup === "main");
  const processRoutes = sidebarRoutes.filter((route) => route.sidebarGroup === "procesos");
  const bottomRoutes = sidebarRoutes.filter((route) => route.sidebarGroup === "bottom");
  const dashboardRoute = mainRoutes.find((route) => route.path === "/dashboard");
  const remainingMainRoutes = mainRoutes.filter((route) => route.path !== "/dashboard");

  const rutasProcesos = processRoutes.map((route) => route.path);
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

  const toggleProcesos = () => {
    if (!isOpen && onExpand) {
      onExpand();
      setOpenProcesos(true);
      return;
    }

    setOpenProcesos((prev) => !prev);
  };

  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"} ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        {dashboardRoute && (
          <NavLink key={dashboardRoute.path} to={dashboardRoute.path}>
            <img src={dashboardRoute.sidebarIcon} alt={dashboardRoute.sidebarLabel} className="sidebar-icon" />
            {isOpen && <span>{dashboardRoute.sidebarLabel}</span>}
          </NavLink>
        )}


        {processRoutes.length > 0 && (
          <div className="admin-item">
            <div
              className="admin-link"
              onClick={toggleProcesos}
              style={{
                cursor: "pointer",
                background: openProcesos || isProcesoActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                fontWeight: openProcesos || isProcesoActive ? "600" : "500",
              }}
            >
              <img
                src={sidebarGroupsConfig.procesos.icon}
                alt={sidebarGroupsConfig.procesos.label}
                className="sidebar-icon"
              />
              {isOpen && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <span>{sidebarGroupsConfig.procesos.label}</span>
                </div>
              )}
            </div>

            {openProcesos && isOpen && (
              <div className="submenu" style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                {processRoutes.map((route) => (
                  <NavLink key={route.path} to={route.path}>
                    <img src={route.sidebarIcon} alt={route.sidebarLabel} className="sidebar-icon" />
                    <span>{route.sidebarLabel}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {remainingMainRoutes.map((route) => (
          <NavLink key={route.path} to={route.path}>
            <img src={route.sidebarIcon} alt={route.sidebarLabel} className="sidebar-icon" />
            {isOpen && <span>{route.sidebarLabel}</span>}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-bottom">
        {bottomRoutes.length > 0 && (
          <div>
            {bottomRoutes.map((route) => (
              <NavLink key={route.path} to={route.path}>
                <img src={route.sidebarIcon} alt={route.sidebarLabel} className="sidebar-icon" />
                {isOpen && <span>{route.sidebarLabel}</span>}
              </NavLink>
            ))}
          </div>
        )}

        <button onClick={handleLogout} className="sidebar-item logout-link" type="button">
          <img src={LogoutIcon} alt="Cerrar sesiÃ³n" className="sidebar-icon" />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
