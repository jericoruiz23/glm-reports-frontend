// src/components/Modals/ModalCreateTransit.jsx
import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

export default function ModalCreateTransit({ open, onClose, onCreated }) {
    const [form, setForm] = useState({
        origen: "",
        forwarder: "",
        numeroOp: "",
        avgPortToPort: "",
        avgTTender: "",
        avgDeltaTransit: "",
        maxLTCargaBodega: "",
        avgLTRoundTripWeek: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/transit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error al crear registro");

            const nuevo = await res.json();
            toast.success("Registro creado");
            onCreated(nuevo);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error al crear");
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
                    maxWidth: "700px",
                    backdropFilter: "blur(15px)",
                    background: "rgba(255, 255, 255, 1)",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px"
                }
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    Crear Transit Time
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box mt={3}>
                {/* Información General */}
                <Typography variant="h6" mb={2}>Información General</Typography>
                <Stack spacing={2}>
                    <TextField label="Origen" name="origen" value={form.origen} onChange={handleChange} />
                    <TextField label="Forwarder" name="forwarder" value={form.forwarder} onChange={handleChange} />
                    <TextField label="# Operaciones" name="numeroOp" value={form.numeroOp} onChange={handleChange} />
                </Stack>

                {/* Tiempos */}
                <Typography variant="h6" mt={4} mb={2}>Tiempos Promedio</Typography>
                <Stack spacing={2} direction="row">
                    <TextField fullWidth label="Prom. Transit Port to Port (días)" name="avgPortToPort" value={form.avgPortToPort} onChange={handleChange} />
                    <TextField fullWidth label="Prom. TT Tender" name="avgTTender" value={form.avgTTender} onChange={handleChange} />
                </Stack>

                <Stack spacing={2} direction="row" mt={2}>
                    <TextField fullWidth label="Prom. Delta Tiempo Tránsito" name="avgDeltaTransit" value={form.avgDeltaTransit} onChange={handleChange} />
                    <TextField fullWidth label="Máx. LT Carga-Bodega" name="maxLTCargaBodega" value={form.maxLTCargaBodega} onChange={handleChange} />
                </Stack>

                <TextField
                    fullWidth
                    label="Prom. LT Round Trip Week"
                    name="avgLTRoundTripWeek"
                    value={form.avgLTRoundTripWeek}
                    onChange={handleChange}
                    sx={{ mt: 2 }}
                />

                {/* Guardar */}
                <Box mt={5} textAlign="right">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ borderRadius: "12px", paddingX: 4 }}
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
