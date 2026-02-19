import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { celdasExcel } from "./CommerceOptions";
import ModalEditCommerce from "./ModalEditCommerce";

export default function ModalViewCommerce({
    open,
    onClose,
    selected,
    onUpdated,
    onRefresh,
}) {
    const [openEdit, setOpenEdit] = useState(false);

    if (!selected) return null;

    const { registro, item } = selected;

    const fechaHeaders = [
        "FECHA SOLICITUD",
        "FECHA DE FACTURA",
        "ETD",
        "ETA TENTATIVO",
        "ETA REAL",
        "FECHA INGRESO BODEGA",
        "DELTA FECHA SOLICITUD VS ETD",
        "DELTA FECHA SOLICITUD VS CARGA",
        "LT FECHA CARGA HASTA INGRESO BODEGA ROUND TRIP",
    ];

    const formatValue = (field, value) => {
        if (value == null) return "-";

        if (fechaHeaders.includes(field)) {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "-";
            return date.toLocaleDateString("es-EC");
        }

        if (typeof value === "boolean") return value ? "Sí" : "No";
        return String(value);
    };

    const getValueByPath = (obj, path) =>
        path?.split(".").reduce((acc, key) => acc?.[key], obj);

    const getStatus = (registro) => {
        if (!registro) return "-";
        if (registro.anulado) return "anulado";
        if (registro.despacho?.fechaFacturacionCostos) return "historico";
        if (registro.despacho?.fechaRealDespachoPuerto) return "concluido";
        if (registro.postembarque?.fechaRealEmbarque) return "transito";
        if (registro.postembarque?.fechaRealLlegadaPuerto) return "aduana";
        return "por despachar origen";
    };

    const handleDeleteItem = () => {
        // Usamos el código del ítem que ya tienes extraído arriba
        const itemCodigo = item?.codigo;

        if (!itemCodigo) {
            toast.error("No se pudo identificar el código del ítem");
            return;
        }

        toast((t) => (
            <div style={{
                display: "flex", flexDirection: "column", gap: "1rem", minWidth: "300px",
                padding: "20px", borderRadius: "10px", textAlign: "center",
            }}>
                <span style={{ fontWeight: 600, fontSize: "16px" }}>¿Eliminar este ítem?</span>
                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Código: {itemCodigo}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadingToast = toast.loading("Eliminando ítem...");

                            try {
                                const res = await fetch(
                                    `${process.env.REACT_APP_API_URL}/api/process/${registro?._id}/items/${itemCodigo}`,
                                    {
                                        method: "DELETE",
                                        credentials: "include"
                                    }
                                );

                                if (!res.ok) throw new Error("Error en servidor");

                                const updatedProcess = await res.json();

                                // 1. Notificar al padre para que refresque la tabla principal
                                if (onUpdated) onUpdated(updatedProcess);
                                if (onRefresh) onRefresh();

                                // 2. Cerrar este modal (el ítem ya no existe)
                                onClose();

                                toast.success("Ítem eliminado", { id: loadingToast });
                            } catch (err) {
                                console.error(err);
                                toast.error("No se pudo eliminar el ítem", { id: loadingToast });
                            }
                        }}
                        style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                    > Sí </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{ backgroundColor: "#F44336", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                    > No </button>
                </div>
            </div>
        ), { position: "top-center" });
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "60%",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px",
                },
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5" fontWeight={700}>
                        Detalle Procesos Comerciales
                    </Typography>

                    {registro?.inicio?.codigoImportacion && (
                        <Typography
                            sx={{
                                backgroundColor: "#f0f0f0",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: "0.9rem",
                            }}
                        >
                            {registro.inicio.codigoImportacion}
                        </Typography>
                    )}
                </Box>

                <Box display="flex" gap={1}>
                    <Button variant="contained" onClick={() => setOpenEdit(true)}>
                        Editar
                    </Button>

                    <Button
                        color="error"
                        variant="outlined"
                        onClick={handleDeleteItem} // La función ya sabe qué item es por el scope de 'item'
                    >
                        Eliminar Item
                    </Button>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Data */}
            <Box>
                {celdasExcel.map(({ header, path }) => {
                    let value;

                    if (header.toLowerCase() === "status") {
                        value = getStatus(registro);
                    } else if (path?.startsWith("preembarque.items")) {
                        const key = path.replace("preembarque.items.", "");
                        value = item?.[key];
                    } else {
                        value = getValueByPath(registro, path);
                    }

                    return (
                        <Box
                            key={`${path || header}`}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                py: 1,
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {header}
                            </Typography>
                            <Typography fontWeight={500}>
                                {formatValue(header, value)}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <ModalEditCommerce
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                selected={selected}
                onUpdated={(updatedData) => {
                    setOpenEdit(false);
                    onClose();
                    if (onUpdated) onUpdated(updatedData);
                    onRefresh?.();
                    toast.success("Información actualizada");
                }}
            />

        </Drawer>
    );
}
