import React, { useState, useEffect } from "react";
import { Drawer, Tabs, Tab, Box, Button, TextField } from "@mui/material";
import toast from "react-hot-toast";

// Helper para formatear fechas
const formatDate = (d) => (d ? d.substring(0, 10) : "");
const formatDateTime = (d) => (d ? d.substring(0, 16) : "");

export default function EditPreshipmentDrawer({ open, onClose, data, onUpdated }) {
    const [tab, setTab] = useState(0);

    const [form, setForm] = useState({});

    // Al abrir drawer, clonar data
    useEffect(() => {
        if (data) {
            setForm({
                ...data,
                requestDate: formatDate(data.requestDate),
                invoiceDate: formatDate(data.invoiceDate),
                etd: formatDateTime(data.etd),
                etaTentative: formatDateTime(data.etaTentative),
                etaReal: formatDateTime(data.etaReal),
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Detectar números
        const numericFields = [
            "requestedQuintals", "requestedBoxes",
            "dispatchedQuintals", "dispatchedBoxes",
            "billingWeeks", "etdWeek", "portEtaWeek",
            "portToPortTransitTime", "leadTimeToWarehouse"
        ];

        setForm({
            ...form,
            [name]: numericFields.includes(name) ? Number(value) : value
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            // Mapear nombres del frontend ➜ backend
            const payload = {
                status: form.status,
                origin: form.origin,
                destination: form.destination,
                code: form.code,
                description: form.description,

                quintalsRequested: form.requestedQuintals,
                boxesRequested: form.requestedBoxes,
                quintalsDispatched: form.dispatchedQuintals,
                boxesDispatched: form.dispatchedBoxes,

                forwarder: form.forwarder,
                mot: form.mot,
                container: form.container,

                invoiceNumber: form.invoiceNumber,
                purchaseOrderNumber: form.purchaseOrderNumber,

                requestDate: form.requestDate,
                invoiceDate: form.invoiceDate,

                billingWeeks: form.billingWeeks,

                etd: form.etd,
                etdWeek: form.etdWeek,

                etaTentative: form.etaTentative,
                etaReal: form.etaReal,
                etaPortWeek: form.portEtaWeek,

                ingWhs: form.warehouseEngineer,
                transitTimePortToPort: form.portToPortTransitTime,
                ltToWarehouse: form.leadTimeToWarehouse,

                observations: form.notes,
                importCode: form.importCode,
            };

            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_IP_PORT}/api/preshipments/${data._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar preembarque");

            const updated = await res.json();

            toast.success("Pre-embarque actualizado");
            onUpdated(updated);
            onClose();

        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar");
        }
    };


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "100%",
                    maxWidth: "900px",
                    backdropFilter: "blur(15px)",
                    background: "white",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px"
                }
            }}
        >
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                <Tab label="Datos Principales" />
                <Tab label="Cantidades" />
                <Tab label="Fechas" />
                <Tab label="Logística" />
                <Tab label="Tiempos" />
                <Tab label="Notas" />
            </Tabs>

            {/* DATOS PRINCIPALES */}
            <Box hidden={tab !== 0} sx={{ mt: 2 }}>
                <TextField fullWidth name="status" label="Status" value={form.status || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="origin" label="Origen" value={form.origin || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="destination" label="Destino" value={form.destination || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="code" label="Código" value={form.code || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="description" label="Descripción" value={form.description || ""} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* CANTIDADES */}
            <Box hidden={tab !== 1} sx={{ mt: 2 }}>
                <TextField fullWidth name="requestedQuintals" label="Quintales Solicitados" type="number" value={form.requestedQuintals || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="requestedBoxes" label="Cajas Solicitadas" type="number" value={form.requestedBoxes || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="dispatchedQuintals" label="Quintales Despachados" type="number" value={form.dispatchedQuintals || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="dispatchedBoxes" label="Cajas Despachadas" type="number" value={form.dispatchedBoxes || ""} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* FECHAS */}
            <Box hidden={tab !== 2} sx={{ mt: 2 }}>
                <TextField fullWidth type="date" name="requestDate" label="Fecha de Solicitud"
                    InputLabelProps={{ shrink: true }} value={form.requestDate || ""} onChange={handleChange} sx={{ mb: 2 }} />

                <TextField fullWidth type="date" name="invoiceDate" label="Fecha de Factura"
                    InputLabelProps={{ shrink: true }} value={form.invoiceDate || ""} onChange={handleChange} sx={{ mb: 2 }} />

                <TextField fullWidth type="datetime-local" name="etd" label="ETD"
                    InputLabelProps={{ shrink: true }} value={form.etd || ""} onChange={handleChange} sx={{ mb: 2 }} />

                <TextField fullWidth type="datetime-local" name="etaTentative" label="ETA Tentativo"
                    InputLabelProps={{ shrink: true }} value={form.etaTentative || ""} onChange={handleChange} sx={{ mb: 2 }} />

                <TextField fullWidth type="datetime-local" name="etaReal" label="ETA Real"
                    InputLabelProps={{ shrink: true }} value={form.etaReal || ""} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* LOGÍSTICA */}
            <Box hidden={tab !== 3} sx={{ mt: 2 }}>
                <TextField fullWidth name="forwarder" label="Forwarder" value={form.forwarder || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="mot" label="MOT" value={form.mot || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="container" label="Contenedor" value={form.container || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="invoiceNumber" label="Factura" value={form.invoiceNumber || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="purchaseOrderNumber" label="Orden de Compra" value={form.purchaseOrderNumber || ""} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* TIEMPOS */}
            <Box hidden={tab !== 4} sx={{ mt: 2 }}>
                <TextField fullWidth name="billingWeeks" label="Semanas de Facturación" type="number" value={form.billingWeeks || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="etdWeek" label="Semana ETD" type="number" value={form.etdWeek || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="portEtaWeek" label="Semana ETA Puerto" type="number" value={form.portEtaWeek || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="portToPortTransitTime" label="TT Puerto-Puerto" type="number" value={form.portToPortTransitTime || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="leadTimeToWarehouse" label="Lead Time a Bodega" type="number" value={form.leadTimeToWarehouse || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="warehouseEngineer" label="Ingeniero de Bodega" value={form.warehouseEngineer || ""} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* NOTAS */}
            <Box hidden={tab !== 5} sx={{ mt: 2 }}>
                <TextField fullWidth multiline minRows={4} name="notes" label="Notas" value={form.notes || ""} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth name="importCode" label="Código de Importación" value={form.importCode || ""} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button onClick={onClose} color="error" sx={{ mr: 2 }}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave}>
                    Guardar
                </Button>
            </Box>
        </Drawer>
    );
}
