// src/components/Modals/Ingreso/FormDespacho.jsx
import React, { useState, useEffect } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import toast from "react-hot-toast";

export default function FormDespacho({ data, onUpdated }) {
    const [form, setForm] = useState({
        placaCamion: "",
        placaTrailer: "",
        chofer: "",
        fechaSalida: "",
        semanaSalida: "",
        ltHastaDestino: "",
        satUN: "",
        satCont: "",
        ttTender: "",
        observaciones: "",
        otros: "",
    });

    useEffect(() => {
        if (data) setForm({ ...form, ...data });
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ["semanaSalida", "ltHastaDestino", "satUN", "satCont", "ttTender"];
        setForm({
            ...form,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/bills/${data._id}/step2`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error al actualizar despacho");

            const updated = await res.json();
            toast.success("Datos de despacho actualizados");
            if (onUpdated) onUpdated(updated);
        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar despacho");
        }
    };

    return (
        <Box>
            {/* Transporte */}
            <Typography variant="h6" mt={2}>Datos de Transporte</Typography>
            <Stack spacing={2} mt={1} direction="row">
                <TextField
                    label="Placa Camión"
                    name="placaCamion"
                    value={form.placaCamion}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Placa Trailer"
                    name="placaTrailer"
                    value={form.placaTrailer}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Chofer"
                    name="chofer"
                    value={form.chofer}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
            </Stack>

            {/* Fechas */}
            <Typography variant="h6" mt={4}>Fechas</Typography>
            <Stack spacing={2} mt={1} direction="row">
                <TextField
                    type="date"
                    label="Fecha de Salida"
                    name="fechaSalida"
                    value={form.fechaSalida}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    type="number"
                    label="Semana de Salida"
                    name="semanaSalida"
                    value={form.semanaSalida}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
            </Stack>

            {/* Tiempos / Carga */}
            <Typography variant="h6" mt={4}>Tiempos y Carga</Typography>
            <Stack spacing={2} mt={1} direction="row">
                <TextField
                    type="number"
                    label="Lead Time hasta Destino"
                    name="ltHastaDestino"
                    value={form.ltHastaDestino}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    type="number"
                    label="SAT UN"
                    name="satUN"
                    value={form.satUN}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    type="number"
                    label="SAT CONT"
                    name="satCont"
                    value={form.satCont}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
                <TextField
                    type="number"
                    label="TT Tender"
                    name="ttTender"
                    value={form.ttTender}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                />
            </Stack>

            {/* Observaciones y Otros */}
            <Typography variant="h6" mt={4}>Observaciones</Typography>
            <Stack spacing={2} mt={1}>
                <TextField
                    label="Observaciones"
                    name="observaciones"
                    value={form.observaciones}
                    multiline
                    minRows={4}
                    fullWidth
                    onChange={handleChange}
                />
                <TextField
                    label="Otros"
                    name="otros"
                    value={form.otros}
                    multiline
                    minRows={4}
                    fullWidth
                    onChange={handleChange}
                />
            </Stack>

            <Box mt={3}>
                <Button variant="contained" size="large" onClick={handleSave}>Guardar Despacho</Button>
            </Box>
        </Box>
    );
}
