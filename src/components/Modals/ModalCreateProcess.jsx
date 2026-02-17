import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    MenuItem,
    Chip,
    Stack,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ModalCreateProcessDrawer({ open, onClose, onCreated }) {

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "pendiente",
        owner: "",
        startDate: "",
        endDate: "",
        priority: "media",
        tags: [],
        documents: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [docInput, setDocInput] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addTag = () => {
        if (!tagInput.trim()) return;
        setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
        setTagInput("");
    };

    const addDocument = () => {
        if (!docInput.trim()) return;
        setForm({ ...form, documents: [...form.documents, docInput.trim()] });
        setDocInput("");
    };

    const handleSubmit = async () => {
        try {
            const newProceso = await api.post("/api/procesos", form);
            toast.success("Proceso creado correctamente");
            onCreated(newProceso);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo crear el proceso");
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
                    maxWidth: "900px",
                    backdropFilter: "blur(15px)",
                    background: "rgba(255, 255, 255, 1)",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px"
                }
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    Crear Proceso
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box mt={3}>
                {/* Información General */}
                <Typography variant="h6" mb={2}>Información General</Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Nombre del Proceso"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Descripción"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={2}
                    />

                    <TextField
                        label="Responsable"
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>

                {/* Configuración */}
                <Typography variant="h6" mt={4} mb={2}>Configuración</Typography>

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Estado"
                        name="status"
                        select
                        fullWidth
                        value={form.status}
                        onChange={handleChange}
                    >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="terminado">Terminado</MenuItem>
                    </TextField>

                    <TextField
                        label="Prioridad"
                        name="priority"
                        select
                        fullWidth
                        value={form.priority}
                        onChange={handleChange}
                    >
                        <MenuItem value="alta">Alta</MenuItem>
                        <MenuItem value="media">Media</MenuItem>
                        <MenuItem value="baja">Baja</MenuItem>
                    </TextField>
                </Stack>

                {/* Fechas */}
                <Typography variant="h6" mt={4} mb={2}>Fechas</Typography>

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Fecha Inicio"
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Fecha Fin"
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Stack>

                {/* Tags */}
                <Typography variant="h6" mt={4} mb={1}>Tags</Typography>

                <Stack direction="row" spacing={1}>
                    <TextField
                        label="Agregar tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <Button variant="contained" onClick={addTag}>Añadir</Button>
                </Stack>

                <Box mt={1} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {form.tags.map((tag, i) => (
                        <Chip
                            key={i}
                            label={tag}
                            color="primary"
                            onDelete={() =>
                                setForm({
                                    ...form,
                                    tags: form.tags.filter((t) => t !== tag),
                                })
                            }
                        />
                    ))}
                </Box>

                {/* Documentos */}
                <Typography variant="h6" mt={4} mb={1}>Documentos</Typography>

                <Stack direction="row" spacing={1}>
                    <TextField
                        label="Nombre archivo"
                        value={docInput}
                        onChange={(e) => setDocInput(e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <Button variant="outlined" onClick={addDocument}>Añadir</Button>
                </Stack>

                <Box mt={1} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {form.documents.map((doc, i) => (
                        <Chip
                            key={i}
                            label={doc}
                            onDelete={() =>
                                setForm({
                                    ...form,
                                    documents: form.documents.filter((d) => d !== doc),
                                })
                            }
                        />
                    ))}
                </Box>

                {/* Botón Guardar */}
                <Box mt={5} textAlign="right">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ borderRadius: "12px", paddingX: 4 }}
                        onClick={handleSubmit}
                    >
                        Crear Proceso
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
