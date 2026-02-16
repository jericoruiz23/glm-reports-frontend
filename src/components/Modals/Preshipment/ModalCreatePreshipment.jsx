// src/components/Modals/Preshipment/ModalCreatePreshipment.jsx
import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Stack,
    Button,
    Tabs,
    Tab,
    MenuItem
} from "@mui/material";
import * as XLSX from "xlsx-js-style";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function ModalCreatePreshipment({ open, onClose, onCreated, procesos = [] }) {
    const initialForm = {
        procesoId: "",
        paisOrigen: "",
        fechaFactura: "",
        valorFactura: 0,
        formaPago: "",
        cantidad: 0,
        um: "",
        entidadEmisoraDcp: "",
        numeroPermisoImportacion: "",
        fechaSolicitudRegimen: "",
        cartaReg21: "",
        fechaSolicitudGarantia: "",
        aseguradora: "",
        numeroGarantia: "",
        montoAsegurado: 0,
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

    const [form, setForm] = useState(initialForm);
    const [items, setItems] = useState([]);
    const [itemForm, setItemForm] = useState({
        codigo: "",
        descripcion: "",
        quintalesSolicitados: 0,
        cajasSolicitados: 0,
        quintalesDespachados: 0,
        cajasDespachados: 0,
    });
    const [tabIndex, setTabIndex] = useState(0);
    const [catalogos, setCatalogos] = useState({
        PAIS_ORIGEN: [],
        FORMAS_PAGO: [],
        UNIDADES_METRICAS: [],
        DCP: [],
        ASEGURADORA: [],
        INCOTERMS: [],
    });


    useEffect(() => {
        if (!open) return;

        const fetchCatalogos = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/catalogos`,
                    {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!res.ok) throw new Error("Error al obtener catálogos");

                const data = await res.json();
                console.log(data, 'catalogos');


                setCatalogos({
                    PAIS_ORIGEN: data.PAIS_ORIGEN || [],
                    FORMAS_PAGO: data.FORMAS_PAGO || [],
                    UNIDADES_METRICAS: data.UNIDADES_METRICAS || [],
                    DCP: data.DCP || [],
                    ASEGURADORA: data.ASEGURADORA || [],
                    INCOTERMS: data.INCOTERMS || [],
                });



                console.log("PAIS_ORIGEN", data.PAIS_ORIGEN?.items);


            } catch (err) {
                console.error(err);
                toast.error("No se pudieron cargar los catálogos");
            }
        };

        fetchCatalogos();
    }, [open]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "paisOrigen") {
            setForm(prev => ({
                ...prev,
                paisOrigen: value,
                paisProcedencia: value, // 👈 copia automática
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleItemChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItemForm({
            ...itemForm,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleUploadItems = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const json = XLSX.utils.sheet_to_json(sheet, {
                    defval: "",
                    raw: true
                });

                if (!json.length) {
                    toast.error("El archivo no contiene datos");
                    return;
                }

                const parsedItems = json.map((row, index) => ({
                    codigo: row.codigo || "",
                    descripcion: row.descripcion || "",
                    quintalesSolicitados: Number(row.quintalesSolicitados) || 0,
                    cajasSolicitados: Number(row.cajasSolicitados) || 0,
                    quintalesDespachados: Number(row.quintalesDespachados) || 0,
                    cajasDespachados: Number(row.cajasDespachados) || 0,
                    causalesRetraso: row.causalesRetraso || "",
                    novedadesDescarga: row.novedadesDescarga || "",
                    anomaliasTemperatura: row.anomaliasTemperatura || "",
                    puertoArribo: row.puertoArribo || "",
                    marca: row.marca || "",
                    sku: row.sku || "",
                    semanaIngresoBodega: Number(row.semanaIngresoBodega) || 0,
                    year: Number(row.year) || new Date().getFullYear(),
                    semSolicitud: Number(row.semSolicitud) || 0,
                    deltaReqVsCarga: Number(row.deltaReqVsCarga) || 0,
                    deltaFechaSolicitudVsETD: Number(row.deltaFechaSolicitudVsETD) || 0,
                    deltaFechaSolicitudVsCarga: Number(row.deltaFechaSolicitudVsCarga) || 0,
                    ltFechaCargaHastaIngresoBodega: Number(row.ltFechaCargaHastaIngresoBodega) || 0,
                    ltHastaRoundTripWeek: Number(row.ltHastaRoundTripWeek) || 0,
                    month: Number(row.month) || 0,
                    semRequerida: Number(row.semRequerida) || 0,
                    onTime: row.onTime || "",
                    ttTender: Number(row.ttTender) || 0,
                    deltaTiempoTransito: Number(row.deltaTiempoTransito) || 0,
                    satUN: Number(row.satUN) || 0,
                    satCONT: Number(row.satCONT) || 0,
                    fletePrimario: Number(row.fletePrimario) || 0,
                    otros: Number(row.otros) || 0,
                    seguro: Number(row.seguro) || 0,
                    sumaTotal: Number(row.sumaTotal) || 0,
                }));

                setItems(parsedItems);
                toast.success(`Se cargaron ${parsedItems.length} items`);

            } catch (error) {
                console.error(error);
                toast.error("Error leyendo el archivo");
            }
        };

        reader.readAsArrayBuffer(file);
        e.target.value = null;
    };


    const downloadItemsTemplate = () => {
        const headers = [
            "codigo", "descripcion", "quintalesSolicitados", "cajasSolicitados",
            "quintalesDespachados", "cajasDespachados", "causalesRetraso",
            "novedadesDescarga", "anomaliasTemperatura", "puertoArribo", "marca", "sku",
            "semanaIngresoBodega", "year", "semSolicitud", "deltaReqVsCarga",
            "deltaFechaSolicitudVsETD", "deltaFechaSolicitudVsCarga",
            "ltFechaCargaHastaIngresoBodega", "ltHastaRoundTripWeek", "month",
            "semRequerida", "onTime", "ttTender", "deltaTiempoTransito", "satUN",
            "satCONT", "fletePrimario", "otros", "seguro", "sumaTotal"
        ];

        const ws = XLSX.utils.aoa_to_sheet([headers]);

        headers.forEach((_, i) => {
            ws[XLSX.utils.encode_cell({ r: 0, c: i })].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "EDEDED" } },
                alignment: { horizontal: "center" }
            };
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Items");

        XLSX.writeFile(wb, "template_items_preembarque.xlsx");
    };


    const addItem = () => {
        const newItem = {
            ...itemForm,
            quintalesSolicitados: Number(itemForm.quintalesSolicitados),
            cajasSolicitados: Number(itemForm.cajasSolicitados),
            quintalesDespachados: Number(itemForm.quintalesDespachados),
            cajasDespachados: Number(itemForm.cajasDespachados),
            semanaIngresoBodega: Number(itemForm.semanaIngresoBodega),
            year: Number(itemForm.year),
            semSolicitud: Number(itemForm.semSolicitud),
            deltaReqVsCarga: Number(itemForm.deltaReqVsCarga),
            deltaFechaSolicitudVsETD: Number(itemForm.deltaFechaSolicitudVsETD),
            deltaFechaSolicitudVsCarga: Number(itemForm.deltaFechaSolicitudVsCarga),
            ltFechaCargaHastaIngresoBodega: Number(itemForm.ltFechaCargaHastaIngresoBodega),
            ltHastaRoundTripWeek: Number(itemForm.ltHastaRoundTripWeek),
            month: Number(itemForm.month),
            semRequerida: Number(itemForm.semRequerida),
            ttTender: Number(itemForm.ttTender),
            deltaTiempoTransito: Number(itemForm.deltaTiempoTransito),
            satUN: Number(itemForm.satUN),
            satCONT: Number(itemForm.satCONT),
            fletePrimario: Number(itemForm.fletePrimario),
            otros: Number(itemForm.otros),
            seguro: Number(itemForm.seguro),
            sumaTotal: Number(itemForm.sumaTotal),
        };

        if (itemForm._editingIndex != null) {
            const updatedItems = [...items];
            updatedItems[itemForm._editingIndex] = newItem;
            setItems(updatedItems);
        } else {
            setItems([...items, newItem]);
        }

        setItemForm(initialForm);
    };


    const handleSubmit = async () => {
        if (!form.procesoId) {
            toast.error("Debes seleccionar un proceso");
            return;
        }

        try {
            const { procesoId, ...preembarqueData } = form;
            const payload = {
                ...preembarqueData,
                valorFactura: Number(preembarqueData.valorFactura) || 0,
                cantidad: Number(preembarqueData.cantidad) || 0,
                montoAsegurado: Number(preembarqueData.montoAsegurado) || 0,
                items,
                fechaFactura: preembarqueData.fechaFactura ? new Date(preembarqueData.fechaFactura) : null,
                fechaSolicitudRegimen: preembarqueData.fechaSolicitudRegimen ? new Date(preembarqueData.fechaSolicitudRegimen) : null,
                fechaSolicitudGarantia: preembarqueData.fechaSolicitudGarantia ? new Date(preembarqueData.fechaSolicitudGarantia) : null,
                fechaInicioGarantia: preembarqueData.fechaInicioGarantia ? new Date(preembarqueData.fechaInicioGarantia) : null,
                fechaFinGarantia: preembarqueData.fechaFinGarantia ? new Date(preembarqueData.fechaFinGarantia) : null,
                fechaEnvioPoliza: preembarqueData.fechaEnvioPoliza ? new Date(preembarqueData.fechaEnvioPoliza) : null,
                fechaRecepcionDocumentoOriginal: preembarqueData.fechaRecepcionDocumentoOriginal ? new Date(preembarqueData.fechaRecepcionDocumentoOriginal) : null,
                fechaRecolectEstimada: preembarqueData.fechaRecolectEstimada ? new Date(preembarqueData.fechaRecolectEstimada) : null,
                fechaRecolectProveedor: preembarqueData.fechaRecolectProveedor ? new Date(preembarqueData.fechaRecolectProveedor) : null,
                fechaRecolectReal: preembarqueData.fechaRecolectReal ? new Date(preembarqueData.fechaRecolectReal) : null,
                fechaReqBodega: preembarqueData.fechaReqBodega ? new Date(preembarqueData.fechaReqBodega) : null,
                fechaMaxReqBodega: preembarqueData.fechaMaxReqBodega ? new Date(preembarqueData.fechaMaxReqBodega) : null,
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process/${procesoId}/preembarque`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Error al actualizar preembarque");
            const actualizado = await res.json();
            toast.success("Preembarque actualizado correctamente");
            onCreated(actualizado);
            onClose();
        } catch (err) {
            console.error("Error al actualizar preembarque", err);
            toast.error("Error al actualizar preembarque");
        }
    };

    const fileInputRef = React.useRef(null);


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


            <Tabs value={tabIndex} onChange={(_, value) => setTabIndex(value)} sx={{ mt: 2 }}>
                <Tab label="Datos Generales" />
                <Tab label="Items" />
            </Tabs>

            <Box mt={3} maxHeight="70vh" overflow="auto">
                {tabIndex === 0 && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2}>
                            {/* Copiar todos los campos del form principal */}
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    select
                                    name="procesoId"
                                    value={form.procesoId || ""}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                    fullWidth
                                >
                                    <option value="">Seleccionar Proceso</option>
                                    {procesos.filter(p => p.currentStage === "inicio").map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.inicio?.codigoImportacion || "Sin código"}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    name="paisOrigen"
                                    value={form.paisOrigen || ""}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">País Origen</MenuItem>
                                    {catalogos.PAIS_ORIGEN.map(p => (
                                        <MenuItem key={p.key} value={p.label}>
                                            {p.label}
                                        </MenuItem>
                                    ))}


                                </TextField>

                            </Stack>


                            {/* Resto de campos */}
                            <DatePicker
                                label="Fecha Factura"
                                format="DD-MM-YYYY"
                                value={form.fechaFactura ? dayjs(form.fechaFactura) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaFactura: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <TextField label="Valor Factura" name="valorFactura" type="number" value={form.valorFactura} onChange={handleChange} fullWidth />

                            <TextField
                                select
                                label="Forma de Pago"
                                name="formaPago"
                                value={form.formaPago || ""}
                                onChange={handleChange}
                                fullWidth
                            >
                                {catalogos.FORMAS_PAGO.map(fp => (
                                    <MenuItem key={fp.key} value={fp.label}>
                                        {fp.label}
                                    </MenuItem>
                                ))}



                            </TextField>

                            <TextField label="Cantidad" name="cantidad" type="number" value={form.cantidad} onChange={handleChange} fullWidth />

                            <TextField
                                select
                                label="UM"
                                name="um"
                                value={form.um || ""}
                                onChange={handleChange}
                                fullWidth
                            >
                                {catalogos.UNIDADES_METRICAS.map(u => (
                                    <MenuItem key={u.key} value={u.label}>
                                        {u.label}
                                    </MenuItem>
                                ))}



                            </TextField>


                            <TextField
                                select
                                label="Entidad Emisora DCP"
                                name="entidadEmisoraDcp"
                                value={form.entidadEmisoraDcp || ""}
                                onChange={handleChange}
                                fullWidth
                            >
                                {catalogos.DCP.map(d => (
                                    <MenuItem key={d.key} value={d.label}>
                                        {d.label}
                                    </MenuItem>
                                ))}



                            </TextField>


                            <TextField label="Número Permiso Importación" name="numeroPermisoImportacion" value={form.numeroPermisoImportacion} onChange={handleChange} fullWidth />

                            <DatePicker
                                label="Fecha Solicitud Régimen"
                                format="DD-MM-YYYY"
                                value={form.fechaSolicitudRegimen ? dayjs(form.fechaSolicitudRegimen) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaSolicitudRegimen: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <TextField label="Carta Reg21" name="cartaReg21" value={form.cartaReg21} onChange={handleChange} fullWidth />

                            <DatePicker
                                label="Fecha Solicitud Garantía"
                                format="DD-MM-YYYY"
                                value={form.fechaSolicitudGarantia ? dayjs(form.fechaSolicitudGarantia) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaSolicitudGarantia: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <TextField
                                select
                                label="Aseguradora"
                                name="aseguradora"
                                value={form.aseguradora || ""}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="">Seleccione aseguradora</MenuItem>

                                {catalogos.ASEGURADORA.map(a => (
                                    <MenuItem key={a.key} value={a.label}>
                                        {a.label}
                                    </MenuItem>
                                ))}



                            </TextField>


                            <TextField label="Número Garantía" name="numeroGarantia" value={form.numeroGarantia} onChange={handleChange} fullWidth />

                            <TextField label="Monto Asegurado" name="montoAsegurado" type="number" value={form.montoAsegurado} onChange={handleChange} fullWidth />

                            <DatePicker
                                label="Fecha Inicio Garantía"
                                format="DD-MM-YYYY"
                                value={form.fechaInicioGarantia ? dayjs(form.fechaInicioGarantia) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaInicioGarantia: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Fecha Fin Garantía"
                                format="DD-MM-YYYY"
                                value={form.fechaFinGarantia ? dayjs(form.fechaFinGarantia) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaFinGarantia: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <TextField label="Número CDA Garantía" name="numeroCdaGarantia" value={form.numeroCdaGarantia} onChange={handleChange} fullWidth />

                            <DatePicker
                                label="Fecha Envío Póliza"
                                format="DD-MM-YYYY"
                                value={form.fechaEnvioPoliza ? dayjs(form.fechaEnvioPoliza) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaEnvioPoliza: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Fecha Recepción Documento Original"
                                format="DD-MM-YYYY"
                                value={form.fechaRecepcionDocumentoOriginal ? dayjs(form.fechaRecepcionDocumentoOriginal) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaRecepcionDocumentoOriginal: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <TextField label="Número Póliza" name="numeroPoliza" value={form.numeroPoliza} onChange={handleChange} fullWidth />

                            <TextField
                                select
                                label="Incoterms"
                                name="incoterms"
                                value={form.incoterms || ""}
                                onChange={handleChange}
                                fullWidth
                            >
                                {catalogos.INCOTERMS.map(i => (
                                    <MenuItem key={i.key} value={i.label}>
                                        {i.label}
                                    </MenuItem>
                                ))}


                            </TextField>


                            <DatePicker
                                label="Fecha Recolect Estimada"
                                format="DD-MM-YYYY"
                                value={form.fechaRecolectEstimada ? dayjs(form.fechaRecolectEstimada) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaRecolectEstimada: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Fecha Recolect Proveedor"
                                format="DD-MM-YYYY"
                                value={form.fechaRecolectProveedor ? dayjs(form.fechaRecolectProveedor) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaRecolectProveedor: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Fecha Recolect Real"
                                format="DD-MM-YYYY"
                                value={form.fechaRecolectReal ? dayjs(form.fechaRecolectReal) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaRecolectReal: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Fecha Req Bodega"
                                format="DD-MM-YYYY"
                                value={form.fechaReqBodega ? dayjs(form.fechaReqBodega) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaReqBodega: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Fecha Max Req Bodega"
                                format="DD-MM-YYYY"
                                value={form.fechaMaxReqBodega ? dayjs(form.fechaMaxReqBodega) : null}
                                onChange={(v) => setForm(p => ({ ...p, fechaMaxReqBodega: v ? v.format("YYYY-MM-DD") : "" }))}
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <TextField label="Carta Aclaratoria" name="cartaAclaratoria" value={form.cartaAclaratoria} onChange={handleChange} fullWidth />
                            <TextField label="Certificado de Origen" name="certificadoOrigen" value={form.certificadoOrigen} onChange={handleChange} fullWidth />
                            <TextField label="Lista de Empaque" name="listaEmpaque" value={form.listaEmpaque} onChange={handleChange} fullWidth />
                            <TextField label="Carta de Gastos" name="cartaGastos" value={form.cartaGastos} onChange={handleChange} fullWidth />

                            <TextField
                                label="País Procedencia"
                                name="paisProcedencia"
                                value={form.paisProcedencia || ""}
                                disabled
                                fullWidth
                            />


                            <Box mt={5} textAlign="right">
                                <Button variant="contained" color="primary" size="large" sx={{ borderRadius: "12px", px: 4 }} onClick={handleSubmit}>
                                    Guardar
                                </Button>
                            </Box>
                        </Stack>
                    </LocalizationProvider>
                )}

                {tabIndex === 1 && (
                    <Stack spacing={2}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography variant="subtitle1">
                                Agregar Items
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={downloadItemsTemplate}
                                >
                                    Descargar formato ITEMS
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Subir
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls"
                                    style={{ display: "none" }}
                                    onChange={handleUploadItems}
                                />
                            </Stack>
                        </Box>




                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            {/* Campos básicos */}
                            <TextField label="Código" name="codigo" value={itemForm.codigo} onChange={handleItemChange} fullWidth />
                            <TextField label="Descripción" name="descripcion" value={itemForm.descripcion} onChange={handleItemChange} fullWidth />
                            <TextField label="Quintales Solicitados" name="quintalesSolicitados" type="number" value={itemForm.quintalesSolicitados} onChange={handleItemChange} fullWidth />
                            <TextField label="Cajas Solicitados" name="cajasSolicitados" type="number" value={itemForm.cajasSolicitados} onChange={handleItemChange} fullWidth />
                            <TextField label="Quintales Despachados" name="quintalesDespachados" type="number" value={itemForm.quintalesDespachados} onChange={handleItemChange} fullWidth />
                            <TextField label="Cajas Despachados" name="cajasDespachados" type="number" value={itemForm.cajasDespachados} onChange={handleItemChange} fullWidth />

                            {/* Nuevos campos completos */}
                            <TextField label="Causales Retraso" name="causalesRetraso" value={itemForm.causalesRetraso} onChange={handleItemChange} fullWidth />
                            <TextField label="Novedades Descarga" name="novedadesDescarga" value={itemForm.novedadesDescarga} onChange={handleItemChange} fullWidth />
                            <TextField label="Anomalías Temperatura" name="anomaliasTemperatura" value={itemForm.anomaliasTemperatura} onChange={handleItemChange} fullWidth />
                            <TextField label="Puerto Arribo" name="puertoArribo" value={itemForm.puertoArribo} onChange={handleItemChange} fullWidth />
                            <TextField label="Marca" name="marca" value={itemForm.marca} onChange={handleItemChange} fullWidth />
                            <TextField label="SKU" name="sku" value={itemForm.sku} onChange={handleItemChange} fullWidth />
                            <TextField label="Semana Ingreso Bodega" name="semanaIngresoBodega" type="number" value={itemForm.semanaIngresoBodega} onChange={handleItemChange} fullWidth />
                            <TextField label="Year" name="year" type="number" value={itemForm.year} onChange={handleItemChange} fullWidth />
                            <TextField label="Sem Solicitud" name="semSolicitud" type="number" value={itemForm.semSolicitud} onChange={handleItemChange} fullWidth />
                            <TextField label="Delta REQ vs Carga" name="deltaReqVsCarga" type="number" value={itemForm.deltaReqVsCarga} onChange={handleItemChange} fullWidth />
                            <TextField label="Delta Fecha Solicitud vs ETD" name="deltaFechaSolicitudVsETD" type="number" value={itemForm.deltaFechaSolicitudVsETD} onChange={handleItemChange} fullWidth />
                            <TextField label="Delta Fecha Solicitud vs Carga" name="deltaFechaSolicitudVsCarga" type="number" value={itemForm.deltaFechaSolicitudVsCarga} onChange={handleItemChange} fullWidth />
                            <TextField label="LT Fecha Carga Hasta Ingreso Bodega" name="ltFechaCargaHastaIngresoBodega" type="number" value={itemForm.ltFechaCargaHastaIngresoBodega} onChange={handleItemChange} fullWidth />
                            <TextField label="LT Hasta Round Trip Week" name="ltHastaRoundTripWeek" type="number" value={itemForm.ltHastaRoundTripWeek} onChange={handleItemChange} fullWidth />
                            <TextField label="Month" name="month" type="number" value={itemForm.month} onChange={handleItemChange} fullWidth />
                            <TextField label="Sem Requerida" name="semRequerida" type="number" value={itemForm.semRequerida} onChange={handleItemChange} fullWidth />
                            <TextField
                                select
                                label="On Time"
                                name="onTime"
                                value={itemForm.onTime || ""}
                                onChange={handleItemChange}
                                fullWidth
                            >
                                <MenuItem value="OK">OK</MenuItem>
                                <MenuItem value="ATRASADO">ATRASADO</MenuItem>
                            </TextField>
                            <TextField label="TT Tender" name="ttTender" type="number" value={itemForm.ttTender} onChange={handleItemChange} fullWidth />
                            <TextField label="Delta Tiempo Tránsito" name="deltaTiempoTransito" type="number" value={itemForm.deltaTiempoTransito} onChange={handleItemChange} fullWidth />
                            <TextField label="SAT UN" name="satUN" type="number" value={itemForm.satUN} onChange={handleItemChange} fullWidth />
                            <TextField label="SAT CONT" name="satCONT" type="number" value={itemForm.satCONT} onChange={handleItemChange} fullWidth />
                            <TextField label="Flete Primario" name="fletePrimario" type="number" value={itemForm.fletePrimario} onChange={handleItemChange} fullWidth />
                            <TextField label="Otros" name="otros" type="number" value={itemForm.otros} onChange={handleItemChange} fullWidth />
                            <TextField label="Seguro" name="seguro" type="number" value={itemForm.seguro} onChange={handleItemChange} fullWidth />
                            <TextField label="Suma Total" name="sumaTotal" type="number" value={itemForm.sumaTotal} onChange={handleItemChange} fullWidth />
                        </Box>

                        <Box display="flex" gap={2} mt={2}>
                            <Button variant="contained" color="primary" onClick={addItem}>
                                {itemForm._editingIndex != null ? "Actualizar Item" : "Agregar Item"}
                            </Button>
                            {itemForm._editingIndex != null && (
                                <Button variant="outlined" color="secondary" onClick={() => setItemForm(initialForm)}>Cancelar</Button>
                            )}
                        </Box>

                        {items.length > 0 && (
                            <Box mt={2}>
                                <Typography variant="subtitle1">Items agregados:</Typography>
                                <Stack spacing={1}>
                                    {items.map((i, idx) => (
                                        <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" p={1} border="1px solid #ccc" borderRadius="8px">
                                            <Typography>
                                                {i.codigo} - {i.descripcion} | QS: {i.quintalesSolicitados} | CS: {i.cajasSolicitados} | QD: {i.quintalesDespachados} | CD: {i.cajasDespachados} | OnTime: {i.onTime ? "Sí" : "No"}
                                            </Typography>
                                            <Box>
                                                <Button size="small" variant="outlined" color="info" onClick={() => setItemForm({ ...i, _editingIndex: idx })}>Editar</Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => setItems(items.filter((_, index) => index !== idx))} sx={{ ml: 1 }}>Borrar</Button>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                )}

            </Box>
        </Drawer >
    );
}
