import React, { useEffect, useState } from "react";
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

import {
    buildProcessCodeLabel,
    getStageCandidates,
    mergeTextValue,
    toDateObject,
} from "../../../utils/stageCreateHelpers";

const initialForm = {
    codigoImportacion: "",
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

export default function ModalCreatePostshipment({
    open,
    onClose,
    onCreated,
    procesos = []
}) {
    const [form, setForm] = useState(initialForm);
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
    const eligibleProcesses = getStageCandidates(procesos, "preembarque", "postembarque");
    const buildFormFromProcess = (processId, process) => {
        const postembarque = process?.postembarque || {};

        return {
            ...initialForm,
            codigoImportacion: processId || "",
            blMaster: postembarque.blMaster || "",
            blHijo: postembarque.blHijo || "",
            tipoTransporte: postembarque.tipoTransporte || "",
            companiaTransporte: postembarque.companiaTransporte || "",
            forwarder: postembarque.forwarder || "",
            fechaEstEmbarque: toDateObject(postembarque.fechaEstEmbarque),
            fechaRealEmbarque: toDateObject(postembarque.fechaRealEmbarque),
            fechaEstLlegadaPuerto: toDateObject(postembarque.fechaEstLlegadaPuerto),
            fechaRealLlegadaPuerto: toDateObject(postembarque.fechaRealLlegadaPuerto),
            numeroGuia: postembarque.numeroGuia || "",
            fechaRecepcionDocsOriginales: toDateObject(postembarque.fechaRecepcionDocsOriginales),
            puertoEmbarque: postembarque.puertoEmbarque || ""
        };
    };

    const fetchCatalogos = async () => {
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

            setCatalogos(data);
        } catch (err) {
            console.error("Error cargando catálogos", err);
            toast.error("No se pudieron cargar los catálogos");
        }
    };

    useEffect(() => {
        if (open) {
            fetchCatalogos();
            setForm(initialForm);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "codigoImportacion") {
            const selectedProcess = eligibleProcesses.find((process) => process?._id === value);
            setForm(buildFormFromProcess(value, selectedProcess));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const getCatalogValue = (item) =>
        item.valor ?? item.nombre ?? item.descripcion ?? item.label ?? "";

    const handleSubmit = async () => {
        if (!form.codigoImportacion) {
            toast.error("Debes seleccionar un código de importación");
            return;
        }

        try {
            const { codigoImportacion, ...data } = form;
            const selectedProcess = eligibleProcesses.find((process) => process?._id === codigoImportacion);
            const existingPostembarque = selectedProcess?.postembarque || {};

            const payload = {
                blMaster: mergeTextValue(data.blMaster, existingPostembarque.blMaster),
                blHijo: mergeTextValue(data.blHijo, existingPostembarque.blHijo),
                tipoTransporte: mergeTextValue(data.tipoTransporte, existingPostembarque.tipoTransporte),
                companiaTransporte: mergeTextValue(
                    data.companiaTransporte,
                    existingPostembarque.companiaTransporte
                ),
                forwarder: mergeTextValue(data.forwarder, existingPostembarque.forwarder),
                fechaEstEmbarque:
                    data.fechaEstEmbarque?.toISOString() ||
                    existingPostembarque.fechaEstEmbarque ||
                    null,
                fechaRealEmbarque:
                    data.fechaRealEmbarque?.toISOString() ||
                    existingPostembarque.fechaRealEmbarque ||
                    null,
                fechaEstLlegadaPuerto:
                    data.fechaEstLlegadaPuerto?.toISOString() ||
                    existingPostembarque.fechaEstLlegadaPuerto ||
                    null,
                fechaRealLlegadaPuerto:
                    data.fechaRealLlegadaPuerto?.toISOString() ||
                    existingPostembarque.fechaRealLlegadaPuerto ||
                    null,
                numeroGuia: mergeTextValue(data.numeroGuia, existingPostembarque.numeroGuia),
                fechaRecepcionDocsOriginales:
                    data.fechaRecepcionDocsOriginales?.toISOString() ||
                    existingPostembarque.fechaRecepcionDocsOriginales ||
                    null,
                puertoEmbarque: mergeTextValue(data.puertoEmbarque, existingPostembarque.puertoEmbarque)
            };

            const url = `${process.env.REACT_APP_API_URL}/api/process/${codigoImportacion}/postembarque`;

            const res = await fetch(url, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Error al crear postembarque");

            const creado = await res.json();
            toast.success("Postembarque creado correctamente");

            if (onCreated) onCreated(creado);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error al crear postembarque");
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
                        Crear Postembarque
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box mt={3}>
                    {/* Código Importación */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="codigo-import-label">
                            Código Importación
                        </InputLabel>
                        <Select
                            labelId="codigo-import-label"
                            label="Código Importación"
                            name="codigoImportacion"
                            value={form.codigoImportacion}
                            onChange={handleChange}
                        >
                            {eligibleProcesses.map(p => (
                                <MenuItem key={p._id} value={p._id}>
                                    {buildProcessCodeLabel(p)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <Typography variant="h6" mb={2}>
                        Información de Postembarque
                    </Typography>

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
                            value={form.companiaTransporte}
                            onChange={handleChange}
                        >
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
                            value={form.forwarder}
                            onChange={handleChange}
                        >
                            {catalogos.FORWARDER.map(item => {
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
                            onChange={(v) => handleDateChange("fechaEstEmbarque", v)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="F. Real Embarque"
                            value={form.fechaRealEmbarque}
                            onChange={(v) => handleDateChange("fechaRealEmbarque", v)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="F. Est. Llegada Puerto"
                            value={form.fechaEstLlegadaPuerto}
                            onChange={(v) => handleDateChange("fechaEstLlegadaPuerto", v)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <DatePicker
                            label="F. Real Llegada Puerto"
                            value={form.fechaRealLlegadaPuerto}
                            onChange={(v) => handleDateChange("fechaRealLlegadaPuerto", v)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <TextField label="# Guía" name="numeroGuia" value={form.numeroGuia} onChange={handleChange} />

                        <DatePicker
                            label="F. Recepción Docs"
                            value={form.fechaRecepcionDocsOriginales}
                            onChange={(v) => handleDateChange("fechaRecepcionDocsOriginales", v)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <TextField
                            select
                            label="Puerto Embarque"
                            name="puertoEmbarque"
                            value={form.puertoEmbarque}
                            onChange={handleChange}
                        >
                            {catalogos.PUERTO_EMBARQUE.map(item => {
                                const value = getCatalogValue(item);
                                return (
                                    <MenuItem key={item._id || value} value={value}>
                                        {value}
                                    </MenuItem>
                                );
                            })}

                        </TextField>

                    </Stack>

                    <Box mt={5} textAlign="right">
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ borderRadius: "12px", paddingX: 4 }}
                            onClick={handleSubmit}
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
}
