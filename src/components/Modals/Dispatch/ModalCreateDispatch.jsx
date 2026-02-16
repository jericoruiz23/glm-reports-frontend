// src/pages/manage/dispatch/ModalCreateDispatch.jsx
import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";


const initialForm = {
    processId: "",

    fechaFacturacionCostos: null,
    numeroContainer: "",
    peso: "",
    bultos: "",
    tipoContenedor: "",

    fechaEstDespachoPuerto: null,
    fechaRealDespachoPuerto: null,
    fechaEstEntregaBodega: null,
    fechaRealEntregaBodega: null,

    diasLibres: "",
    confirmadoNaviera: "",
    fechaCas: null,
    fechaEntregaContenedorVacio: null,

    almacenaje: "",
    demorraje: "",
    observaciones: "",
    fechaRegistroPesos: null,
};




export default function ModalCreateDispatch({
    open,
    onClose,
    onSuccess,
    processes = [],
}) {
    const [form, setForm] = useState(initialForm);

    const handleDateChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (open) setForm(initialForm);
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const procesosDespacho = processes.filter(
        (p) => p.currentStage === "aduana"
    );
    const toISOorNull = (value) =>
        value ? new Date(value).toISOString() : null;


    const handleSubmit = async () => {
        if (!form.processId) {
            toast.error("Seleccione un código de importación");
            return;
        }

        try {
            const { processId, ...d } = form;

            const payload = {
                numeroContainer: d.numeroContainer,
                tipoContenedor: d.tipoContenedor,
                observaciones: d.observaciones,

                peso: Number(d.peso || 0),
                bultos: Number(d.bultos || 0),
                diasLibres: Number(d.diasLibres || 0),
                almacenaje: Number(d.almacenaje || 0),
                demorraje: Number(d.demorraje || 0),
                confirmadoNaviera: Number(d.confirmadoNaviera || 0),

                fechaFacturacionCostos: toISOorNull(d.fechaFacturacionCostos),
                fechaEstDespachoPuerto: toISOorNull(d.fechaEstDespachoPuerto),
                fechaRealDespachoPuerto: toISOorNull(d.fechaRealDespachoPuerto),
                fechaEstEntregaBodega: toISOorNull(d.fechaEstEntregaBodega),
                fechaRealEntregaBodega: toISOorNull(d.fechaRealEntregaBodega),
                fechaCas: toISOorNull(d.fechaCas),
                fechaEntregaContenedorVacio: toISOorNull(d.fechaEntregaContenedorVacio),
                fechaRegistroPesos: toISOorNull(d.fechaRegistroPesos),
            };

            console.log("🟢 Dispatch payload VALIDADO:", payload);

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${processId}/despacho`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar Despacho");

            const actualizado = await res.json();

            toast.success("Despacho registrado correctamente");
            onSuccess(actualizado);
            onClose();
        } catch (err) {
            console.error("❌ Error despacho", err);
            toast.error("Error al registrar Despacho");
        }
    };







    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
        >
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: "100%",
                        maxWidth: 720,
                        p: 3,
                        borderRadius: "20px 0 0 20px",
                    },
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={600}>
                        Registrar Despacho
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box mt={3}>
                    {/* Código */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Código Importación</InputLabel>
                        <Select
                            name="processId"
                            value={form.processId}
                            label="Código Importación"
                            onChange={handleChange}
                        >
                            {procesosDespacho.map((p) => (
                                <MenuItem key={p._id} value={p._id}>
                                    {p.inicio?.codigoImportacion || p._id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Divider sx={{ my: 3 }} />

                    {/* Contenedor */}
                    <Typography variant="h6">Contenedor</Typography>
                    <Stack spacing={2} mt={2}>
                        <TextField label="Número de Container" name="numeroContainer" value={form.numeroContainer} onChange={handleChange} />
                        <TextField label="Tipo de Contenedor" name="tipoContenedor" value={form.tipoContenedor} onChange={handleChange} />
                        <TextField type="number" label="Peso" name="peso" value={form.peso} onChange={handleChange} />
                        <DatePicker
                            label="Fecha Registro Pesos"
                            value={form.fechaRegistroPesos}
                            onChange={(v) => handleDateChange("fechaRegistroPesos", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <TextField type="number" label="Bultos" name="bultos" value={form.bultos} onChange={handleChange} />
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    {/* Fechas */}
                    <Typography variant="h6">Fechas</Typography>
                    <Stack spacing={2} mt={2}>
                        <DatePicker
                            label="Facturación Costos"
                            value={form.fechaFacturacionCostos}
                            onChange={(v) => handleDateChange("fechaFacturacionCostos", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="Est. Despacho Puerto"
                            value={form.fechaEstDespachoPuerto}
                            onChange={(v) => handleDateChange("fechaEstDespachoPuerto", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="Real Despacho Puerto"
                            value={form.fechaRealDespachoPuerto}
                            onChange={(v) => handleDateChange("fechaRealDespachoPuerto", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="Est. Entrega Bodega"
                            value={form.fechaEstEntregaBodega}
                            onChange={(v) => handleDateChange("fechaEstEntregaBodega", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="Real Entrega Bodega"
                            value={form.fechaRealEntregaBodega}
                            onChange={(v) => handleDateChange("fechaRealEntregaBodega", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    {/* Costos y otros */}
                    <Typography variant="h6">Costos y Otros</Typography>
                    <Stack spacing={2} mt={2}>
                        <TextField type="number" label="Días Libres" name="diasLibres" value={form.diasLibres} onChange={handleChange} />
                        <TextField type="number" label="Almacenaje" name="almacenaje" value={form.almacenaje} onChange={handleChange} />
                        <TextField type="number" label="Demoraje" name="demorraje" value={form.demorraje} onChange={handleChange} />
                        <TextField type="number" label="Confirmado Naviera" name="confirmadoNaviera" value={form.confirmadoNaviera} onChange={handleChange} inputProps={{ min: 0, max: 1 }}
                        />

                        <DatePicker
                            label="Fecha CAS"
                            value={form.fechaCas}
                            onChange={(v) => handleDateChange("fechaCas", v)}
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="Entrega Contenedor Vacío"
                            value={form.fechaEntregaContenedorVacio}
                            onChange={(v) =>
                                handleDateChange("fechaEntregaContenedorVacio", v)
                            }
                            format="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <TextField multiline rows={3} label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} />
                    </Stack>

                    <Box mt={4} textAlign="right">
                        <Button variant="contained" size="large" onClick={handleSubmit}>
                            Guardar Despacho
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
}
