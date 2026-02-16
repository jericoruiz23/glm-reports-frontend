// src/components/Modals/EditTransitDrawer.jsx
import React, { useState, useEffect } from "react";
import { Drawer, Tabs, Tab, Box, Button, TextField } from "@mui/material";
import toast from "react-hot-toast";

export default function EditTransitDrawer({ open, onClose, data, onUpdated }) {
    const [tab, setTab] = useState(0);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (data) {
            setForm({
                origen: data.origen || "",
                forwarder: data.forwarder || "",
                numeroOp: data.numeroOp || 0,
                avgPortToPort: data.avgPortToPort || 0,
                avgTTender: data.avgTTender || 0,
                avgDeltaTransit: data.avgDeltaTransit || 0,
                maxLTCargaBodega: data.maxLTCargaBodega || 0,
                avgLTRoundTripWeek: data.avgLTRoundTripWeek || 0,
                notes: data.notes || "",
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = [
            "numeroOp", "avgPortToPort", "avgTTender", "avgDeltaTransit",
            "maxLTCargaBodega", "avgLTRoundTripWeek"
        ];
        setForm({
            ...form,
            [name]: numericFields.includes(name) ? Number(value) : value
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = { ...form };

            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_IP_PORT}/api/transit/${data._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar");

            const updated = await res.json();
            toast.success("Registro actualizado");
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
                    maxWidth: "700px",
                    backdropFilter: "blur(15px)",
                    background: "white",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px"
                }
            }}
        >
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                <Tab label="Información General" />
                <Tab label="Tiempos" />
                <Tab label="Notas" />
            </Tabs>

            {/* INFORMACIÓN GENERAL */}
            <Box hidden={tab !== 0} sx={{ mt: 2 }}>
                <TextField fullWidth label="Origen" name="origen" value={form.origen} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Forwarder" name="forwarder" value={form.forwarder} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth type="number" label="# Operaciones" name="numeroOp" value={form.numeroOp} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* TIEMPOS */}
            <Box hidden={tab !== 1} sx={{ mt: 2 }}>
                <TextField fullWidth type="number" label="Prom. Transit Port to Port (días)" name="avgPortToPort" value={form.avgPortToPort} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth type="number" label="Prom. TT Tender" name="avgTTender" value={form.avgTTender} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth type="number" label="Prom. Delta Tiempo Tránsito" name="avgDeltaTransit" value={form.avgDeltaTransit} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth type="number" label="Máx. LT Carga-Bodega" name="maxLTCargaBodega" value={form.maxLTCargaBodega} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth type="number" label="Prom. LT Round Trip Week" name="avgLTRoundTripWeek" value={form.avgLTRoundTripWeek} onChange={handleChange} sx={{ mb: 2 }} />
            </Box>

            {/* NOTAS */}
            <Box hidden={tab !== 2} sx={{ mt: 2 }}>
                <TextField fullWidth multiline minRows={4} label="Notas" name="notes" value={form.notes} onChange={handleChange} sx={{ mb: 2 }} />
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
