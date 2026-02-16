// src/components/Modals/ModalViewBill.jsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Stack,
    Button,
    Divider,
    Box,
    Grid,
} from "@mui/material";

export default function ModalViewBill({ open, onClose, data }) {
    if (!data) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 2, backgroundColor: "#ffffffff" } }}>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: 20 }}>Detalle del registro: {data.codigo ?? "-"} </DialogTitle>
            <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>

                {/* Datos Generales */}
                <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>Datos de Factura</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Código</Typography>
                            <Typography variant="body1">{data.codigo ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Descripción</Typography>
                            <Typography variant="body1">{data.descripcion ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Origen</Typography>
                            <Typography variant="body1">{data.origen ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Destino</Typography>
                            <Typography variant="body1">{data.destino ?? "-"}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Cantidades y entrega */}
                <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>Cantidades y Entrega</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Quintales Solicitados</Typography>
                            <Typography variant="body1">{data.quintalesSolicitados ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Cajas Solicitadas</Typography>
                            <Typography variant="body1">{data.cajasSolicitados ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Semana de Entrega</Typography>
                            <Typography variant="body1">{data.semanaEntrega ?? "-"}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Pesos y logística */}
                <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>Pesos y Logística</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Marca</Typography>
                            <Typography variant="body1">{data.marca ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">SKU</Typography>
                            <Typography variant="body1">{data.sku ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Peso Neto (Kg)</Typography>
                            <Typography variant="body1">{data.pesoNetoKg ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Pallets</Typography>
                            <Typography variant="body1">{data.pallets ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Quintales Requeridos</Typography>
                            <Typography variant="body1">{data.quintalesRequeridos ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Cajas Requeridas</Typography>
                            <Typography variant="body1">{data.cajasRequeridas ?? "-"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Etapa Completada</Typography>
                            <Typography variant="body1">{data.stepCompleted ?? "-"}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Fechas y estado */}
                <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>Fechas y Estado</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Fecha de Creación</Typography>
                            <Typography variant="body1">{new Date(data.createdAt).toLocaleString()}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">Última Actualización</Typography>
                            <Typography variant="body1">{new Date(data.updatedAt).toLocaleString()}</Typography>
                        </Box>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={onClose} variant="contained" color="primary">Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
