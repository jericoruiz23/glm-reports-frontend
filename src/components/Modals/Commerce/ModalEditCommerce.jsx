import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    Grid,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { celdasExcel } from "./CommerceOptions";

/* ================= HELPERS ================= */

const isDateField = (header) =>
    header.toLowerCase().includes("fecha") ||
    header.toLowerCase().includes("eta") ||
    header.toLowerCase().includes("etd");

const getValueByPath = (obj, path) =>
    path?.split(".").reduce((acc, key) => acc?.[key], obj);

const setValueByPath = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);
    target[lastKey] = value;
};

/* ================= GROUPING ================= */

const STAGES = {
    ITEM: "Item",
    PREEMBARQUE: "Preembarque",
    POSTEMBARQUE: "Postembarque",
    DESPACHO: "Despacho",
    AUTOMATICO: "Automático",
};

const getStageFromPath = (path = "") => {
    if (path.startsWith("preembarque.items")) return STAGES.ITEM;
    if (path.startsWith("preembarque")) return STAGES.PREEMBARQUE;
    if (path.startsWith("postembarque")) return STAGES.POSTEMBARQUE;
    if (path.startsWith("despacho")) return STAGES.DESPACHO;
    if (path.startsWith("automatico")) return STAGES.AUTOMATICO;
    return null;
};

/* ================= COMPONENT ================= */

export default function ModalEditCommerce({ open, onClose, selected, onUpdated }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !selected) return;

        const initial = {};

        celdasExcel.forEach(({ path, header }) => {
            if (!path) return;

            const stage = getStageFromPath(path);
            if (!stage) return;

            let source;
            let readPath = path;

            if (stage === STAGES.ITEM) {
                source = selected.item;
                readPath = path.replace("preembarque.items.", "");
            } else {
                source = selected.registro;
            }

            const raw = getValueByPath(source, readPath);

            // 🔥 CORRECCIÓN: No usamos dayjs(raw) aquí.
            // Si es fecha, guardamos el string o Date nativo.
            // Si usamos dayjs() aquí, structuredClone lo romperá después.
            const value = isDateField(header)
                ? (raw ? new Date(raw) : null)
                : raw ?? "";

            setValueByPath(initial, path, value);
        });

        setFormData(initial);
    }, [open, selected]);



    const getGridSize = (header = "") => {
        const h = header.toLowerCase();

        if (h.includes("descripcion") || h.includes("observacion"))
            return { xs: 12 };

        if (h.includes("fecha") || h.includes("eta") || h.includes("etd"))
            return { xs: 12, sm: 6, md: 4 };

        if (h.includes("codigo") || h.includes("número") || h.includes("cantidad"))
            return { xs: 12, sm: 6, md: 3 };

        return { xs: 12, sm: 6, md: 4 };
    };

    const handleChange = (path, value) => {
        let valToSave = value;

        if (value && typeof value === 'object' && value.toDate) {
            valToSave = value.toDate();
        }

        setFormData((prev) => {
            const copy = structuredClone(prev);
            setValueByPath(copy, path, valToSave);
            return copy;
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = structuredClone(formData);

            // 1. Procesar Fechas (Tu lógica actual está bien)
            celdasExcel.forEach(({ path, header }) => {
                if (!path) return;
                if (!isDateField(header)) return;

                const val = getValueByPath(payload, path);
                if (val && dayjs.isDayjs(val)) {
                    // Asegúrate de usar .toISOString() o .toDate()
                    setValueByPath(payload, path, val.toDate());
                }
            });

            // 2. 🔥 AGREGADO CRÍTICO: Enviar el ID del Item si estamos editando un item
            // Esto le dice al backend CUAL item del array actualizar
            if (selected?.item?._id) {
                payload.itemId = selected.item._id;
            }

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/${selected.registro._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error al guardar");

            const updated = await res.json();
            onUpdated?.(updated);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron guardar los cambios");
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
                    width: "60%",
                    padding: "2.5rem",
                },
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" mb={4}>
                <Typography variant="h4" fontWeight={700}>
                    Editar Proceso Comercial
                </Typography>

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {Object.values(STAGES).map((stage) => {
                    const isReadOnly = stage === STAGES.AUTOMATICO;

                    let fields = celdasExcel.filter(
                        (c) => c.path && getStageFromPath(c.path) === stage
                    );

                    if (!fields.length) return null;

                    return (
                        <Box key={stage} mb={5}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                                sx={{ textTransform: "uppercase" }}
                            >
                                {stage}
                            </Typography>

                            <Grid container spacing={3}>
                                {fields.map(({ header, path }) => {
                                    const value = getValueByPath(formData, path);

                                    return (
                                        <Grid item {...getGridSize(header)} key={path}>
                                            {isDateField(header) ? (
                                                <DatePicker
                                                    label={header}
                                                    value={value ? dayjs(value) : null}
                                                    onChange={(v) => handleChange(path, v)}
                                                    disabled={isReadOnly}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            ) : (
                                                <TextField
                                                    label={header}
                                                    value={value ?? ""}
                                                    onChange={(e) => handleChange(path, e.target.value)}
                                                    fullWidth
                                                    disabled={isReadOnly}
                                                />
                                            )}
                                        </Grid>
                                    );
                                })}

                            </Grid>

                            <Divider sx={{ mt: 4 }} />
                        </Box>
                    );
                })}
            </LocalizationProvider>

            {/* Actions */}
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