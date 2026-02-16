// src/components/Modals/Customs/ModalEditCustoms.jsx
import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button,
    MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tipoAforo } from "./CustomOptions";
export default function ModalEditCustoms({ open, onClose, data, onUpdated }) {
    const [form, setForm] = useState({
        fechaEnvioElectronico: null,
        fechaPagoLiquidacion: null,
        fechaSalidaAutorizada: null,
        tipoAforo: "",
        refrendo: "",
        numeroEntregaEcuapass: "",
        numeroLiquidacion: "",
        numeroCdaAutorizacion: "",
        numeroCarga: "",
        statusAduana: "",
    });
    const [tipoAforoCatalogo, setTipoAforoCatalogo] = useState([]);

    const fetchTipoAforo = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/catalogos`,
                {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!res.ok) throw new Error("Error cargando catálogos");

            const data = await res.json();
            console.log("CATALOGOS RAW =>", data);

            setTipoAforoCatalogo(
                Array.isArray(data.TIPO_AFORO)
                    ? data.TIPO_AFORO
                    : data.TIPO_AFORO?.items || []
            );
            console.log(
                "🟢 TIPO_AFORO NORMALIZADO =>",
                Array.isArray(data.TIPO_AFORO)
                    ? data.TIPO_AFORO
                    : data.TIPO_AFORO?.items
            );


        } catch (err) {
            console.error("Error cargando catálogos", err);
            toast.error("No se pudieron cargar los catálogos");
        }
    };

    const getCatalogValue = (item) =>
        item.valor ?? item.nombre ?? item.descripcion ?? item.label ?? "";

    useEffect(() => {
        if (data?.aduana) {
            setForm({
                fechaEnvioElectronico: data.aduana.fechaEnvioElectronico
                    ? new Date(data.aduana.fechaEnvioElectronico)
                    : null,
                fechaPagoLiquidacion: data.aduana.fechaPagoLiquidacion
                    ? new Date(data.aduana.fechaPagoLiquidacion)
                    : null,
                fechaSalidaAutorizada: data.aduana.fechaSalidaAutorizada
                    ? new Date(data.aduana.fechaSalidaAutorizada)
                    : null,
                tipoAforo: data.aduana.tipoAforo || "",
                refrendo: data.aduana.refrendo || "",
                numeroEntregaEcuapass: data.aduana.numeroEntregaEcuapass || "",
                numeroLiquidacion: data.aduana.numeroLiquidacion || "",
                numeroCdaAutorizacion: data.aduana.numeroCdaAutorizacion || "",
                numeroCarga: data.aduana.numeroCarga || "",
                statusAduana: data.aduana.statusAduana || "",
            });
        }
        if (open) {
            fetchTipoAforo();
        }
    }, [data, open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDateChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        try {
            const payload = {
                aduana: {
                    ...form,
                    fechaEnvioElectronico: form.fechaEnvioElectronico
                        ? form.fechaEnvioElectronico.toISOString()
                        : null,
                    fechaPagoLiquidacion: form.fechaPagoLiquidacion
                        ? form.fechaPagoLiquidacion.toISOString()
                        : null,
                    fechaSalidaAutorizada: form.fechaSalidaAutorizada
                        ? form.fechaSalidaAutorizada.toISOString()
                        : null,
                }
            };
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${data._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar Aduana");

            const actualizado = await res.json();
            toast.success("Aduana actualizada correctamente");
            onUpdated(actualizado);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar Aduana");
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        borderRadius: "20px 0 0 20px",
                    },
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={600}>
                        Editar Aduana
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box mt={3}>
                    <Typography variant="h6" mb={2}>
                        Información Aduana
                    </Typography>

                    <Stack spacing={2}>
                        <DatePicker
                            label="Fecha Envío Electrónico"
                            value={form.fechaEnvioElectronico}
                            format="DD-MM-YYYY"
                            onChange={(v) => handleDateChange("fechaEnvioElectronico", v)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <DatePicker
                            label="Fecha Pago Liquidación"
                            value={form.fechaPagoLiquidacion}
                            format="DD-MM-YYYY"
                            onChange={(v) => handleDateChange("fechaPagoLiquidacion", v)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <DatePicker
                            label="Fecha Salida Autorizada"
                            value={form.fechaSalidaAutorizada}
                            format="DD-MM-YYYY"
                            onChange={(v) => handleDateChange("fechaSalidaAutorizada", v)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <TextField
                            select
                            label="Tipo Aforo"
                            name="tipoAforo"
                            value={form.tipoAforo || ""}
                            onChange={handleChange}
                            fullWidth
                        >
                            {tipoAforoCatalogo.map(item => {
                                const value = getCatalogValue(item);
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                        <TextField label="Refrendo" name="refrendo" value={form.refrendo} onChange={handleChange} />
                        <TextField label="N° Entrega ECUAPASS" name="numeroEntregaEcuapass" value={form.numeroEntregaEcuapass} onChange={handleChange} />
                        <TextField label="N° Liquidación" name="numeroLiquidacion" value={form.numeroLiquidacion} onChange={handleChange} />
                        <TextField label="N° CDA Autorización" name="numeroCdaAutorizacion" value={form.numeroCdaAutorizacion} onChange={handleChange} />
                        <TextField label="N° Carga" name="numeroCarga" value={form.numeroCarga} onChange={handleChange} />
                        <TextField label="Status Aduana" name="statusAduana" value={form.statusAduana} onChange={handleChange} />
                    </Stack>

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
        </LocalizationProvider>
    );
}
