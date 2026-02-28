import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { mergeArrayValue, mergeNumberValue, mergeTextValue } from "./stageCreateHelpers";

dayjs.extend(customParseFormat);

export const ITEM_TEMPLATE_HEADERS = [
  "codigo", "descripcion", "quintalesSolicitados", "cajasSolicitados",
  "quintalesDespachados", "cajasDespachados", "causalesRetraso",
  "novedadesDescarga", "anomaliasTemperatura", "puertoArribo", "marca", "sku",
  "semanaIngresoBodega", "year", "semSolicitud", "deltaReqVsCarga",
  "deltaFechaSolicitudVsETD", "deltaFechaSolicitudVsCarga",
  "ltFechaCargaHastaIngresoBodega", "ltHastaRoundTripWeek", "month",
  "semRequerida", "onTime", "ttTender", "deltaTiempoTransito", "satUN",
  "satCONT", "fletePrimario", "otros", "seguro", "sumaTotal",
];

export function parseExcelDate(val) {
  if (val === null || val === undefined || val === "") return "";

  if (typeof val === "number") {
    const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
    jsDate.setUTCHours(12, 0, 0, 0);
    const d = dayjs(jsDate);
    return d.isValid() ? d.format("YYYY-MM-DD") : "";
  }

  if (typeof val === "string") {
    const formats = ["D/M/YYYY", "DD/MM/YYYY", "D-M-YYYY", "DD-MM-YYYY", "YYYY-MM-DD"];

    for (const fmt of formats) {
      const parsed = dayjs(val, fmt, true);
      if (parsed.isValid()) return parsed.format("YYYY-MM-DD");
    }
  }

  return "";
}

export function mapExcelRowToItem(row) {
  return {
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
    deltaFechaSolicitudVsETD: parseExcelDate(row.deltaFechaSolicitudVsETD),
    deltaFechaSolicitudVsCarga: parseExcelDate(row.deltaFechaSolicitudVsCarga),
    ltFechaCargaHastaIngresoBodega: parseExcelDate(row.ltFechaCargaHastaIngresoBodega),
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
  };
}

export function normalizeManualItem(itemForm) {
  return {
    ...itemForm,
    quintalesSolicitados: Number(itemForm.quintalesSolicitados),
    cajasSolicitados: Number(itemForm.cajasSolicitados),
    quintalesDespachados: Number(itemForm.quintalesDespachados),
    cajasDespachados: Number(itemForm.cajasDespachados),
    semanaIngresoBodega: Number(itemForm.semanaIngresoBodega),
    year: Number(itemForm.year),
    semSolicitud: Number(itemForm.semSolicitud),
    deltaReqVsCarga: Number(itemForm.deltaReqVsCarga),
    deltaFechaSolicitudVsETD: itemForm.deltaFechaSolicitudVsETD || "",
    deltaFechaSolicitudVsCarga: itemForm.deltaFechaSolicitudVsCarga || "",
    ltFechaCargaHastaIngresoBodega: itemForm.ltFechaCargaHastaIngresoBodega || "",
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
}

export function buildPreshipmentPayload(form, items, existingData = {}) {
  const { procesoId, ...preembarqueData } = form;
  const toDateOrNull = (value) => {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T12:00:00.000Z`);
    }
    return new Date(value);
  };
  const mergeDateValue = (nextValue, currentValue) => {
    if (!nextValue) return currentValue ?? null;
    return toDateOrNull(nextValue);
  };
  const mergedItems = mergeArrayValue(items, existingData.items);

  return {
    ...existingData,
    ...preembarqueData,
    paisOrigen: mergeTextValue(preembarqueData.paisOrigen, existingData.paisOrigen),
    formaPago: mergeTextValue(preembarqueData.formaPago, existingData.formaPago),
    um: mergeTextValue(preembarqueData.um, existingData.um),
    entidadEmisoraDcp: mergeTextValue(preembarqueData.entidadEmisoraDcp, existingData.entidadEmisoraDcp),
    numeroPermisoImportacion: mergeTextValue(
      preembarqueData.numeroPermisoImportacion,
      existingData.numeroPermisoImportacion
    ),
    cartaReg21: mergeTextValue(preembarqueData.cartaReg21, existingData.cartaReg21),
    aseguradora: mergeTextValue(preembarqueData.aseguradora, existingData.aseguradora),
    numeroGarantia: mergeTextValue(preembarqueData.numeroGarantia, existingData.numeroGarantia),
    numeroCdaGarantia: mergeTextValue(preembarqueData.numeroCdaGarantia, existingData.numeroCdaGarantia),
    numeroPoliza: mergeTextValue(preembarqueData.numeroPoliza, existingData.numeroPoliza),
    incoterms: mergeTextValue(preembarqueData.incoterms, existingData.incoterms),
    cartaAclaratoria: mergeTextValue(preembarqueData.cartaAclaratoria, existingData.cartaAclaratoria),
    certificadoOrigen: mergeTextValue(preembarqueData.certificadoOrigen, existingData.certificadoOrigen),
    listaEmpaque: mergeTextValue(preembarqueData.listaEmpaque, existingData.listaEmpaque),
    cartaGastos: mergeTextValue(preembarqueData.cartaGastos, existingData.cartaGastos),
    paisProcedencia: mergeTextValue(preembarqueData.paisProcedencia, existingData.paisProcedencia),
    valorFactura: mergeNumberValue(preembarqueData.valorFactura, existingData.valorFactura ?? 0),
    cantidad: mergeNumberValue(preembarqueData.cantidad, existingData.cantidad ?? 0),
    montoAsegurado: mergeNumberValue(preembarqueData.montoAsegurado, existingData.montoAsegurado ?? 0),
    items: mergedItems.map((item) => ({
      ...item,
      deltaFechaSolicitudVsETD: item.deltaFechaSolicitudVsETD
        ? toDateOrNull(item.deltaFechaSolicitudVsETD)
        : null,
      deltaFechaSolicitudVsCarga: item.deltaFechaSolicitudVsCarga
        ? toDateOrNull(item.deltaFechaSolicitudVsCarga)
        : null,
      ltFechaCargaHastaIngresoBodega: item.ltFechaCargaHastaIngresoBodega
        ? toDateOrNull(item.ltFechaCargaHastaIngresoBodega)
        : null,
    })),
    fechaFactura: mergeDateValue(preembarqueData.fechaFactura, existingData.fechaFactura),
    fechaSolicitudRegimen: mergeDateValue(
      preembarqueData.fechaSolicitudRegimen,
      existingData.fechaSolicitudRegimen
    ),
    fechaSolicitudGarantia: mergeDateValue(
      preembarqueData.fechaSolicitudGarantia,
      existingData.fechaSolicitudGarantia
    ),
    fechaInicioGarantia: mergeDateValue(
      preembarqueData.fechaInicioGarantia,
      existingData.fechaInicioGarantia
    ),
    fechaFinGarantia: mergeDateValue(preembarqueData.fechaFinGarantia, existingData.fechaFinGarantia),
    fechaEnvioPoliza: mergeDateValue(preembarqueData.fechaEnvioPoliza, existingData.fechaEnvioPoliza),
    fechaRecepcionDocumentoOriginal: mergeDateValue(
      preembarqueData.fechaRecepcionDocumentoOriginal,
      existingData.fechaRecepcionDocumentoOriginal
    ),
    fechaRecolectEstimada: mergeDateValue(
      preembarqueData.fechaRecolectEstimada,
      existingData.fechaRecolectEstimada
    ),
    fechaRecolectProveedor: mergeDateValue(
      preembarqueData.fechaRecolectProveedor,
      existingData.fechaRecolectProveedor
    ),
    fechaRecolectReal: mergeDateValue(preembarqueData.fechaRecolectReal, existingData.fechaRecolectReal),
    fechaReqBodega: mergeDateValue(preembarqueData.fechaReqBodega, existingData.fechaReqBodega),
    fechaMaxReqBodega: mergeDateValue(preembarqueData.fechaMaxReqBodega, existingData.fechaMaxReqBodega),
  };
}
