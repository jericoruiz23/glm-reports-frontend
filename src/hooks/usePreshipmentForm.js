import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx-js-style";
import toast from "react-hot-toast";
import api from "../services/api";
import catalogService from "../services/catalogService";
import {
  ITEM_TEMPLATE_HEADERS,
  mapExcelRowToItem,
  normalizeManualItem,
  buildPreshipmentPayload,
} from "../utils/preshipmentTransformers";
import { toDateInputValue } from "../utils/stageCreateHelpers";

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

const initialItemForm = {
  codigo: "",
  descripcion: "",
  quintalesSolicitados: 0,
  cajasSolicitados: 0,
  quintalesDespachados: 0,
  cajasDespachados: 0,
};

export default function usePreshipmentForm({ open, onClose, onCreated, procesos = [] }) {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [tabIndex, setTabIndex] = useState(0);
  const [catalogos, setCatalogos] = useState({
    PAIS_ORIGEN: [],
    FORMAS_PAGO: [],
    UNIDADES_METRICAS: [],
    DCP: [],
    ASEGURADORA: [],
    INCOTERMS: [],
  });
  const fileInputRef = useRef(null);
  const buildFormFromProcess = (processId, process) => {
    const preembarque = process?.preembarque || {};

    return {
      ...initialForm,
      procesoId: processId || "",
      paisOrigen: preembarque.paisOrigen || "",
      fechaFactura: toDateInputValue(preembarque.fechaFactura),
      valorFactura: preembarque.valorFactura ?? 0,
      formaPago: preembarque.formaPago || "",
      cantidad: preembarque.cantidad ?? 0,
      um: preembarque.um || "",
      entidadEmisoraDcp: preembarque.entidadEmisoraDcp || "",
      numeroPermisoImportacion: preembarque.numeroPermisoImportacion || "",
      fechaSolicitudRegimen: toDateInputValue(preembarque.fechaSolicitudRegimen),
      cartaReg21: preembarque.cartaReg21 || "",
      fechaSolicitudGarantia: toDateInputValue(preembarque.fechaSolicitudGarantia),
      aseguradora: preembarque.aseguradora || "",
      numeroGarantia: preembarque.numeroGarantia || "",
      montoAsegurado: preembarque.montoAsegurado ?? 0,
      fechaInicioGarantia: toDateInputValue(preembarque.fechaInicioGarantia),
      fechaFinGarantia: toDateInputValue(preembarque.fechaFinGarantia),
      numeroCdaGarantia: preembarque.numeroCdaGarantia || "",
      fechaEnvioPoliza: toDateInputValue(preembarque.fechaEnvioPoliza),
      fechaRecepcionDocumentoOriginal: toDateInputValue(preembarque.fechaRecepcionDocumentoOriginal),
      numeroPoliza: preembarque.numeroPoliza || "",
      incoterms: preembarque.incoterms || "",
      fechaRecolectEstimada: toDateInputValue(preembarque.fechaRecolectEstimada),
      fechaRecolectProveedor: toDateInputValue(preembarque.fechaRecolectProveedor),
      fechaRecolectReal: toDateInputValue(preembarque.fechaRecolectReal),
      fechaReqBodega: toDateInputValue(preembarque.fechaReqBodega),
      fechaMaxReqBodega: toDateInputValue(preembarque.fechaMaxReqBodega),
      cartaAclaratoria: preembarque.cartaAclaratoria || "",
      certificadoOrigen: preembarque.certificadoOrigen || "",
      listaEmpaque: preembarque.listaEmpaque || "",
      cartaGastos: preembarque.cartaGastos || "",
      paisProcedencia: preembarque.paisProcedencia || preembarque.paisOrigen || "",
    };
  };
  const mapItemForForm = (item = {}) => ({
    ...item,
    deltaFechaSolicitudVsETD: toDateInputValue(item.deltaFechaSolicitudVsETD),
    deltaFechaSolicitudVsCarga: toDateInputValue(item.deltaFechaSolicitudVsCarga),
    ltFechaCargaHastaIngresoBodega: toDateInputValue(item.ltFechaCargaHastaIngresoBodega),
  });
  const hydrateProcess = (processId) => {
    const selectedProcess = procesos.find((process) => process?._id === processId);
    const preembarque = selectedProcess?.preembarque || {};

    setForm(buildFormFromProcess(processId, selectedProcess));
    setItems(Array.isArray(preembarque.items) ? preembarque.items.map(mapItemForForm) : []);
    setItemForm(initialItemForm);
  };

  useEffect(() => {
    if (!open) return;

    const fetchCatalogos = async () => {
      try {
        const data = await catalogService.listOptions();
        setCatalogos({
          PAIS_ORIGEN: data.PAIS_ORIGEN || [],
          FORMAS_PAGO: data.FORMAS_PAGO || [],
          UNIDADES_METRICAS: data.UNIDADES_METRICAS || [],
          DCP: data.DCP || [],
          ASEGURADORA: data.ASEGURADORA || [],
          INCOTERMS: data.INCOTERMS || [],
        });
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar los catalogos");
      }
    };

    setForm(initialForm);
    setItems([]);
    setItemForm(initialItemForm);
    setTabIndex(0);
    fetchCatalogos();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "procesoId") {
      hydrateProcess(value);
      return;
    }

    if (name === "paisOrigen") {
      setForm((prev) => ({
        ...prev,
        paisOrigen: value,
        paisProcedencia: value,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
          raw: true,
        });

        if (!json.length) {
          toast.error("El archivo no contiene datos");
          return;
        }

        const parsedItems = json.map((row) => mapExcelRowToItem(row));
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
    const ws = XLSX.utils.aoa_to_sheet([ITEM_TEMPLATE_HEADERS]);

    ITEM_TEMPLATE_HEADERS.forEach((_, i) => {
      ws[XLSX.utils.encode_cell({ r: 0, c: i })].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EDEDED" } },
        alignment: { horizontal: "center" },
      };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Items");
    XLSX.writeFile(wb, "template_items_preembarque.xlsx");
  };

  const addItem = () => {
    const newItem = normalizeManualItem(itemForm);

    if (itemForm._editingIndex != null) {
      const updatedItems = [...items];
      updatedItems[itemForm._editingIndex] = newItem;
      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }

    setItemForm(initialItemForm);
  };

  const editItem = (idx) => {
    setItemForm({ ...items[idx], _editingIndex: idx });
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, index) => index !== idx));
  };

  const cancelEditItem = () => {
    setItemForm(initialItemForm);
  };

  const handleSubmit = async () => {
    if (!form.procesoId) {
      toast.error("Debes seleccionar un proceso");
      return;
    }

    try {
      const selectedProcess = procesos.find((process) => process?._id === form.procesoId);
      const payload = buildPreshipmentPayload(form, items, selectedProcess?.preembarque || {});
      const procesoId = form.procesoId;

      const actualizado = await api.patch(`/api/process/${procesoId}/preembarque`, payload);
      toast.success("Preembarque actualizado correctamente");
      if (onCreated) onCreated(actualizado);
      onClose();
    } catch (err) {
      console.error("Error al actualizar preembarque", err);
      toast.error("Error al actualizar preembarque");
    }
  };

  return {
    form,
    setForm,
    items,
    setItems,
    itemForm,
    setItemForm,
    tabIndex,
    setTabIndex,
    catalogos,
    handleChange,
    handleItemChange,
    handleUploadItems,
    downloadItemsTemplate,
    addItem,
    editItem,
    removeItem,
    cancelEditItem,
    handleSubmit,
    fileInputRef,
  };
}
