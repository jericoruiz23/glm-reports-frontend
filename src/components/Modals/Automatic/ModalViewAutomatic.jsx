import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalViewAutomatic({ open, onClose, process }) {
    if (!open || !process) return null;

    const a = process.automatico || {};
    const codigoImportacion = process.codigoImportacion;

    const Row = ({ label, value }) => (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                py: 0.75,
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography
                variant="body2"
                fontWeight={500}
                textAlign="right"
            >
                {value ?? "-"}
            </Typography>
        </Box>
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 480, p: 3 }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6">
                        <b>Automático</b>
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Row label="Proceso" value={codigoImportacion} />
                <Row label="Status Aduana" value={a.proceso} />
                <Row
                    label="Tiempo Tránsito Internacional"
                    value={a.tiempoTransitoInternacional}
                />
                <Row
                    label="Días Lab Envío Electrónico - Salida Autorizada"
                    value={a.diasLabEnvioElectronicoSalidaAutorizada}
                />
                <Row
                    label="Días Lab ETA - Salida Autorizada"
                    value={a.diasLabEtaSalidaAutorizada}
                />
                <Row
                    label="Llegada Puerto - Despacho Puerto (Días Cal)"
                    value={a.diasCalLlegadaPuertoDespachoPuerto}
                />
                <Row
                    label="Bodega - Llegada Puerto (Días Cal)"
                    value={a.diasCalBodegaLlegadaPuerto}
                />
                <Row
                    label="Días Laborables Facturación"
                    value={a.diasLabFacturacion}
                />
                <Row
                    label="Rango Envío Electrónico - Salida"
                    value={a.rangoEnvioElectronicoSalida}
                />
                <Row
                    label="Rango ETA - Envío Electrónico"
                    value={a.rangoEtaEnvioElectronico}
                />
                <Row
                    label="Rango Carpetas"
                    value={a.rangoCarpetas}
                />
                <Row
                    label="Días Hábiles Real ETA - Envío Electrónico"
                    value={a.diasHabilesRealEtaEnvioElectronico}
                />
                <Row
                    label="Días Hábiles Real Envío - Desaduanización"
                    value={a.diasHabilesRealEnvioDesaduanizacion}
                />
                <Row
                    label="Observaciones Carpetas"
                    value={a.observacionesCarpetas}
                />
            </Box>
        </Drawer>
    );
}
