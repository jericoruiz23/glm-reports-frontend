// src/components/Modals/Ingreso/FormLogisticaInline.jsx
import React, { useState, useEffect } from "react";
import { Box, Stack, TextField, Button, Typography, MenuItem } from "@mui/material";
import toast from "react-hot-toast";

export default function FormLogisticaInline({ data, onUpdated }) {
    const [form, setForm] = useState({
        forwarder: "",
        mot: "",
        contenedor: "",
        invoiceNumber: "",
        purchaseOrder: "",
        requestDate: "",
        invoiceDate: "",
        weeksFacturacion: "",
        etd: "",
        weekETD: "",
        etaTentativo: "",
        etaReal: "",
        weekETAPuerto: "",
        ingresoBodega: "",
        transitTimePortToPort: "",
        ltHastaAlmacen: "",
        observaciones: "",
        causalesRetraso: "",
        novedadesDescarga: "",
        anomaliasTemperatura: "",
        puertoArribo: "",
    });

    useEffect(() => {
        if (data) setForm({ ...form, ...data });
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ["weeksFacturacion", "weekETD", "weekETAPuerto", "transitTimePortToPort", "ltHastaAlmacen"];
        setForm({
            ...form,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/bills/${data._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Error al actualizar logística");
            const updated = await res.json();
            toast.success("Datos de logística actualizados");
            if (onUpdated) onUpdated(updated);
        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar");
        }
    };

    const forwarderOptions = ["MAERSK", "CMA-CGM", "HAPAG LLOYD", "MSC"];
    const motOptions = ["Marítimo", "Aéreo", "Terrestre"];

    return (
        <Box>
            {/* Forwarder, MOT y Contenedor en línea */}
            <Typography variant="h6" mt={2}>Forwarder y Transporte</Typography>
            <Stack spacing={2} mt={1} direction="row">
                <TextField
                    select
                    label="Forwarder"
                    name="forwarder"
                    value={form.forwarder}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                >
                    {forwarderOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </TextField>
                <TextField
                    select
                    label="Modo de transporte (MOT)"
                    name="mot"
                    value={form.mot}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                >
                    {motOptions.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField
                    label="Contenedor"
                    name="contenedor"
                    value={form.contenedor}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
            </Stack>

            {/* Documentos */}
            <Typography variant="h6" mt={4}>Documentos</Typography>
            <Stack spacing={2} mt={1} direction="row">
                <TextField label="Número de Factura" name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} sx={{ flex: 1 }} />
                <TextField label="Número de Orden de Compra" name="purchaseOrder" value={form.purchaseOrder} onChange={handleChange} sx={{ flex: 1 }} />
            </Stack>

            {/* Fechas en una línea */}
            <Typography variant="h6" mt={4}>Fechas</Typography>
            <Stack spacing={2} mt={1} direction="row">
                <TextField
                    type="date"
                    label="Fecha de Solicitud"
                    name="requestDate"
                    value={form.requestDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    type="date"
                    label="Fecha de Factura"
                    name="invoiceDate"
                    value={form.invoiceDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    type="datetime-local"
                    label="ETD"
                    name="etd"
                    value={form.etd}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
            </Stack>

            {/* Botón Guardar */}
            <Box mt={3}>
                <Button variant="contained" onClick={handleSave}>Guardar Logística</Button>
            </Box>
        </Box>
    );
}
