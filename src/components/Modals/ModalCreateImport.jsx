// src/components/Modals/ModalCreateImport.jsx
import React, { useEffect, useState } from "react";
import {
    Drawer, Box, Typography, IconButton, TextField, Stack, Button, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";

// Utils
const getISOWeek = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

// Opciones estáticas
const ORIGINS = ["China", "Ecuador", "EEUU", "México", "Colombia", "Brasil", "Chile", "Perú", "Panamá", "España", "Italia", "Alemania", "India", "Vietnam", "Tailandia", "Indonesia"];
const DESTINATIONS = ["Ecuador", "Colombia", "Perú", "Chile", "Brasil", "México", "Panamá", "Costa Rica", "Guatemala", "EEUU"];
const STATUS_OPTIONS = ["Concluido", "Tránsito", "Por despachar origen", "Transito origen"];
const MOT_OPTIONS = ["Marítimo", "Aéreo"];
const IMPORT_TYPES = ["COM", "CAM"];
const IMPORT_CATEGORIES = ["10", "20"];

export default function ModalCreateImport({ open, onClose, onCreated }) {
    const currentYear = new Date().getFullYear();
    const [forwarders, setForwarders] = useState([]);
    const [lastConsecutive, setLastConsecutive] = useState("");
    const [form, setForm] = useState({
        importType: "COM",
        importCategory: "10",
        status: "",
        origin: "",
        destination: "",
        code: "",
        description: "",
        quintalesRequested: "",
        cajasRequested: "",
        quintalesSent: "",
        cajasSent: "",
        forwarder: "",
        mot: "Marítimo",
        container: "",
        invoiceNumber: "",
        purchaseOrder: "",
        solicitudDate: "",
        facturaDate: "",
        weeksBilling: "",
        etd: "",
        etdWeek: "",
        etaTentative: "",
        etaReal: "",
        etaWeek: "",
        ingWHS: "",
        transitTime: "",
        ltWarehouse: "",
        notes: "",
    });

    // Fetch forwarders y consecutivo
    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchForwarders = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/imports/options`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                setForwarders(Array.isArray(data.forwarders) ? data.forwarders : []);
            } catch {
                setForwarders([{ value: "FWD-A", label: "Forwarder A" }, { value: "FWD-B", label: "Forwarder B" }]);
            }
        };
        const fetchConsecutive = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/imports/last?importType=${form.importType}&importCategory=${form.importCategory}&year=${currentYear}`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                setLastConsecutive(data.nextConsecutive || "001");
            } catch {
                setLastConsecutive("001");
            }
        };
        fetchForwarders();
        fetchConsecutive();
    }, [form.importType, form.importCategory, currentYear]);

    // Actualizar semanas automáticamente
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            weeksBilling: prev.facturaDate ? getISOWeek(prev.facturaDate) : "",
            etdWeek: prev.etd ? getISOWeek(prev.etd) : "",
            etaWeek: prev.etaReal ? getISOWeek(prev.etaReal) : (prev.etaTentative ? getISOWeek(prev.etaTentative) : "")
        }));
    }, [form.facturaDate, form.etd, form.etaReal, form.etaTentative]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/imports`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, year: currentYear, consecutive: lastConsecutive })
            });
            if (!res.ok) throw new Error((await res.json()).message || "Error creación import");
            const nuevo = await res.json();
            toast.success("Importación creada");
            onCreated(nuevo);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    // Helper para inputs y selects
    const renderTextField = (label, name, type = "text", fullWidth = true, props = {}) => (
        <TextField label={label} name={name} value={form[name]} onChange={handleChange} type={type} fullWidth={fullWidth} {...props} />
    );

    const renderSelect = (label, name, optionsArray) => (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select name={name} value={form[name]} onChange={handleChange}>
                {optionsArray.map(opt => typeof opt === "string" ? <MenuItem key={opt} value={opt}>{opt}</MenuItem> : <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
        </FormControl>
    );

    return (
        <>
            <Toaster position="top-center" toastOptions={{ style: { fontSize: "15px", padding: "12px 16px" } }} />
            <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: "100%", maxWidth: "900px", backdropFilter: "blur(15px)", background: "rgba(255,255,255,1)", padding: "2rem", borderRadius: "20px 0 0 20px" } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={600}>Crear Importación</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                <Box mt={3}>
                    <Typography variant="h6" mb={2}>Código de Importación</Typography>
                    <Stack spacing={2} direction="row" width="100%">
                        {renderSelect("Tipo", "importType", IMPORT_TYPES)}
                        {renderSelect("Código BB", "importCategory", IMPORT_CATEGORIES)}
                        <TextField label="Año" value={currentYear} disabled fullWidth />
                        <TextField label="Consecutivo" value={lastConsecutive} disabled fullWidth />
                    </Stack>

                    <Typography sx={{ mt: 1 }} variant="body2" color="gray">El código final se generará automáticamente al guardar.</Typography>

                    <Typography variant="h6" mt={4} mb={2}>Información General</Typography>
                    <Stack spacing={2} direction="row">
                        {renderSelect("Status", "status", STATUS_OPTIONS)}
                        {renderSelect("Origen", "origin", ORIGINS)}
                        {renderSelect("Destino", "destination", DESTINATIONS)}
                    </Stack>

                    <Typography variant="h6" mt={4} mb={2}>Cantidades</Typography>
                    <Stack spacing={2} direction="row">
                        {renderTextField("Quintales solicitados", "quintalesRequested", "number", true, { inputProps: { step: "0.01" } })}
                        {renderTextField("N° Cajas solicitadas", "cajasRequested")}
                        {renderTextField("Quintales despachados", "quintalesSent", "number", true, { inputProps: { step: "0.01" } })}
                        {renderTextField("N° Cajas despachadas", "cajasSent")}
                    </Stack>

                    <Typography variant="h6" mt={4} mb={2}>Descripción</Typography>
                    {renderTextField("Descripción", "description", "text", true, { multiline: true, minRows: 3 })}

                    <Typography variant="h6" mt={4} mb={2}>Logística</Typography>
                    <Stack spacing={2} direction="row">
                        {renderSelect("Forwarder", "forwarder", forwarders)}
                        {renderSelect("MOT", "mot", MOT_OPTIONS)}
                        {renderTextField("Contenedor", "container")}
                    </Stack>

                    <Typography variant="h6" mt={4} mb={2}>Documentos</Typography>
                    <Stack spacing={2}>
                        {renderTextField("N° Factura", "invoiceNumber")}
                        {renderTextField("N° Orden de compra", "purchaseOrder")}
                    </Stack>

                    <Typography variant="h6" mt={4} mb={2}>Fechas</Typography>
                    <Stack spacing={2} direction="row">
                        {renderTextField("Fecha de solicitud", "solicitudDate", "date", true, { InputLabelProps: { shrink: true } })}
                        {renderTextField("Fecha de factura", "facturaDate", "date", true, { InputLabelProps: { shrink: true } })}
                    </Stack>
                    <Stack spacing={2} direction="row" mt={2}>
                        {renderTextField("ETD", "etd", "date", true, { InputLabelProps: { shrink: true } })}
                        {renderTextField("ETA Tentativo", "etaTentative", "date", true, { InputLabelProps: { shrink: true } })}
                        {renderTextField("ETA Real", "etaReal", "date", true, { InputLabelProps: { shrink: true } })}
                    </Stack>
                    <Stack spacing={2} direction="row" mt={2}>
                        {renderTextField("Weeks facturación (auto)", "weeksBilling", "text", true, { disabled: true })}
                        {renderTextField("Week ETD (auto)", "etdWeek", "text", true, { disabled: true })}
                        {renderTextField("Week ETA Puerto (auto)", "etaWeek", "text", true, { disabled: true })}
                    </Stack>

                    <Typography variant="h6" mt={4} mb={2}>Otros</Typography>
                    <Stack spacing={2} direction="row">
                        {renderTextField("Fecha de ingreso bodega", "ingWHS", "date", true, { InputLabelProps: { shrink: true } })}
                        {renderTextField("Transit time port to port (days)", "transitTime")}
                        {renderTextField("LT hasta almacén", "ltWarehouse")}
                    </Stack>

                    <Typography variant="h6" mt={4} mb={2}>Observaciones</Typography>
                    {renderTextField("Observaciones", "notes", "text", true, { multiline: true, minRows: 3 })}

                    <Box mt={5} textAlign="right">
                        <Button variant="contained" size="large" sx={{ borderRadius: "12px", px: 4 }} onClick={handleSubmit}>Guardar</Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
