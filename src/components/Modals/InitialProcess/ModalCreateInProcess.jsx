import React, { useEffect, useState } from "react";
import {
    Drawer, Box, Typography, IconButton, TextField,
    Stack, Button, MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function ModalCreateEtapa1({ open, onClose, onCreated }) {

    const [form, setForm] = useState({
        proveedor: "",
        prioridad: "NORMAL",
        facturaComercial: "",
        numeroOrdenCompra: "",
        descripcion: "",
        notificacionRecibidaBroker: "",
        referencia: "",
    });

    const [tipo, setTipo] = useState("IND");
    const [regimenSel, setRegimenSel] = useState("10");
    const [codigoBase, setCodigoBase] = useState(""); // tipo-regimen-año-001
    const [extensiones, setExtensiones] = useState([]); // array de extensiones
    const [codigoEditable, setCodigoEditable] = useState("");
    const [catalogos, setCatalogos] = useState({
        PROVEEDOR: [],
        DESCRIPCION: [],
        PRIORIDAD: [],
    });


    const año = new Date().getFullYear();

    useEffect(() => {
        if (!open) return;

        const fetchPreview = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/process/preview/codigo?tipo=${tipo}&regimen=${regimenSel}`,
                    {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!res.ok) throw new Error("Error al obtener código preview");

                const data = await res.json();

                setCodigoBase(data.codigoBase);
                setCodigoEditable(data.codigoBase); // 🔥 CLAVE
                setExtensiones([]);
            } catch (err) {
                console.error(err);
                toast.error("No se pudo obtener el código preview");
            }
        };
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

        fetchPreview();
        fetchCatalog();

    }, [open, tipo, regimenSel]);

    const handleExtendCodigo = () => {
        const nuevo = `${codigoEditable}-001`;
        setCodigoEditable(nuevo);
    };



    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!codigoBase) {
                toast.error("Código de importación no generado");
                return;
            }

            const payload = {
                codigoImportacion: codigoEditable,
                tipo,
                regimenSel,
                proveedor: form.proveedor,
                facturaComercial: form.facturaComercial,
                numeroOrdenCompra: form.numeroOrdenCompra,
                regimen: regimenSel,
                descripcion: form.descripcion,
                referencia: form.referencia,
                prioridad: form.prioridad,
                notificacionRecibidaBroker: form.notificacionRecibidaBroker || null,
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                toast.error("Error al crear proceso");
                return;
            }

            const nuevo = await res.json();

            toast.success(`Proceso creado: ${nuevo.codigoImportacion}`);
            onCreated(nuevo);
            onClose();

        } catch (err) {
            console.error(err);
            toast.error("Error al crear proceso");
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
                    Inicio del Proceso
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box mt={3}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="Tipo"
                            select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="IND">IND</MenuItem>
                            <MenuItem value="COM">COM</MenuItem>
                            <MenuItem value="MAN">MAN</MenuItem>
                            <MenuItem value="OTR">OTR</MenuItem>
                        </TextField>

                        <TextField
                            label="Régimen"
                            select
                            value={regimenSel}
                            onChange={(e) => setRegimenSel(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="21">21</MenuItem>
                            <MenuItem value="91">91</MenuItem>
                        </TextField>

                        <TextField label="Año" value={año} disabled fullWidth />
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            label="Código de Importación"
                            value={codigoEditable}
                            onChange={(e) => setCodigoEditable(e.target.value)}
                            fullWidth
                        />

                        <IconButton
                            color="primary"
                            onClick={handleExtendCodigo} // 🔥 agrega extensión al final
                            sx={{ height: "56px" }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
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
                        select
                        label="Prioridad"
                        name="prioridad"
                        value={form.prioridad}
                        onChange={handleChange}
                        fullWidth
                    >
                        {catalogos.PRIORIDAD?.filter(p => p.activo)?.map((item) => {
                            const value = item.key ?? item.valor ?? item.label ?? "";
                            return (
                                <MenuItem key={item._id || value} value={value}>
                                    {item.label || value}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                    <TextField label="Factura Comercial" name="facturaComercial" value={form.facturaComercial} onChange={handleChange} />
                    <TextField label="Número Orden de Compra" name="numeroOrdenCompra" value={form.numeroOrdenCompra} onChange={handleChange} />
                    <TextField
                        label="Régimen Seleccionado"
                        value={regimenSel}
                        disabled
                        fullWidth
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Notificación Recibida Broker"
                            format="DD-MM-YYYY"
                            value={
                                form.notificacionRecibidaBroker
                                    ? dayjs.utc(form.notificacionRecibidaBroker, "YYYY-MM-DD")
                                    : null
                            }
                            onChange={(newValue) => {
                                setForm(prev => ({
                                    ...prev,
                                    notificacionRecibidaBroker: newValue
                                        ? newValue.utc(true).format("YYYY-MM-DD")
                                        : ""
                                }));
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField label="Orden" name="referencia" value={form.referencia} onChange={handleChange} />
                </Stack>

                <Box mt={5} textAlign="right">
                    <Button variant="contained" size="large" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );

}
