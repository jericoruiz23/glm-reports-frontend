// src/components/Modals/Customs/ModalCreateCustoms.jsx
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

import {
    buildProcessCodeLabel,
    getStageCandidates,
    mergeTextValue,
    toDateObject,
} from "../../../utils/stageCreateHelpers";

const initialForm = {
    codigoImportacionId: "",
    fechaEnvioElectronico: null,
    fechaPagoLiquidacion: null,
    fechaSalidaAutorizada: null,
    tipoAforo: "",
    refrendo: "",
    numeroEntregaEcuapass: "",
    numeroLiquidacion: "",
    numeroCdaAutorizacion: "",
    numeroCarga: "",
    statusAduana: ""
};

export default function ModalCreateCustoms({ open, onClose, onCreated, procesos = [] }) {
    const [form, setForm] = useState(initialForm);

    const [tipoAforoCatalogo, setTipoAforoCatalogo] = useState([]);
    const eligibleProcesses = getStageCandidates(procesos, "postembarque", "aduana");
    const buildFormFromProcess = (processId, process) => {
        const aduana = process?.aduana || {};

        return {
            ...initialForm,
            codigoImportacionId: processId || "",
            fechaEnvioElectronico: toDateObject(aduana.fechaEnvioElectronico),
            fechaPagoLiquidacion: toDateObject(aduana.fechaPagoLiquidacion),
            fechaSalidaAutorizada: toDateObject(aduana.fechaSalidaAutorizada),
            tipoAforo: aduana.tipoAforo || "",
            refrendo: aduana.refrendo || "",
            numeroEntregaEcuapass: aduana.numeroEntregaEcuapass || "",
            numeroLiquidacion: aduana.numeroLiquidacion || "",
            numeroCdaAutorizacion: aduana.numeroCdaAutorizacion || "",
            numeroCarga: aduana.numeroCarga || "",
            statusAduana: aduana.statusAduana || ""
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "codigoImportacionId") {
            const selectedProcess = eligibleProcesses.find((process) => process?._id === value);
            setForm(buildFormFromProcess(value, selectedProcess));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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


    const handleSubmit = async () => {
        if (!form.codigoImportacionId) {
            toast.error("Debes seleccionar un código de importación");
            return;
        }

        try {
            const { codigoImportacionId, ...aduanaData } = form;
            const selectedProcess = eligibleProcesses.find((process) => process?._id === codigoImportacionId);
            const existingAduana = selectedProcess?.aduana || {};

            const payload = {
                tipoAforo: mergeTextValue(aduanaData.tipoAforo, existingAduana.tipoAforo),
                refrendo: mergeTextValue(aduanaData.refrendo, existingAduana.refrendo),
                numeroEntregaEcuapass: mergeTextValue(
                    aduanaData.numeroEntregaEcuapass,
                    existingAduana.numeroEntregaEcuapass
                ),
                numeroLiquidacion: mergeTextValue(
                    aduanaData.numeroLiquidacion,
                    existingAduana.numeroLiquidacion
                ),
                numeroCdaAutorizacion: mergeTextValue(
                    aduanaData.numeroCdaAutorizacion,
                    existingAduana.numeroCdaAutorizacion
                ),
                numeroCarga: mergeTextValue(aduanaData.numeroCarga, existingAduana.numeroCarga),
                statusAduana: mergeTextValue(aduanaData.statusAduana, existingAduana.statusAduana),
                fechaEnvioElectronico: aduanaData.fechaEnvioElectronico
                    ? aduanaData.fechaEnvioElectronico.toISOString()
                    : existingAduana.fechaEnvioElectronico || null,
                fechaPagoLiquidacion: aduanaData.fechaPagoLiquidacion
                    ? aduanaData.fechaPagoLiquidacion.toISOString()
                    : existingAduana.fechaPagoLiquidacion || null,
                fechaSalidaAutorizada: aduanaData.fechaSalidaAutorizada
                    ? aduanaData.fechaSalidaAutorizada.toISOString()
                    : existingAduana.fechaSalidaAutorizada || null,
            };

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${codigoImportacionId}/aduana`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar Aduana");

            const actualizado = await res.json();
            toast.success("Aduana registrada correctamente");
            if (onCreated) onCreated(actualizado);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error al registrar Aduana");
        }
    };
    const getCatalogValue = (item) =>
        item.valor ?? item.nombre ?? item.descripcion ?? item.label ?? "";


    useEffect(() => {
        if (open) {
            fetchTipoAforo();
            setForm(initialForm);
        }
    }, [open]);

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
                        background: "white",
                        padding: "2rem",
                        borderRadius: "20px 0 0 20px"
                    }
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={600}>
                        Crear Aduana
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box mt={3}>
                    {/* Select Código Importación */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="codigo-import-label">
                            Código Importación
                        </InputLabel>
                        <Select
                            labelId="codigo-import-label"
                            label="Código Importación"
                            name="codigoImportacionId"
                            value={form.codigoImportacionId}
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
                        Información Aduana
                    </Typography>

                    <Stack spacing={2}>
                        <DatePicker
                            label="Fecha Envío Electrónico"
                            value={form.fechaEnvioElectronico}
                            onChange={(v) => handleDateChange("fechaEnvioElectronico", v)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <DatePicker
                            label="Fecha Pago Liquidación"
                            value={form.fechaPagoLiquidacion}
                            onChange={(v) => handleDateChange("fechaPagoLiquidacion", v)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />

                        <DatePicker
                            label="Fecha Salida Autorizada"
                            value={form.fechaSalidaAutorizada}
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
