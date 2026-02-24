import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { sections, labels, catalogFieldMap } from "./controlimportSections";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

dayjs.extend(customParseFormat);

export default function ModalEditControlImport({
    open,
    onClose,
    selected,
    onUpdated,
}) {
    const [etapaKey, setEtapaKey] = useState("");
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [catalogos, setCatalogos] = useState({});
    const extraDateFields = [
        "notificacionBroker",
    ];

    const isCatalogField = (field) => !!catalogFieldMap[field];
    const fetchCatalogos = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/catalogos`,
                {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!res.ok) throw new Error("Error cargando catálogos");

            const data = await res.json();
            console.log("CATALOGOS =>", data);

            setCatalogos(data);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los catálogos");
        }
    };
    const getCatalogValue = (item) =>
        item.valor ?? item.nombre ?? item.descripcion ?? item.label ?? "";

    const getCatalogOptions = (field) => {
        const catalogKey = catalogFieldMap[field];
        if (!catalogKey) return [];

        const raw = catalogos?.[catalogKey];

        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw?.items)) return raw.items;

        return [];
    };

    useEffect(() => {
        if (open) {
            fetchCatalogos();
            setEtapaKey("");
            setFormData({});
        }
    }, [open]);

    useEffect(() => {
        if (!etapaKey || !selected) return;
        setFormData(selected[etapaKey] || {});
    }, [etapaKey, selected]);

    const etapa = sections.find((s) => s.key === etapaKey);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const isDateField = (field) =>
        field.toLowerCase().includes("fecha") ||
        extraDateFields.includes(field);


    const handleSubmit = async () => {
        if (!etapaKey) {
            toast.error("Selecciona una etapa");
            return;
        }

        try {
            setLoading(true);

            const normalizedData = {};

            Object.entries(formData).forEach(([key, value]) => {
                if (value === null || value === undefined) {
                    normalizedData[key] = null;
                }
                else if (dayjs.isDayjs(value)) {
                    normalizedData[key] = value
                        .hour(12)
                        .minute(0)
                        .second(0)
                        .millisecond(0)
                        .toDate();

                }
                else if (typeof value === "string" && value.trim() === "") {
                    normalizedData[key] = null;
                }
                else {
                    normalizedData[key] = value;
                }
            });

            const payload = {
                [etapaKey]: normalizedData,
            };

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${selected._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al actualizar etapa");

            const actualizado = await res.json();
            toast.success("Etapa actualizada correctamente");

            onUpdated?.(actualizado);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo actualizar la etapa");
        } finally {
            setLoading(false);
        }
    };

    if (!selected) return null;


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "40%",
                    maxWidth: "700px",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px",
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={700}>
                    Editar Etapa
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <TextField
                select
                fullWidth
                label="Etapa a editar"
                value={etapaKey}
                onChange={(e) => setEtapaKey(e.target.value)}
                sx={{ mb: 3 }}
            >
                {sections.map((section) => (
                    <MenuItem key={section.key} value={section.key}>
                        {section.title}
                    </MenuItem>
                ))}
            </TextField>

            {etapa && (
                <Box display="flex" flexDirection="column" gap={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        {etapa.fields.map((field) => {
                            const value = formData?.[field];

                            if (isCatalogField(field)) {
                                const options = getCatalogOptions(field);

                                return (
                                    <TextField
                                        key={field}
                                        select
                                        fullWidth
                                        label={labels[field] || field}
                                        value={value ?? ""}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                    >
                                        {options.map((opt) => (
                                            <MenuItem
                                                key={opt._id || opt.id || opt.valor}
                                                value={getCatalogValue(opt)}
                                            >
                                                {getCatalogValue(opt)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                );
                            }

                            if (isDateField(field)) {
                                const dayjsValue = value ? dayjs(value) : null;

                                return (
                                    <DatePicker
                                        key={field}
                                        label={labels[field] || field}
                                        value={dayjsValue}
                                        onChange={(newValue) => handleChange(field, newValue)}
                                        format="DD/MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                            },
                                        }}
                                    />
                                );
                            }
                            return (
                                <TextField
                                    key={field}
                                    label={labels[field] || field}
                                    value={value ?? ""}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    fullWidth
                                />
                            );
                        })}

                    </LocalizationProvider>

                </Box>
            )}

            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Guardar Cambios
                </Button>
            </Box>
        </Drawer>
    );
}
