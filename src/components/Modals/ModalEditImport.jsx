// src/components/Modals/EditImportDrawer.jsx
import React, { useEffect, useState } from "react";
import {
    Drawer, Box, Typography, IconButton, TextField, Stack, Button,
    MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import api from "../../services/api";

function getISOWeek(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function formatDateForInput(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

export default function EditImportDrawer({ open, onClose, data, loading, onUpdated }) {
    const [form, setForm] = useState(null);
    const [options, setOptions] = useState({
        forwarders: [],
        mot: [],
        importTypes: [],
        importCategories: [],
        years: []
    });

    // Cargar opciones dinámicas desde backend
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const data = await api.get("/api/imports/options");
                setOptions({
                    forwarders: data.forwarders || [],
                    mot: data.mot || [],
                    importTypes: data.importTypes || [],
                    importCategories: data.importCategories || [],
                    years: data.years || []
                });
            } catch (err) {
                console.error("Error cargando opciones:", err);
                toast.error("No se pudieron cargar las opciones");
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        if (data) {
            setForm({
                ...data,
                weeksBilling: data.facturaDate ? getISOWeek(data.facturaDate) : "",
                etdWeek: data.etd ? getISOWeek(data.etd) : "",
                etaWeek: data.etaReal
                    ? getISOWeek(data.etaReal)
                    : (data.etaTentative ? getISOWeek(data.etaTentative) : ""),
                solicitudDate: formatDateForInput(data.solicitudDate),
                facturaDate: formatDateForInput(data.facturaDate),
                etd: formatDateForInput(data.etd),
                etaTentative: formatDateForInput(data.etaTentative),
                etaReal: formatDateForInput(data.etaReal),
                ingWHS: formatDateForInput(data.ingWHS)
            });
        }
    }, [data]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        try {
            const updated = await api.put(`/api/imports/${form._id}`, form);
            onUpdated(updated);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar");
        }
    };

    if (loading || !form) return <div style={{ padding: "2rem" }}></div>;

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
                    background: "rgba(255,255,255,1)",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px",
                }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    Editar Importación — {form.importCode}
                </Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </Box>

            <Box mt={3}>

                {/* Información General */}
                <Typography variant="h6" mt={2} mb={2}>Información General</Typography>

                <Stack spacing={2} direction="row">
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select name="status" label="Status" value={form.status} onChange={handleChange}>
                            <MenuItem value="Concluido">Concluido</MenuItem>
                            <MenuItem value="Tránsito">Tránsito</MenuItem>
                            <MenuItem value="Por despachar origen">Por despachar origen</MenuItem>
                            <MenuItem value="Transito origen">Tránsito origen</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Origen</InputLabel>
                        <Select name="origin" label="Origen" value={form.origin} onChange={handleChange}>
                            {["China", "Ecuador", "EEUU", "México", "Colombia", "Brasil", "Chile",
                                "Perú", "Panamá", "España", "Italia", "Alemania", "India", "Vietnam",
                                "Tailandia", "Indonesia"].map((p, i) => (
                                    <MenuItem key={i} value={p}>{p}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Destino</InputLabel>
                        <Select name="destination" label="Destino" value={form.destination} onChange={handleChange}>
                            {["Ecuador", "Colombia", "Perú", "Chile", "Brasil", "México",
                                "Panamá", "Costa Rica", "Guatemala", "EEUU"].map((p, i) => (
                                    <MenuItem key={i} value={p}>{p}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Stack>

                {/* Cantidades */}
                <Typography variant="h6" mt={4} mb={2}>Cantidades</Typography>
                <Stack spacing={2} direction="row">
                    <TextField fullWidth type="number" label="Quintales solicitados" name="quintalesRequested" value={form.quintalesRequested} onChange={handleChange} inputProps={{ step: "0.01" }} />
                    <TextField fullWidth label="N° Cajas solicitadas" name="cajasRequested" value={form.cajasRequested} onChange={handleChange} />
                    <TextField fullWidth type="number" label="Quintales despachados" name="quintalesSent" value={form.quintalesSent} onChange={handleChange} inputProps={{ step: "0.01" }} />
                    <TextField fullWidth label="N° Cajas despachadas" name="cajasSent" value={form.cajasSent} onChange={handleChange} />
                </Stack>

                {/* Descripción */}
                <Typography variant="h6" mt={4} mb={2}>Descripción</Typography>
                <TextField fullWidth multiline minRows={3} label="Descripción" name="description" value={form.description} onChange={handleChange} />

                {/* Logística */}
                <Typography variant="h6" mt={4} mb={2}>Logística</Typography>
                <Stack spacing={2} direction="row">
                    <FormControl fullWidth>
                        <InputLabel>Forwarder</InputLabel>
                        <Select name="forwarder" label="Forwarder" value={form.forwarder} onChange={handleChange}>
                            {options.forwarders.map(f => (
                                <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>MOT</InputLabel>
                        <Select name="mot" value={form.mot} label="MOT" onChange={handleChange}>
                            {options.mot.map(f => (
                                <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField fullWidth label="Contenedor" name="container" value={form.container} onChange={handleChange} />
                </Stack>

                {/* Documentos */}
                <Typography variant="h6" mt={4} mb={2}>Documentos</Typography>
                <Stack spacing={2}>
                    <TextField label="N° Factura" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} />
                    <TextField label="N° Orden de compra" name="purchaseOrder" value={form.purchaseOrder} onChange={handleChange} />
                </Stack>

                {/* Fechas */}
                <Typography variant="h6" mt={4} mb={2}>Fechas</Typography>
                <Stack spacing={2} direction="row">
                    <TextField type="date" fullWidth label="Fecha de solicitud" name="solicitudDate" InputLabelProps={{ shrink: true }} value={form.solicitudDate} onChange={handleChange} />
                    <TextField type="date" fullWidth label="Fecha de factura" name="facturaDate" InputLabelProps={{ shrink: true }} value={form.facturaDate} onChange={handleChange} />
                </Stack>

                <Stack spacing={2} direction="row" mt={2}>
                    <TextField type="date" fullWidth label="ETD" name="etd" InputLabelProps={{ shrink: true }} value={form.etd} onChange={handleChange} />
                    <TextField type="date" fullWidth label="ETA Tentativo" name="etaTentative" InputLabelProps={{ shrink: true }} value={form.etaTentative} onChange={handleChange} />
                    <TextField type="date" fullWidth label="ETA Real" name="etaReal" InputLabelProps={{ shrink: true }} value={form.etaReal} onChange={handleChange} />
                </Stack>

                <Stack spacing={2} direction="row" mt={2}>
                    <TextField fullWidth disabled label="Weeks facturación (auto)" name="weeksBilling" value={form.weeksBilling} />
                    <TextField fullWidth disabled label="Week ETD (auto)" name="etdWeek" value={form.etdWeek} />
                    <TextField fullWidth disabled label="Week ETA Puerto (auto)" name="etaWeek" value={form.etaWeek} />
                </Stack>

                {/* Otros */}
                <Typography variant="h6" mt={4} mb={2}>Otros</Typography>
                <Stack spacing={2} direction="row">
                    <TextField type="date" fullWidth label="Fecha de ingreso bodega" name="ingWHS" InputLabelProps={{ shrink: true }} value={form.ingWHS} onChange={handleChange} />
                    <TextField fullWidth label="Transit time port to port (days)" name="transitTime" value={form.transitTime} onChange={handleChange} />
                    <TextField fullWidth label="LT hasta almacén" name="ltWarehouse" value={form.ltWarehouse} onChange={handleChange} />
                </Stack>

                {/* Observaciones */}
                <Typography variant="h6" mt={4} mb={2}>Observaciones</Typography>
                <TextField fullWidth multiline minRows={3} label="Observaciones" name="notes" value={form.notes} onChange={handleChange} />

                {/* Botón inferior */}
                <Box mt={5} textAlign="right">
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ borderRadius: "12px", px: 4 }}
                        onClick={handleSave}
                    >
                        Guardar cambios
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
