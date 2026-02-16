import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

export default function ModalProcesoDetalle({ open, onClose, proceso }) {
    if (!proceso) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{ fontWeight: "bold", fontSize: "1.4rem", pb: 1 }}
            >
                Detalles del Proceso
            </DialogTitle>

            <DialogContent dividers>
                {/* TÍTULO PRINCIPAL */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {proceso.name}
                </Typography>

                {/* GRID DE INFORMACIÓN */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">Descripción</Typography>
                            <Typography>{proceso.description || "—"}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2">Responsable</Typography>
                            <Typography>{proceso.owner || "—"}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2">Estado</Typography>
                            <Chip
                                label={proceso.status}
                                color={
                                    proceso.status === "activo"
                                        ? "success"
                                        : proceso.status === "pendiente"
                                            ? "warning"
                                            : "default"
                                }
                                size="small"
                                sx={{ mt: 1 }}
                            />

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2">Prioridad</Typography>
                            <Chip
                                label={proceso.priority}
                                color={
                                    proceso.priority === "alta"
                                        ? "error"
                                        : proceso.priority === "media"
                                            ? "warning"
                                            : "default"
                                }
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">Fecha de Inicio</Typography>
                            <Typography>
                                {proceso.startDate
                                    ? new Date(proceso.startDate).toLocaleString()
                                    : "—"}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2">Fecha de Fin</Typography>
                            <Typography>
                                {proceso.endDate
                                    ? new Date(proceso.endDate).toLocaleString()
                                    : "—"}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2">Tags</Typography>
                            <div style={{ marginTop: 8 }}>
                                {proceso.tags?.length
                                    ? proceso.tags.map((t, i) => (
                                        <Chip
                                            key={i}
                                            label={t}
                                            size="small"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))
                                    : "—"}
                            </div>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2">Documentos</Typography>
                            <ul style={{ marginTop: 8 }}>
                                {proceso.documents?.length
                                    ? proceso.documents.map((d, i) => (
                                        <li key={i}>{d}</li>
                                    ))
                                    : "—"}
                            </ul>
                        </Paper>
                    </Grid>
                </Grid>

                {/* COMENTARIOS */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Comentarios
                </Typography>

                {proceso.comments?.length ? (
                    proceso.comments.map((c, i) => (
                        <Paper
                            key={i}
                            elevation={0}
                            sx={{
                                p: 2,
                                mb: 2,
                                border: "1px solid #eee",
                                borderRadius: 2,
                            }}
                        >
                            <Typography fontWeight="bold">{c.user}</Typography>
                            <Typography>{c.comment}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(c.date).toLocaleString()}
                            </Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography color="text.secondary">No hay comentarios</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
