import React from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

export default function DownloadProcessExcelTemplate() {
    const handleDownload = () => {
        const wb = XLSX.utils.book_new();

        // Utilidad para crear celda de fecha
        const excelDate = (date = new Date()) => ({ v: date, t: "d", z: "yyyy-mm-dd" });

        // Utilidad para crear celda numérica
        const excelNumber = (num = 0) => ({ v: num, t: "n" });

        /* =========================
           INICIO
        ========================= */
        const inicioSheet = XLSX.utils.aoa_to_sheet([
            [
                "proceso",
                "prioridad",
                "codigoImportacion",
                "proveedor",
                "facturaComercial",
                "ordenCompra",
                "regimen",
                "descripcion",
                "notificacionBroker",
                "referencia"
            ],
            [
                "", "", "", "", "", "", "", "", "", ""
            ]
        ]);
        XLSX.utils.book_append_sheet(wb, inicioSheet, "INICIO");

        /* =========================
           PREEMBARQUE
        ========================= */
        const preembarqueSheet = XLSX.utils.aoa_to_sheet([
            [
                "proceso","paisOrigen","fechaFactura","valorFactura","formaPago","cantidad","um",
                "entidadEmisoraDcp","numeroPermisoImportacion","fechaSolicitudRegimen","cartaReg21",
                "fechaSolicitudGarantia","aseguradora","numeroGarantia","montoAsegurado","fechaInicioGarantia",
                "fechaFinGarantia","numeroCdaGarantia","fechaEnvioPoliza","fechaRecepcionDocumentoOriginal",
                "numeroPoliza","incoterms","fechaRecolectEstimada","fechaRecolectProveedor","fechaRecolectReal",
                "fechaReqBodega","fechaMaxReqBodega","cartaAclaratoria","certificadoOrigen","listaEmpaque",
                "cartaGastos","paisProcedencia"
            ],
            [
                "", "", excelDate(), excelNumber(), "", excelNumber(), "", "", "", excelDate(), "",
                excelDate(), "", "", excelNumber(), excelDate(), excelDate(), "", excelDate(), excelDate(),
                "", "", excelDate(), excelDate(), excelDate(),
                excelDate(), excelDate(), "", "", "", "", ""
            ]
        ]);

        preembarqueSheet["!dataValidation"] = [
            { type: "date", sqref: "C2:C1000" },
            { type: "decimal", sqref: "D2:D1000" },
            { type: "decimal", sqref: "F2:F1000" }
        ];

        XLSX.utils.book_append_sheet(wb, preembarqueSheet, "PREEMBARQUE");

        /* =========================
           PREEMBARQUE ITEMS
        ========================= */
        const itemsSheet = XLSX.utils.aoa_to_sheet([
            [
                "proceso","codigo","descripcion","quintalesSolicitados","cajasSolicitados",
                "quintalesDespachados","cajasDespachados","causalesRetraso","novedadesDescarga",
                "anomaliasTemperatura","puertoArribo","marca","sku","semanaIngresoBodega","year",
                "semSolicitud","semRequerida","month","ttTender","satUN","satCONT","fletePrimario",
                "otros","seguro","sumaTotal"
            ],
            [
                "", "", "", excelNumber(), excelNumber(), excelNumber(), excelNumber(), "", "", "", "", "", "", excelNumber(), excelNumber(),
                excelNumber(), excelNumber(), excelNumber(), "", "", "", excelNumber(), excelNumber(), excelNumber(), excelNumber()
            ]
        ]);
        itemsSheet["!dataValidation"] = [
            { type: "decimal", sqref: "D2:D1000" },
            { type: "decimal", sqref: "E2:E1000" },
            { type: "decimal", sqref: "F2:F1000" },
            { type: "decimal", sqref: "G2:G1000" },
            { type: "decimal", sqref: "N2:N1000" },
            { type: "decimal", sqref: "O2:O1000" },
            { type: "decimal", sqref: "P2:P1000" },
            { type: "decimal", sqref: "Q2:Q1000" },
            { type: "decimal", sqref: "W2:W1000" },
            { type: "decimal", sqref: "X2:X1000" },
            { type: "decimal", sqref: "Y2:Y1000" },
            { type: "decimal", sqref: "Z2:Z1000" }
        ];
        XLSX.utils.book_append_sheet(wb, itemsSheet, "PREEMBARQUE_ITEMS");

        /* =========================
           POSTEMBARQUE
        ========================= */
        const postembarqueSheet = XLSX.utils.aoa_to_sheet([
            [
                "proceso","blMaster","blHijo","tipoTransporte","companiaTransporte","forwarder",
                "fechaEstEmbarque","fechaRealEmbarque","fechaEstLlegadaPuerto","fechaRealLlegadaPuerto",
                "numeroGuia","fechaRecepcionDocsOriginales","puertoEmbarque"
            ],
            [
                "", "", "", "", "", "", excelDate(), excelDate(), excelDate(), excelDate(), "", excelDate(), ""
            ]
        ]);
        postembarqueSheet["!dataValidation"] = [
            { type: "date", sqref: "G2:J1000" }
        ];
        XLSX.utils.book_append_sheet(wb, postembarqueSheet, "POSTEMBARQUE");

        /* =========================
           ADUANA
        ========================= */
        const aduanaSheet = XLSX.utils.aoa_to_sheet([
            [
                "proceso","fechaEnvioElectronico","fechaPagoLiquidacion","fechaSalidaAutorizada",
                "tipoAforo","refrendo","numeroEntregaEcuapass","numeroLiquidacion","numeroCdaAutorizacion",
                "numeroCarga","statusAduana"
            ],
            [
                "", excelDate(), excelDate(), excelDate(), "", "", "", "", "", "", ""
            ]
        ]);
        aduanaSheet["!dataValidation"] = [
            { type: "date", sqref: "B2:D1000" }
        ];
        XLSX.utils.book_append_sheet(wb, aduanaSheet, "ADUANA");

        /* =========================
           DESPACHO
        ========================= */
        const despachoSheet = XLSX.utils.aoa_to_sheet([
            [
                "proceso","fechaFacturacionCostos","numeroContainer","peso","bultos","tipoContenedor",
                "fechaEstDespachoPuerto","fechaRealDespachoPuerto","fechaEstEntregaBodega","fechaRealEntregaBodega",
                "diasLibres","confirmadoNaviera","fechaCas","fechaEntregaContenedorVacio","almacenaje","demorraje",
                "observaciones","fechaRegistroPesos"
            ],
            [
                "", excelDate(), "", excelNumber(), excelNumber(), "", excelDate(), excelDate(), excelDate(),
                excelDate(), excelNumber(), "", excelDate(), excelDate(), excelNumber(), excelNumber(), "", excelDate()
            ]
        ]);
        despachoSheet["!dataValidation"] = [
            { type: "date", sqref: "B2:D1000" },
            { type: "decimal", sqref: "D2:E1000" },
            { type: "decimal", sqref: "K2:L1000" },
            { type: "date", sqref: "G2:J1000" }
        ];
        XLSX.utils.book_append_sheet(wb, despachoSheet, "DESPACHO");

        XLSX.writeFile(wb, "plantilla_ingesta_procesos.xlsx");
    };

    return (
        <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
        >
            Descargar formato
        </Button>
    );
}
