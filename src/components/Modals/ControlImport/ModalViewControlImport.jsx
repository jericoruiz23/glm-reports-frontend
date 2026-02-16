import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { sections, labels } from "../ControlImport/controlimportSections";
import toast from "react-hot-toast";
import ModalEditControlImport from "./ModalEditControlImport";

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ mt: 1 }}>{children}</Box> : null;
}

export default function ModalViewControlImport({ open, onClose, selected, onUpdated }) {
    const [tabIndex, setTabIndex] = useState(0);
    const [proceso, setProceso] = useState(selected || {});
    const [user, setUser] = useState(null); // user obtenido desde /me
    const [loadingUser, setLoadingUser] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);

    // 🔹 Mantener sincronizado cuando selected cambia
    useEffect(() => {
        setProceso(selected || {});
    }, [selected]);

    // 🔹 Fetch del usuario actual desde /me
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("No se pudo obtener el usuario");
                const data = await res.json();
                setUser(data.user || null);
            } catch (err) {
                console.error(err);
                toast.error("No se pudo obtener información del usuario");
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (_, newValue) => setTabIndex(newValue);

    const formatValue = (field, value) => {
        if (value === null || value === undefined || value === "") return "-";

        // ✅ SOLO fechas ISO reales
        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ) {
            const [datePart] = value.split("T"); // YYYY-MM-DD
            const [year, month, day] = datePart.split("-");
            return `${day}/${month}/${year}`;
        }

        // Booleanos
        if (typeof value === "boolean") return value ? "Sí" : "No";

        // Números
        if (typeof value === "number") return value.toString();

        // Strings normales (credito, contado, texto libre)
        return value;
    };

    const handleDeleteProcess = () => {
        toast((t) => (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    minWidth: "320px",
                    padding: "20px",
                    background: "white",
                    borderRadius: "10px",
                    textAlign: "center",
                }}
            >
                <span style={{ fontWeight: 600, fontSize: "17px" }}>¿Eliminar este proceso completo?</span>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    Esta acción es irreversible y eliminará todos los datos asociados.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    <button
                        onClick={async () => {
                            // 1. ⚡ ACCIÓN INSTANTÁNEA: Cerramos todo lo visual
                            toast.dismiss(t.id); // Quita el cuadro de confirmación
                            onClose();           // Cierra el Drawer inmediatamente

                            // 2. ⏳ PROCESO EN SEGUNDO PLANO: Lanzamos el loading
                            const loadingToast = toast.loading("Eliminando proceso...");

                            try {
                                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process/${selected?._id}`, {
                                    method: "DELETE",
                                    credentials: "include",
                                });

                                if (!res.ok) throw new Error("Error al eliminar");

                                // 3. ✅ ÉXITO: Recargamos la tabla del padre
                                if (onUpdated) await onUpdated();
                                toast.success("Proceso eliminado correctamente", { id: loadingToast });

                            } catch (err) {
                                console.error(err);
                                toast.error("No se pudo eliminar el proceso", { id: loadingToast });
                            }
                        }}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{
                            backgroundColor: "#F44336",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        No
                    </button>
                </div>
            </div>
        ), {
            position: "top-center",
            duration: Infinity
        });
    };
    const handleAnular = async () => {
        if (!window.confirm("¿Seguro que deseas anular este proceso?")) return;

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${proceso?._id}/anular`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!res.ok) throw new Error("Error al anular proceso");

            const data = await res.json();
            setProceso(data.proceso);
            toast.success("Proceso anulado correctamente");

            if (onUpdated) onUpdated(data.proceso);
        } catch (err) {
            console.error(err);
            toast.error("Error al anular el proceso");
        }
    };

    if (!proceso || Object.keys(proceso).length === 0) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "70%",
                    maxWidth: "1500px",
                    backdropFilter: "blur(15px)",
                    background: "white",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px",
                    overflowY: "auto",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                },
            }}
        >

            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5" fontWeight={700}>
                        Detalle Control de Importación
                    </Typography>
                    {proceso?.inicio?.codigoImportacion && (
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{
                                backgroundColor: "#f0f0f0",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: "0.9rem",
                            }}
                        >
                            {proceso?.inicio?.codigoImportacion}
                        </Typography>
                    )}
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    {/* Solo admin puede editar */}
                    {!loadingUser && user?.role === "admin" && !proceso?.anulado && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenEdit(true)}
                        >
                            Editar
                        </Button>
                    )}

                    {!loadingUser && user?.role === "admin" && !proceso?.anulado && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleAnular}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Anular
                        </Button>
                    )}

                    {!loadingUser && user?.role === "admin" && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteProcess}
                        >
                            Eliminar Proceso
                        </Button>
                    )}

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

            </Box>

            {/* Pestañas */}
            <Tabs
                value={tabIndex}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: "1px solid #ddd", mb: 2 }}
            >
                {sections.map((section) => (
                    <Tab key={section.key} label={section.title} />
                ))}
            </Tabs>

            {/* Paneles de cada sección */}
            {sections.map((section, idx) => {
                const data = proceso?.[section.key] || {};

                return (
                    <TabPanel key={section.key} value={tabIndex} index={idx}>
                        <Box display="flex" flexDirection="column">
                            {/* Campos de la sección */}
                            {Object.keys(data).length > 0 ? (
                                section.fields.map((field) => (
                                    <Box
                                        key={field}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            py: 0.7,
                                            px: 1,
                                            borderBottom: "1px solid #eee",
                                            alignItems: "center",
                                            transition: "background-color 0.2s",
                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                        }}
                                    >
                                        <Typography fontWeight={500}>{labels[field] || field}</Typography>
                                        <Typography color="text.secondary" sx={{ textAlign: "right" }}>
                                            {formatValue(field, data[field])}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                                    Sin información registrada
                                </Typography>
                            )}

                            {/* Campo adicional: Estado Anulado */}
                            {proceso?.anulado !== undefined && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        py: 0.7,
                                        px: 1,
                                        borderBottom: "1px solid #eee",
                                        alignItems: "center",
                                        backgroundColor: proceso.anulado ? "#ffe5e5" : "transparent",
                                    }}
                                >
                                    <Typography fontWeight={700}>Estado</Typography>
                                    <Typography
                                        color={proceso.anulado ? "error" : "text.secondary"}
                                        sx={{ textAlign: "right", fontWeight: 600 }}
                                    >
                                        {proceso.anulado ? "Anulado" : "Activo"}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </TabPanel>
                );
            })}
            <ModalEditControlImport
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                selected={proceso}
                onUpdated={(updated) => {
                    setProceso(updated);   // refresca el modalView
                    if (onUpdated) onUpdated(updated); // refresca lista padre
                }}
            />

        </Drawer>
    );
}
