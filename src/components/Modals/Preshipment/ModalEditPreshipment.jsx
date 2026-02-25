// src/components/Modals/Preshipment/ModalEditPreshipment.jsx
import React, { useState, useEffect } from "react";
import { Drawer, Tabs, Tab, Box, Button, TextField, MenuItem } from "@mui/material";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "../../../services/api";

/* =========================
   FORM BASE
========================= */
const emptyForm = {
    _id: "",
    paisOrigen: "",
    fechaFactura: "",
    valorFactura: "",
    formaPago: "",
    cantidad: "",
    um: "",
    entidadEmisoraDcp: "",
    numeroPermisoImportacion: "",
    fechaSolicitudRegimen: "",
    cartaReg21: "",
    fechaSolicitudGarantia: "",
    aseguradora: "",
    numeroGarantia: "",
    montoAsegurado: "",
    fechaInicioGarantia: "",
    fechaFinGarantia: "",
    numeroCdaGarantia: "",
    fechaEnvioPoliza: "",
    fechaRecepcionDocumentoOriginal: "",
    numeroPoliza: "",
    incoterms: "",
    fechaRecolectEstimada: "",
    fechaRecolectProveedor: "",
    fechaRecolectReal: "",
    fechaReqBodega: "",
    fechaMaxReqBodega: "",
    cartaAclaratoria: "",
    certificadoOrigen: "",
    listaEmpaque: "",
    cartaGastos: "",
    paisProcedencia: "",
};


export default function ModalEditPreshipment({
    open,
    onClose,
    data,
    onUpdated,
    onDeleted,
}) {
    const [tab, setTab] = useState(0);
    const [form, setForm] = useState(emptyForm);
    const [catalogos, setCatalogos] = useState({
        PAIS_ORIGEN: [],
        FORMAS_PAGO: [],
        UNIDADES_METRICAS: [],
        DCP: [],
        ASEGURADORA: [],
        INCOTERMS: [],
        PAIS_PROCEDENCIA: [],
    });


    const formatDate = (date) => {
        if (!date) return "";
        const parsed = dayjs(date);
        return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
    };



    useEffect(() => {
        if (!open) return;

        const fetchCatalogos = async () => {
            try {
                const data = await api.get("/api/catalogos");
                console.log(data, "catalogos edit preshipment");

                setCatalogos({
                    PAIS_ORIGEN: data.PAIS_ORIGEN || [],
                    FORMAS_PAGO: data.FORMAS_PAGO || [],
                    UNIDADES_METRICAS: data.UNIDADES_METRICAS || [],
                    DCP: data.DCP || [],
                    ASEGURADORA: data.ASEGURADORA || [],
                    INCOTERMS: data.INCOTERMS || [],
                    PAIS_PROCEDENCIA: data.PAIS_PROCEDENCIA || [],
                });
            } catch (err) {
                console.error(err);
                toast.error("No se pudieron cargar los catálogos");
            }
        };

        fetchCatalogos();
    }, [open]);

    useEffect(() => {
        if (open && data) {
            const preembarqueData = data?.preembarque ?? data;
            setForm({
                ...emptyForm,
                ...preembarqueData,
                _id: data?._id || preembarqueData?._id || "",
                fechaFactura: formatDate(preembarqueData.fechaFactura),
                fechaSolicitudRegimen: formatDate(preembarqueData.fechaSolicitudRegimen),
                fechaSolicitudGarantia: formatDate(preembarqueData.fechaSolicitudGarantia),
                fechaInicioGarantia: formatDate(preembarqueData.fechaInicioGarantia),
                fechaFinGarantia: formatDate(preembarqueData.fechaFinGarantia),
                fechaEnvioPoliza: formatDate(preembarqueData.fechaEnvioPoliza),
                fechaRecepcionDocumentoOriginal: formatDate(preembarqueData.fechaRecepcionDocumentoOriginal),
                fechaRecolectEstimada: formatDate(preembarqueData.fechaRecolectEstimada),
                fechaRecolectProveedor: formatDate(preembarqueData.fechaRecolectProveedor),
                fechaRecolectReal: formatDate(preembarqueData.fechaRecolectReal),
                fechaReqBodega: formatDate(preembarqueData.fechaReqBodega),
                fechaMaxReqBodega: formatDate(preembarqueData.fechaMaxReqBodega),
            });
        }
    }, [open, data]);



    /* =========================
       HANDLERS
    ========================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ["valorFactura", "cantidad", "montoAsegurado"];

        setForm((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) : value,
        }));
    };

    /* =========================
       DELETE
    ========================= */
    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de eliminar este pre-embarque?")) return;

        try {
            await api.del(`/api/process/${form._id}`);

            toast.success("Pre-embarque eliminado");
            onDeleted?.(form._id);
            onClose();
        } catch {
            toast.error("No se pudo eliminar el pre-embarque");
        }
    };

    /* =========================
       SAVE
    ========================= */
    const handleSave = async (stage) => {
        try {
            if (!form._id) {
                toast.error("ID del proceso inválido");
                return;
            }

            let stageFields = {};

            if (stage === "preembarque") {
                stageFields = { ...form };
                delete stageFields._id;
            }

            const updated = await api.patch(`/api/process/${form._id}/${stage}`, stageFields);
            toast.success("Pre-embarque actualizado");
            onUpdated?.(updated);
            onClose();
        } catch {
            toast.error("No se pudo actualizar el pre-embarque");
        }
    };

    /* =========================
       RENDER
    ========================= */
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "100%",
                    maxWidth: "700px",
                    padding: "2rem",
                    borderRadius: "20px 0 0 20px",
                },
            }}
        >
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                <Tab label="Información General" />
                <Tab label="Fechas" />
                <Tab label="Documentos" />
            </Tabs>

            {/* INFO GENERAL */}
            <Box hidden={tab !== 0} mt={2}>
                <TextField
                    select
                    fullWidth
                    label="País Origen"
                    name="paisOrigen"
                    value={form.paisOrigen || ""}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {catalogos.PAIS_ORIGEN.map(p => {
                        const value = p.valor ?? p.nombre ?? p.label ?? "";
                        return (
                            <MenuItem key={p._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>


                <TextField fullWidth type="number" label="Valor Factura" name="valorFactura" value={form.valorFactura} onChange={handleChange} sx={{ mb: 2 }}>
                    {catalogos.FORMAS_PAGO.map(fp => {
                        const value = fp.valor ?? fp.nombre ?? "";
                        return (
                            <MenuItem key={fp._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>


                <TextField fullWidth type="number" label="Cantidad" name="cantidad" value={form.cantidad} onChange={handleChange} sx={{ mb: 2 }}>
                    {catalogos.UNIDADES_METRICAS.map(u => {
                        const value = u.valor ?? u.nombre ?? "";
                        return (
                            <MenuItem key={u._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>


                <TextField
                    select
                    fullWidth
                    label="Entidad Emisora DCP"
                    name="entidadEmisoraDcp"
                    value={form.entidadEmisoraDcp || ""}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {catalogos.DCP.map(d => {
                        const value = d.valor ?? d.nombre ?? d.label ?? "";
                        return (
                            <MenuItem key={d._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>


                <TextField
                    fullWidth
                    label="Número Permiso Importación"
                    name="numeroPermisoImportacion"
                    value={form.numeroPermisoImportacion}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                <TextField
                    select
                    fullWidth
                    label="Incoterms"
                    name="incoterms"
                    value={form.incoterms || ""}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {catalogos.INCOTERMS.map(i => {
                        const value = i.valor ?? i.nombre ?? i.label ?? "";
                        return (
                            <MenuItem key={i._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>

            </Box>


            <Box hidden={tab !== 1} mt={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {[
                        ["fechaFactura", "Fecha Factura"],
                        ["fechaSolicitudRegimen", "Fecha Solicitud Régimen"],
                        ["fechaSolicitudGarantia", "Fecha Solicitud Garantía"],
                        ["fechaInicioGarantia", "Fecha Inicio Garantía"],
                        ["fechaFinGarantia", "Fecha Fin Garantía"],
                        ["fechaEnvioPoliza", "Fecha Envío Póliza"],
                        ["fechaRecepcionDocumentoOriginal", "Fecha Recepción Doc Original"],
                        ["fechaRecolectEstimada", "Fecha Recolección Estimada"],
                        ["fechaRecolectProveedor", "Fecha Recolección Proveedor"],
                        ["fechaRecolectReal", "Fecha Recolección Real"],
                        ["fechaReqBodega", "Fecha Requerida Bodega"],
                        ["fechaMaxReqBodega", "Fecha Máx Requerida Bodega"],
                    ].map(([field, label]) => (
                        <DatePicker
                            key={field}
                            label={label}
                            value={form[field] ? dayjs(form[field]) : null}
                            onChange={(v) =>
                                setForm((p) => ({
                                    ...p,
                                    [field]: v ? v.format("YYYY-MM-DD") : "",
                                }))
                            }
                            format="DD-MM-YYYY" // se ve DD-MM-YYYY
                            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                        />
                    ))}
                </LocalizationProvider>
            </Box>



            {/* DOCUMENTOS */}
            <Box hidden={tab !== 2} mt={2}>
                <TextField fullWidth label="Carta Reg 21" name="cartaReg21" value={form.cartaReg21} onChange={handleChange} sx={{ mb: 2 }}>
                    {catalogos.ASEGURADORA.map(a => {
                        const value = a.valor ?? a.nombre ?? "";
                        return (
                            <MenuItem key={a._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>


                <TextField fullWidth label="Número Garantía" name="numeroGarantia" value={form.numeroGarantia} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth type="number" label="Monto Asegurado" name="montoAsegurado" value={form.montoAsegurado} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Número CDA Garantía" name="numeroCdaGarantia" value={form.numeroCdaGarantia} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Carta Aclaratoria" name="cartaAclaratoria" value={form.cartaAclaratoria} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Certificado Origen" name="certificadoOrigen" value={form.certificadoOrigen} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Lista Empaque" name="listaEmpaque" value={form.listaEmpaque} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Carta Gastos" name="cartaGastos" value={form.cartaGastos} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField
                    select
                    fullWidth
                    label="País Origen"
                    name="paisOrigen"
                    value={form.paisOrigen || ""}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {catalogos.PAIS_ORIGEN.map(p => {
                        const value = p.valor ?? p.nombre ?? p.label ?? "";
                        return (
                            <MenuItem key={p._id || value} value={value}>
                                {value}
                            </MenuItem>
                        );
                    })}
                </TextField>

            </Box>

            <Box display="flex" justifyContent="space-between" mt={4}>
                <Button onClick={handleDelete} color="error">
                    Eliminar
                </Button>
                <Box>
                    <Button onClick={onClose} sx={{ mr: 2 }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={() => handleSave("preembarque")}>
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
