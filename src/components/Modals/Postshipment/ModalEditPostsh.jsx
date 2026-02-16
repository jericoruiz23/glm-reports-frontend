import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";

const emptyPostembarqueForm = {
    codigoImportacionId: "",
    blMaster: "",
    blHijo: "",
    tipoTransporte: "",
    companiaTransporte: "",
    forwarder: "",
    fechaEstEmbarque: null,
    fechaRealEmbarque: null,
    fechaEstLlegadaPuerto: null,
    fechaRealLlegadaPuerto: null,
    numeroGuia: "",
    fechaRecepcionDocsOriginales: null,
    puertoEmbarque: ""
};


export default function ModalEditPostshipment({ open, onClose, procesos = [], data }) {
    const [form, setForm] = useState(emptyPostembarqueForm);

    const [catalogos, setCatalogos] = useState({
        TIPO_TRANSPORTE: [],
        COMPANIA_TRANSPORTE: [],
        FORWARDER: [],
        PUERTO_EMBARQUE: [],
        ASEGURADORA: [],
        DCP: [],
        FORMAS_PAGO: [],
        INCOTERMS: [],
        PAIS_ORIGEN: [],
        UNIDADES_METRICAS: []
    });
    const fetchCatalogos = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/catalogos`,
                {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!res.ok) throw new Error("Error al cargar catálogos");

            const data = await res.json();
            console.log("🟢 Catálogos cargados:", data);

            // 🔥 MISMA estructura que el modal que sí funciona
            setCatalogos(data);

        } catch (err) {
            console.error("❌ Error catálogos:", err);
            toast.error("No se pudieron cargar los catálogos");
        }
    };


    // Cargar data al abrir modal
    useEffect(() => {
        if (open) {
            fetchCatalogos();
        }
        if (data) {

            const post = data.postembarque || data; // <- si viene desde tabla, normalmente está dentro de postembarque
            setForm({
                codigoImportacionId: post.codigoImportacion || "", // ID del proceso para el select
                blMaster: post.blMaster || "",
                blHijo: post.blHijo || "",
                tipoTransporte: post.tipoTransporte || "",
                companiaTransporte: post.companiaTransporte || "",
                forwarder: post.forwarder || "",
                fechaEstEmbarque: post.fechaEstEmbarque ? new Date(post.fechaEstEmbarque) : null,
                fechaRealEmbarque: post.fechaRealEmbarque ? new Date(post.fechaRealEmbarque) : null,
                fechaEstLlegadaPuerto: post.fechaEstLlegadaPuerto ? new Date(post.fechaEstLlegadaPuerto) : null,
                fechaRealLlegadaPuerto: post.fechaRealLlegadaPuerto ? new Date(post.fechaRealLlegadaPuerto) : null,
                numeroGuia: post.numeroGuia || "",
                fechaRecepcionDocsOriginales: post.fechaRecepcionDocsOriginales ? new Date(post.fechaRecepcionDocsOriginales) : null,
                puertoEmbarque: post.puertoEmbarque || ""
            });

        }
    }, [data]);


    const getCatalogValue = (item) =>
        item.valor ?? item.nombre ?? item.descripcion ?? item.label ?? "";


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDateChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        if (!form.codigoImportacionId) {
            toast.error("Debes seleccionar un código de importación");
            return;
        }

        try {
            const { codigoImportacionId, ...postembarqueData } = form;

            const payload = {
                postembarque: {
                    blMaster: postembarqueData.blMaster,
                    blHijo: postembarqueData.blHijo,
                    tipoTransporte: postembarqueData.tipoTransporte,
                    companiaTransporte: postembarqueData.companiaTransporte,
                    forwarder: postembarqueData.forwarder,
                    numeroGuia: postembarqueData.numeroGuia,
                    puertoEmbarque: postembarqueData.puertoEmbarque,

                    fechaEstEmbarque: postembarqueData.fechaEstEmbarque?.toISOString() || null,
                    fechaRealEmbarque: postembarqueData.fechaRealEmbarque?.toISOString() || null,
                    fechaEstLlegadaPuerto: postembarqueData.fechaEstLlegadaPuerto?.toISOString() || null,
                    fechaRealLlegadaPuerto: postembarqueData.fechaRealLlegadaPuerto?.toISOString() || null,
                    fechaRecepcionDocsOriginales:
                        postembarqueData.fechaRecepcionDocsOriginales?.toISOString() || null,
                }
            };

            console.log("🟡 Payload FINAL:", payload);

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${data._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error("🔴 Backend error:", text);
                throw new Error("Error al actualizar postembarque");
            }

            const actualizado = await res.json();
            console.log("🟢 Actualizado:", actualizado);

            toast.success("Postembarque actualizado");
            onClose();
        } catch (err) {
            console.error("❌ Error al actualizar postembarque", err);
            toast.error("Error al actualizar postembarque");
        }
    };


    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
        >
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
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={600}>
                        Editar Postembarque
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box mt={3}>
                    {/* Selección Código Importación */}
                    <TextField
                        label="Código Importación"
                        value={data?.codigoImportacion || data?.inicio?.codigoImportacion || ""}
                        fullWidth
                        disabled
                    />


                    <Typography variant="h6" mb={2}>Información de Postembarque</Typography>
                    <Stack spacing={2}>
                        <TextField label="BL Master" name="blMaster" value={form.blMaster} onChange={handleChange} />
                        <TextField label="BL Hijo" name="blHijo" value={form.blHijo} onChange={handleChange} />
                        <TextField
                            select
                            label="Tipo Transporte"
                            name="tipoTransporte"
                            value={form.tipoTransporte}
                            onChange={handleChange}
                        >
                            {catalogos.TIPO_TRANSPORTE.map(item => {
                                const value = getCatalogValue(item);
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}

                        </TextField>


                        <TextField
                            select
                            label="Compañía Transporte"
                            name="companiaTransporte"
                            value={form.companiaTransporte || ""}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="">Seleccionar</MenuItem>
                            {catalogos.COMPANIA_TRANSPORTE.map(item => {
                                const value = getCatalogValue(item);
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
                        </TextField>


                        <TextField
                            select
                            label="Forwarder"
                            name="forwarder"
                            value={form.forwarder || ""}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="">Seleccionar</MenuItem>
                            {catalogos.FORWARDER.map(item => {
                                const value = getCatalogValue(item);
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
                        </TextField>


                        <TextField
                            select
                            label="Puerto Embarque"
                            name="puertoEmbarque"
                            value={form.puertoEmbarque || ""}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="">Seleccionar</MenuItem>
                            {catalogos.PUERTO_EMBARQUE.map(item => {
                                const value = getCatalogValue(item);
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
                        </TextField>



                        <DatePicker
                            label="F. Est. Embarque"
                            value={form.fechaEstEmbarque}
                            onChange={(newValue) => handleDateChange("fechaEstEmbarque", newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <DatePicker
                            label="F. Real Embarque"
                            value={form.fechaRealEmbarque}
                            onChange={(newValue) => handleDateChange("fechaRealEmbarque", newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <DatePicker
                            label="F. Est. Llegada Puerto"
                            value={form.fechaEstLlegadaPuerto}
                            onChange={(newValue) => handleDateChange("fechaEstLlegadaPuerto", newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <DatePicker
                            label="F. Real Llegada Puerto"
                            value={form.fechaRealLlegadaPuerto}
                            onChange={(newValue) => handleDateChange("fechaRealLlegadaPuerto", newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <TextField label="# Guía" name="numeroGuia" value={form.numeroGuia} onChange={handleChange} />
                        <DatePicker
                            label="F. Recepción Docs"
                            value={form.fechaRecepcionDocsOriginales}
                            onChange={(newValue) => handleDateChange("fechaRecepcionDocsOriginales", newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Stack>

                    <Box mt={5} textAlign="right">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ borderRadius: "12px", paddingX: 4 }}
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>

            </Drawer>
        </LocalizationProvider>
    );
}
