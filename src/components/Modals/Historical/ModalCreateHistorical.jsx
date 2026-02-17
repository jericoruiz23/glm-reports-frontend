// src/components/Modals/ModalCreateHistorical.jsx
import React, { useState } from "react";
import { Drawer, Box, Typography, TextField, Stack, Button } from "@mui/material";
import toast from "react-hot-toast";
import api from "../../../services/api";

export default function ModalCreateHistorical({ open, onClose, onCreated }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        year: new Date().getFullYear(),
        status: "Activo"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        try {
            await api.post("/api/historical", form);
            toast.success("Histórico creado");
            onCreated();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo crear histórico");
        }
    };

    if (!open) return null;

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400, p: 3 } }}>
            <Typography variant="h6" mb={2}>Crear Histórico</Typography>
            <Stack spacing={2}>
                <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} />
                <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} multiline minRows={3} />
                <TextField label="Año" name="year" value={form.year} onChange={handleChange} type="number" />
                <TextField label="Status" name="status" value={form.status} onChange={handleChange} />
                <Button variant="contained" onClick={handleSave}>Guardar</Button>
            </Stack>
        </Drawer>
    );
}
