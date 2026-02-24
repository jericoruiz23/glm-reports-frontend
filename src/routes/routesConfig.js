import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Manage/Manage";
import ManageUsers from "../pages/Manage/ManageUsers";
import ManageShipping from "../pages/Manage/ManagePreshipping";
import ManageIProcess from "../pages/Manage/InitialProcess/ManageIProcess";
import ManagePostShipping from "../pages/Manage/PostShipping/ManagePostShipping";
import ManageCustoms from "../pages/Manage/Customs/ManageCustoms";
import ManageDispatch from "../pages/Manage/Dispatch/ManageDispatch";
import ManageControlImport from "../pages/Manage/ManageControlImport";
import ManageCommerce from "../pages/Manage/Commerce/ManageCommerce";
import ManageReports from "../pages/Manage/Reports/ManageReports";
import ChangePassword from "../pages/ChangePassword";
import ManageCatalog from "../pages/Manage/Catalog/ManageCatalog";
import ManageTimes from "../pages/Manage/Times/ManageTimes";

import HomeIcon from "../assets/home.svg";
import ReportsIcon from "../assets/reports.svg";
import ReportsAltIcon from "../assets/reports1.svg";
import DispatchIcon from "../assets/dispatch.svg";
import BoxIcon from "../assets/box.svg";
import TransitIcon from "../assets/transit.svg";
import PostshippingIcon from "../assets/postshipping.svg";
import GovernmentIcon from "../assets/government.svg";
import UserIcon from "../assets/user.svg";

export const sidebarGroupsConfig = {
  procesos: {
    label: "Procesos",
    icon: BoxIcon,
  },
};

export const routesConfig = [
  {
    path: "/login",
    component: Login,
    isPublic: true,
  },
  {
    path: "/change-password",
    component: ChangePassword,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    showInSidebar: true,
    sidebarGroup: "main",
    sidebarOrder: 1,
    sidebarLabel: "Dashboard",
    sidebarIcon: HomeIcon,
  },
  {
    path: "/admin",
    component: Admin,
    allowedRoles: ["admin"],
    children: [
      {
        path: "usuario",
        component: ManageUsers,
        showInSidebar: true,
        sidebarGroup: "bottom",
        sidebarOrder: 2,
        sidebarLabel: "Usuarios",
        sidebarIcon: UserIcon,
      },
    ],
  },
  {
    path: "/inicioproceso",
    component: ManageIProcess,
    allowedRoles: ["admin"],
    showInSidebar: true,
    sidebarGroup: "procesos",
    sidebarOrder: 1,
    sidebarLabel: "Iniciar Proceso",
    sidebarIcon: BoxIcon,
  },
  {
    path: "/preembarque",
    component: ManageShipping,
    allowedRoles: ["admin"],
    showInSidebar: true,
    sidebarGroup: "procesos",
    sidebarOrder: 2,
    sidebarLabel: "Preembarque",
    sidebarIcon: TransitIcon,
  },
  {
    path: "/postembarque",
    component: ManagePostShipping,
    allowedRoles: ["admin"],
    showInSidebar: true,
    sidebarGroup: "procesos",
    sidebarOrder: 3,
    sidebarLabel: "Postembarque",
    sidebarIcon: PostshippingIcon,
  },
  {
    path: "/aduana",
    component: ManageCustoms,
    allowedRoles: ["admin"],
    showInSidebar: true,
    sidebarGroup: "procesos",
    sidebarOrder: 4,
    sidebarLabel: "Aduana",
    sidebarIcon: GovernmentIcon,
  },
  {
    path: "/despacho",
    component: ManageDispatch,
    allowedRoles: ["admin"],
    showInSidebar: true,
    sidebarGroup: "procesos",
    sidebarOrder: 5,
    sidebarLabel: "Despacho",
    sidebarIcon: DispatchIcon,
  },
  {
    path: "/controlimport",
    component: ManageControlImport,
    showInSidebar: true,
    sidebarGroup: "main",
    sidebarOrder: 2,
    sidebarLabel: "Control Import",
    sidebarIcon: ReportsIcon,
  },
  {
    path: "/comercial",
    component: ManageCommerce,
    showInSidebar: true,
    sidebarGroup: "main",
    sidebarOrder: 3,
    sidebarLabel: "Comercial",
    sidebarIcon: ReportsIcon,
  },
  {
    path: "/reportes",
    component: ManageReports,
    showInSidebar: true,
    sidebarGroup: "main",
    sidebarOrder: 5,
    sidebarLabel: "Reportes",
    sidebarIcon: ReportsAltIcon,
  },
  {
    path: "/catalogos",
    component: ManageCatalog,
    allowedRoles: ["admin"],
    showInSidebar: true,
    sidebarGroup: "bottom",
    sidebarOrder: 1,
    sidebarLabel: "Catalogos",
    sidebarIcon: ReportsIcon,
  },
  {
    path: "/tiempos",
    component: ManageTimes,
    showInSidebar: true,
    sidebarGroup: "main",
    sidebarOrder: 4,
    sidebarLabel: "Tiempos",
    sidebarIcon: DispatchIcon,
  },
];
