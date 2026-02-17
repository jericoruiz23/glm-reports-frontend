// src/components/FormsBills/FormFactura.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, Typography, Divider, MenuItem } from "@mui/material";
import toast from "react-hot-toast";
import api from "../../../services/api";

export default function FormFactura({ onSaved }) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        origen: "",
        destino: "",
        codigo: "",
        descripcion: "",
        quintalesSolicitados: "",
        cajasSolicitadas: "",
        semanaEntrega: "",

        // 🆕 NUEVOS CAMPOS
        marca: "",
        sku: "",
        pesoNetoKg: "",
        pallets: "",
        quintalesRequeridos: "",
        cajasRequeridas: "",
    });

    // Opciones dinámicas
    const [origenOptions, setOrigenOptions] = useState([]);
    const [destinoOptions, setDestinoOptions] = useState([]);

    // Fetch catálogo
    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                const data = await api.get("/api/catalogs");
                console.log("📌 Catalogo recibido:", data);
                setOrigenOptions(data.paisesOrigen || []);
                setDestinoOptions(data.paisesDestino || []);
            } catch (error) {
                console.error("Error fetch catálogo", error);
                toast.error("Error de conexión al cargar catálogo");
            }
        };

        fetchCatalogo();
    }, []);

    // Handle Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        // nuevos campos numéricos
        const numericFields = [
            "quintalesSolicitados",
            "cajasSolicitadas",
            "semanaEntrega",
            "pesoNetoKg",
            "pallets",
            "quintalesRequeridos",
            "cajasRequeridas"
        ];

        if (numericFields.includes(name) && !/^\d*$/.test(value)) return;

        if (name === "semanaEntrega") {
            if (value === "" || (Number(value) >= 1 && Number(value) <= 52)) {
                setFormData({ ...formData, [name]: value });
            }
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("FormData enviado:", formData);

        if (!formData.origen || !formData.destino || !formData.codigo) {
            toast.error("Completa todos los campos obligatorios");
            return;
        }

        setLoading(true);

        try {
            const data = await api.post("/api/bills/step1", formData);

            toast.success("Datos guardados correctamente");

            if (onSaved) onSaved(data.billId);

            setFormData({
                origen: "",
                destino: "",
                codigo: "",
                descripcion: "",
                quintalesSolicitados: "",
                cajasSolicitadas: "",
                semanaEntrega: "",
                marca: "",
                sku: "",
                pesoNetoKg: "",
                pallets: "",
                quintalesRequeridos: "",
                cajasRequeridas: "",
            });

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error de conexión");
        }

        setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

            {/* UBICACIÓN */}
            <Typography variant="h6" sx={{ mb: 1 }}>Datos de Ubicación</Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "50%" }}>
                <TextField
                    select fullWidth label="Origen" name="origen"
                    value={formData.origen} onChange={handleChange}
                >
                    {origenOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </TextField>

                <TextField
                    select fullWidth label="Destino" name="destino"
                    value={formData.destino} onChange={handleChange}
                >
                    {destinoOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </TextField>
            </Box>

            {/* DETALLES */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Detalles del Producto</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                {/* Código */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Código (alfanumérico)"
                        name="codigo"
                        fullWidth
                        required
                        value={formData.codigo}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(val)) handleChange(e);
                        }}
                    />
                </Grid>

                {/* Marca */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Marca"
                        name="marca"
                        fullWidth
                        value={formData.marca}
                        onChange={handleChange}
                    />
                </Grid>

                {/* SKU */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="SKU"
                        name="sku"
                        fullWidth
                        value={formData.sku}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            {/* Descripción ocupa toda la fila */}
            <Grid container xs={12} md={12} sx={{ mt: 2, mr: 77 }}>
                <TextField
                    label="Descripción"
                    name="descripcion"
                    fullWidth
                    multiline
                    rows={3} // más líneas visibles
                    value={formData.descripcion}
                    onChange={handleChange}

                />
            </Grid>





            {/* CANTIDADES */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Cantidades y Entrega</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Peso Neto (Kg)" name="pesoNetoKg" fullWidth
                        value={formData.pesoNetoKg}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        label="# Pallets" name="pallets" fullWidth
                        value={formData.pallets}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        label="Semana de Entrega (1-52)" name="semanaEntrega" fullWidth
                        value={formData.semanaEntrega}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Quintales Solicitados" name="quintalesSolicitados" fullWidth
                        value={formData.quintalesSolicitados}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="# Cajas Solicitadas" name="cajasSolicitadas" fullWidth
                        value={formData.cajasSolicitadas}
                        onChange={handleChange}
                    />
                </Grid>

                {/* 🆕 QUINTALES REQUERIDOS */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Quintales Requeridos a Cargar"
                        name="quintalesRequeridos"
                        fullWidth
                        value={formData.quintalesRequeridos}
                        onChange={handleChange}
                    />
                </Grid>

                {/* 🆕 CAJAS REQUERIDAS */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="# Cajas Requeridas a Cargar"
                        name="cajasRequeridas"
                        fullWidth
                        value={formData.cajasRequeridas}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            {/* BOTÓN */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 4 }}>
                <Button variant="contained" color="primary" type="submit"
                    sx={{ px: 4, py: 1.2 }} disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Factura"}
                </Button>
            </Grid>

        </Box>
    );
}
