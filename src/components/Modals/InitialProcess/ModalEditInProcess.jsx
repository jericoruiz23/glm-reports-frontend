// src/components/Modals/EditInProcessDrawer.jsx
import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    IconButton,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function EditInProcessDrawer({ open, onClose, data, onUpdated, onDeleted }) {

    const [form, setForm] = useState({
        codigoImportacion: "",
        proveedor: "",
        prioridad: "NORMAL",
        facturaComercial: "",
        ordenCompra: "",
        descripcion: "",
        notificacionRecibidaBroker: "",
        referencia: "",
        regimen: "",
    });
    const [catalogos, setCatalogos] = useState({
        PROVEEDOR: [],
        DESCRIPCION: [],
        PRIORIDAD: [],
    });
    /* =========================
       CARGA INICIAL
    ========================= */
    useEffect(() => {
        if (!data) return;

        const fetchCatalog = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/catalogos`,
                    {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!res.ok) throw new Error("Error al obtener el catalogo");

                const data = await res.json();
                console.log(data, 'catalogos');


                setCatalogos({
                    PROVEEDOR: data.PROVEEDOR || [],
                    DESCRIPCION: data.DESCRIPCION || [],
                    PRIORIDAD: data.PRIORIDAD || [],
                });

            } catch (err) {
                console.error(err);
                toast.error("No se pudo obtener el catalogo");
            }
        };

        fetchCatalog(); // 🔥 ESTA ERA LA LÍNEA QUE FALTABA

        setForm({
            codigoImportacion: data.inicio?.codigoImportacion || "",
            proveedor: data.inicio?.proveedor || "",
            prioridad: data.inicio?.prioridad || "NORMAL",
            facturaComercial: data.inicio?.facturaComercial || "",
            ordenCompra: data.inicio?.ordenCompra || "",
            descripcion: data.inicio?.descripcion || "",
            notificacionRecibidaBroker: formatUTCDate(
                data.inicio?.notificacionBroker
            ),
            referencia: data.inicio?.referencia || "",
            regimen: data.inicio?.regimen || "",
        });
    }, [data]);

    const parseUTCDate = (value) => {
        if (!value) return null;

        // value puede venir como ISO o YYYY-MM-DD
        if (typeof value === "string") {
            return dayjs.utc(value, value.includes("T") ? undefined : "YYYY-MM-DD");
        }

        if (dayjs.isDayjs(value) && value.isValid()) {
            return value.utc(true);
        }

        return null;
    };

    const formatUTCDate = (value) => {
        const d = parseUTCDate(value);
        return d ? d.format("YYYY-MM-DD") : null;
    };

    /* =========================
       HANDLERS
    ========================= */
    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const normalizeDateForBackend = (value) => {
        if (!value) return null;
        return new Date(`${value}T00:00:00.000Z`);
    };


    /* =========================
       SAVE
    ========================= */
    const handleSave = async () => {
        try {
            const payload = {
                inicio: {
                    codigoImportacion: form.codigoImportacion,
                    proveedor: form.proveedor,
                    prioridad: form.prioridad,
                    facturaComercial: form.facturaComercial,
                    ordenCompra: form.ordenCompra,
                    descripcion: form.descripcion,
                    referencia: form.referencia,
                    notificacionBroker: normalizeDateForBackend(form.notificacionRecibidaBroker),
                },
            };

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${data._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar proceso");

            const updated = await res.json();
            toast.success("Proceso actualizado");
            onUpdated?.(updated);
            onClose();

        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    /* =========================
       DELETE
    ========================= */
    const handleDelete = async () => {
        if (!window.confirm("¿Eliminar este proceso?")) return;

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${data._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Error al eliminar");

            toast.success("Proceso eliminado");
            onDeleted?.(data._id);
            onClose();

        } catch (err) {
            toast.error("Error al eliminar");
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
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px",
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    Editar Inicio del Proceso
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box mt={3}>
                <Stack spacing={2}>

                    <TextField
                        select
                        label="Proveedor"
                        name="proveedor"
                        value={form.proveedor}
                        onChange={handleChange}
                        fullWidth
                    >
                        {catalogos.PROVEEDOR.map((prov) => {
                            const value = prov.valor ?? prov.nombre ?? prov.label ?? "";
                            return (
                                <MenuItem key={prov._id || value} value={value}>
                                    {value}
                                </MenuItem>
                            );
                        })}
                    </TextField>


                    <TextField
                        select
                        label="Descripción"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        fullWidth
                    >
                        {catalogos.DESCRIPCION.map((desc) => {
                            const value = desc.valor ?? desc.descripcion ?? desc.label ?? "";
                            return (
                                <MenuItem key={desc._id || value} value={value}>
                                    {value}
                                </MenuItem>
                            );
                        })}
                    </TextField>

                    <TextField
                        label="Prioridad"
                        select
                        name="prioridad"
                        value={form.prioridad}
                        onChange={handleChange}
                        fullWidth
                    >
                        {catalogos.PRIORIDAD
                            .filter(p => p.activo)
                            .map((item) => {
                                const value = item.key ?? item.valor ?? item.label ?? "";
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {item.label || value}
                                    </MenuItem>
                                );
                            })}
                    </TextField>


                    <TextField
                        label="Factura Comercial"
                        name="facturaComercial"
                        value={form.facturaComercial}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Número Orden de Compra"
                        name="ordenCompra"
                        value={form.ordenCompra}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Régimen"
                        value={form.regimen}
                        disabled
                        fullWidth
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Notificación Recibida Broker"
                            format="DD/MM/YYYY"
                            value={parseUTCDate(form.notificacionRecibidaBroker)}
                            onChange={(newValue) => {
                                const normalized = formatUTCDate(newValue);
                                setForm(prev => ({
                                    ...prev,
                                    notificacionRecibidaBroker: normalized,
                                }));
                            }}
                            slotProps={{
                                textField: { fullWidth: true },
                            }}
                        />
                    </LocalizationProvider>


                    <TextField
                        label="Orden"
                        name="referencia"
                        value={form.referencia}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button color="error" onClick={handleDelete}>
                        Eliminar
                    </Button>
                    <Box>
                        <Button onClick={onClose} sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}
