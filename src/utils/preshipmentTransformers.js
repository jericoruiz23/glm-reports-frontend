import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

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

export function buildPreshipmentPayload(form, items) {
  const { procesoId, ...preembarqueData } = form;

  return {
    ...preembarqueData,
    valorFactura: Number(preembarqueData.valorFactura) || 0,
    cantidad: Number(preembarqueData.cantidad) || 0,
    montoAsegurado: Number(preembarqueData.montoAsegurado) || 0,
    items: items.map((item) => ({
      ...item,
      deltaFechaSolicitudVsETD: item.deltaFechaSolicitudVsETD
        ? new Date(`${item.deltaFechaSolicitudVsETD}T12:00:00.000Z`)
        : null,
      deltaFechaSolicitudVsCarga: item.deltaFechaSolicitudVsCarga
        ? new Date(`${item.deltaFechaSolicitudVsCarga}T12:00:00.000Z`)
        : null,
      ltFechaCargaHastaIngresoBodega: item.ltFechaCargaHastaIngresoBodega
        ? new Date(`${item.ltFechaCargaHastaIngresoBodega}T12:00:00.000Z`)
        : null,
    })),
    fechaFactura: preembarqueData.fechaFactura ? new Date(preembarqueData.fechaFactura) : null,
    fechaSolicitudRegimen: preembarqueData.fechaSolicitudRegimen
      ? new Date(preembarqueData.fechaSolicitudRegimen)
      : null,
    fechaSolicitudGarantia: preembarqueData.fechaSolicitudGarantia
      ? new Date(preembarqueData.fechaSolicitudGarantia)
      : null,
    fechaInicioGarantia: preembarqueData.fechaInicioGarantia ? new Date(preembarqueData.fechaInicioGarantia) : null,
    fechaFinGarantia: preembarqueData.fechaFinGarantia ? new Date(preembarqueData.fechaFinGarantia) : null,
    fechaEnvioPoliza: preembarqueData.fechaEnvioPoliza ? new Date(preembarqueData.fechaEnvioPoliza) : null,
    fechaRecepcionDocumentoOriginal: preembarqueData.fechaRecepcionDocumentoOriginal
      ? new Date(preembarqueData.fechaRecepcionDocumentoOriginal)
      : null,
    fechaRecolectEstimada: preembarqueData.fechaRecolectEstimada
      ? new Date(preembarqueData.fechaRecolectEstimada)
      : null,
    fechaRecolectProveedor: preembarqueData.fechaRecolectProveedor
      ? new Date(preembarqueData.fechaRecolectProveedor)
      : null,
    fechaRecolectReal: preembarqueData.fechaRecolectReal ? new Date(preembarqueData.fechaRecolectReal) : null,
    fechaReqBodega: preembarqueData.fechaReqBodega ? new Date(preembarqueData.fechaReqBodega) : null,
    fechaMaxReqBodega: preembarqueData.fechaMaxReqBodega ? new Date(preembarqueData.fechaMaxReqBodega) : null,
  };
}
