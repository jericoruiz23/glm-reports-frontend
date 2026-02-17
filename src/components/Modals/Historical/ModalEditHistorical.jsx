// src/components/Modals/ModalEditHistorical.jsx
import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, TextField, Stack, Button } from "@mui/material";
import toast from "react-hot-toast";
import api from "../../../services/api";

export default function ModalEditHistorical({ open, onClose, data, onUpdated, loading: externalLoading }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        if (!form.name || !form.year) {
            toast.error("Nombre y Año son obligatorios");
            return;
        }

        try {
            setLoading(true);
            const updated = await api.put(`/api/historical/${form._id}`, form);
            toast.success("Histórico actualizado");
            if (onUpdated) onUpdated(updated);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "No se pudo actualizar");
        } finally {
            setLoading(false);
        }
    };

    if (!open || !form) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 400, p: 3 } }}
        >
            <Typography variant="h6" mb={2}>Editar Histórico</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Descripción"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                />
                <TextField
                    label="Año"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    type="number"
                    required
                />
                <TextField
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading || externalLoading}
                >
                    {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
            </Stack>
        </Drawer>
    );
}
