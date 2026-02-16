// src/components/Modals/Preshipment/ModalCreatePreshipment.jsx
import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

export default function ModalCreatePreshipment({ open, onClose, onCreated, procesos = [] }) {
    const [form, setForm] = useState({
        procesoId: "",
        paisOrigen: "",
        fechaFactura: "",
        valorFactura: "",
        formaPago: "",
        cantidad: "",
        um: "",
        entidadEmisoraDcp: "",
        numeroPermisoLicencia: "",
        incoterms: "",
        cartaAclaratoria: "",
        certificadoOrigen: "",
        listaEmpaque: "",
        cartaGastos: "",
        paisProcedencia: "",
    });

    const paises = [
        "POLONIA", "BRASIL", "ITALIA", "MEXICO", "ARGENTINA", "SAN MARINO",
        "COLOMBIA", "FRANCIA", "ESTADOS UNIDOS", "TURQUIA", "JAPON", "GUATEMALA",
        "BELGICA", "VARIOS", "SUIZA", "REINO UNIDO", "ESLOVENIA", "CANADA",
        "AUSTRALIA", "ALEMANIA", "IRLANDA", "VIET NAM"
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        // Mostrar el codigoImportacion del proceso seleccionado
        if (e.target.name === "procesoId") {
            const selected = procesos.find(p => p._id === e.target.value);
            console.log("Proceso seleccionado:", selected?.inicio?.codigoImportacion);
        }
    };

    const handleSubmit = async () => {
        if (!form.procesoId) {
            toast.error("Debes seleccionar un proceso");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/preshipments`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.status === 401) {
                toast.error("Sesión expirada. Vuelve a iniciar sesión.");
                return;
            }

            if (!res.ok) throw new Error("Error al crear preembarque");

            const nuevo = await res.json();
            toast.success("Preembarque creado");
            onCreated(nuevo); // Actualiza la tabla
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error al crear preembarque");
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
                    backdropFilter: "blur(15px)",
                    background: "rgba(255,255,255,1)",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px"
                }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>Crear Pre-Embarque</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </Box>

            <Box mt={3} maxHeight="80vh" overflow="auto">
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        select
                        name="procesoId"
                        value={form.procesoId || ""}
                        onChange={handleChange}
                        SelectProps={{ native: true }}
                        fullWidth
                    >
                        <option value="">Seleccionar Proceso</option>
                        {procesos.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.inicio?.codigoImportacion || p._id}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        select
                        name="paisOrigen"
                        value={form.paisOrigen || ""}
                        onChange={handleChange}
                        SelectProps={{ native: true }}
                        fullWidth
                    >
                        <option value="">País Origen</option>
                        {paises.map(pais => (
                            <option key={pais} value={pais}>{pais}</option>
                        ))}
                    </TextField>
                </Stack>

                {/* Resto de campos */}
                <TextField label="Fecha Factura" name="fechaFactura" type="date" value={form.fechaFactura} onChange={handleChange} fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                <TextField label="Valor Factura" name="valorFactura" type="number" value={form.valorFactura} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField select name="formaPago" value={form.formaPago || ""} onChange={handleChange} SelectProps={{ native: true }} fullWidth sx={{ mb: 2 }}>
                    <option value="">Método de pago</option>
                    <option value="CREDITO">CREDITO</option>
                    <option value="IMPORTACION QUE NO GENERA PAGO AL EXTERIOR">IMPORTACION QUE NO GENERA PAGO AL EXTERIOR</option>
                </TextField>
                <TextField label="Cantidad" name="cantidad" type="number" value={form.cantidad} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="UM" name="um" value={form.um} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

                <TextField label="Entidad Emisora DCP" name="entidadEmisoraDcp" value={form.entidadEmisoraDcp} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Número Permiso / Licencia" name="numeroPermisoLicencia" value={form.numeroPermisoLicencia} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Incoterms" name="incoterms" value={form.incoterms} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Carta Aclaratoria" name="cartaAclaratoria" value={form.cartaAclaratoria} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Certificado de Origen" name="certificadoOrigen" value={form.certificadoOrigen} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Lista de Empaque" name="listaEmpaque" value={form.listaEmpaque} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Carta de Gastos" name="cartaGastos" value={form.cartaGastos} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="País Procedencia" name="paisProcedencia" value={form.paisProcedencia} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

                <Box mt={5} textAlign="right">
                    <Button variant="contained" color="primary" size="large" sx={{ borderRadius: "12px", paddingX: 4 }} onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
