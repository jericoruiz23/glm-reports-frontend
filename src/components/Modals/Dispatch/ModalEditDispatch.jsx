import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function ModalEditDispatch({ open, dispatchprocess, onClose, onSuccess }) {
    const initialForm = {
        fechaFacturacionCostos: "",
        numeroContainer: "",
        peso: "",
        bultos: "",
        tipoContenedor: "",
        cantidadContenedores: "",

        fechaEstDespachoPuerto: "",
        fechaRealDespachoPuerto: "",
        fechaEstEntregaBodega: "",
        fechaRealEntregaBodega: "",

        diasLibres: "",
        confirmadoNaviera: "",
        fechaCas: "",
        fechaEntregaContenedorVacio: "",

        almacenaje: "",
        demorraje: "",
        observaciones: "",
        fechaRegistroPesos: "",
    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (dispatchprocess?.despacho && open) {
            const d = dispatchprocess.despacho;

            setForm({
                fechaFacturacionCostos: d.fechaFacturacionCostos?.slice(0, 10) || "",
                numeroContainer: d.numeroContainer || "",
                peso: d.peso ?? "",
                bultos: d.bultos ?? "",
                tipoContenedor: d.tipoContenedor || "",
                cantidadContenedores: d.cantidadContenedores ?? "",

                fechaEstDespachoPuerto: d.fechaEstDespachoPuerto?.slice(0, 10) || "",
                fechaRealDespachoPuerto: d.fechaRealDespachoPuerto?.slice(0, 10) || "",
                fechaEstEntregaBodega: d.fechaEstEntregaBodega?.slice(0, 10) || "",
                fechaRealEntregaBodega: d.fechaRealEntregaBodega?.slice(0, 10) || "",

                diasLibres: d.diasLibres ?? "",
                confirmadoNaviera: d.confirmadoNaviera ?? "",
                fechaCas: d.fechaCas?.slice(0, 10) || "",
                fechaEntregaContenedorVacio: d.fechaEntregaContenedorVacio?.slice(0, 10) || "",

                almacenaje: d.almacenaje ?? "",
                demorraje: d.demorraje ?? "",
                observaciones: d.observaciones || "",
                fechaRegistroPesos: d.fechaRegistroPesos?.slice(0, 10) || "",
            });
        }
    }, [dispatchprocess, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const toISOorNull = (value) =>
        value ? new Date(value).toISOString() : null;


    // ===============================
    // GUARDAR CAMBIOS (PATCH)
    // ===============================
    const handleSubmit = async () => {
        if (!dispatchprocess?._id) {
            toast.error("Proceso inválido");
            return;
        }

        try {
            const payload = {
                numeroContainer: form.numeroContainer,
                tipoContenedor: form.tipoContenedor,
                cantidadContenedores: form.cantidadContenedores,
                observaciones: form.observaciones,

                peso: Number(form.peso || 0),
                bultos: Number(form.bultos || 0),
                diasLibres: Number(form.diasLibres || 0),
                almacenaje: Number(form.almacenaje || 0),
                demorraje: Number(form.demorraje || 0),
                confirmadoNaviera: Number(form.confirmadoNaviera || 0),

                fechaFacturacionCostos: toISOorNull(form.fechaFacturacionCostos),
                fechaEstDespachoPuerto: toISOorNull(form.fechaEstDespachoPuerto),
                fechaRealDespachoPuerto: toISOorNull(form.fechaRealDespachoPuerto),
                fechaEstEntregaBodega: toISOorNull(form.fechaEstEntregaBodega),
                fechaRealEntregaBodega: toISOorNull(form.fechaRealEntregaBodega),
                fechaCas: toISOorNull(form.fechaCas),
                fechaEntregaContenedorVacio: toISOorNull(form.fechaEntregaContenedorVacio),
                fechaRegistroPesos: toISOorNull(form.fechaRegistroPesos),
            };

            console.log("🟢 Dispatch UPDATE payload:", payload);

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${dispatchprocess._id}/despacho`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar despacho");

            toast.success("Despacho actualizado correctamente");
            onSuccess();
            onClose();
        } catch (err) {
            console.error("❌ Error al actualizar despacho", err);
            toast.error("Error al actualizar despacho");
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
                    maxWidth: "720px",
                    padding: "2rem",
                },
            }}
        >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    Editar Despacho
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box mt={3}>
                {/* CONTENEDOR */}
                <Typography variant="h6" mb={2}>
                    Contenedor
                </Typography>
                <Stack spacing={2}>
                    <TextField label="Número de Container" name="numeroContainer" value={form.numeroContainer} onChange={handleChange} />
                    <TextField label="Tipo de Contenedor" name="tipoContenedor" value={form.tipoContenedor} onChange={handleChange} />
                    <TextField type="number" label="Cantidad de Contenedores" name="cantidadContenedores" value={form.cantidadContenedores} onChange={handleChange} />
                    <TextField type="number" label="Peso" name="peso" value={form.peso} onChange={handleChange} />
                    <TextField type="number" label="Bultos" name="bultos" value={form.bultos} onChange={handleChange} />
                </Stack>

                <Typography variant="h6" mt={4} mb={2}>
                    Fechas
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2}>
                        {[
                            ["fechaFacturacionCostos", "Facturación Costos"],
                            ["fechaEstDespachoPuerto", "Est. Despacho Puerto"],
                            ["fechaRealDespachoPuerto", "Real Despacho Puerto"],
                            ["fechaEstEntregaBodega", "Est. Entrega Bodega"],
                            ["fechaRealEntregaBodega", "Real Entrega Bodega"],
                            ["fechaCas", "Fecha CAS"],
                            ["fechaEntregaContenedorVacio", "Entrega Contenedor Vacío"],
                        ].map(([field, label]) => (
                            <DatePicker
                                key={field}
                                label={label}
                                value={form[field] ? dayjs(form[field]) : null}
                                onChange={(v) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        [field]: v ? v.format("YYYY-MM-DD") : "",
                                    }))
                                }
                                format="DD-MM-YYYY" // esto se ve en la UI
                                slotProps={{
                                    textField: { fullWidth: true, sx: { mb: 2 } },
                                }}
                            />
                        ))}
                    </Stack>
                </LocalizationProvider>

                {/* COSTOS */}
                <Typography variant="h6" mt={4} mb={2}>
                    Costos
                </Typography>
                <Stack spacing={2}>
                    <TextField type="number" label="Almacenaje" name="almacenaje" value={form.almacenaje} onChange={handleChange} />
                    <TextField type="number" label="Demorraje" name="demorraje" value={form.demorraje} onChange={handleChange} />
                    <TextField type="number" label="Días Libres" name="diasLibres" value={form.diasLibres} onChange={handleChange} />
                </Stack>

                {/* OTROS */}
                <Typography variant="h6" mt={4} mb={2}>
                    Otros
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        type="number"
                        label="Confirmado por Naviera"
                        name="confirmadoNaviera"
                        value={form.confirmadoNaviera}
                        onChange={handleChange}
                        inputProps={{ min: 0 }}
                    />

                    <TextField type="date" label="Fecha CAS" name="fechaCas" InputLabelProps={{ shrink: true }} value={form.fechaCas} onChange={handleChange} />
                    <TextField type="date" label="Entrega Contenedor Vacío" name="fechaEntregaContenedorVacio" InputLabelProps={{ shrink: true }} value={form.fechaEntregaContenedorVacio} onChange={handleChange} />
                    <TextField multiline rows={3} label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} />
                </Stack>

                {/* GUARDAR */}
                <Box mt={4} textAlign="right">
                    <Button variant="contained" size="large" onClick={handleSubmit}>
                        Guardar Cambios
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
