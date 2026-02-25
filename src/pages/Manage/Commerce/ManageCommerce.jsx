// src/pages/manage/ManageControlImport.jsx
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import Layout from "../../../components/Dashboard/Layout";
import ModalViewCommerce from "../../../components/Modals/Commerce/ModalViewCommerce";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import * as XLSX from 'xlsx-js-style';
import processService from "../../../services/processService";

import { celdasExcel } from "./CommerceOptions.js";

export default function ManageCommerce() {
    const [preembarques, setPreembarques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const th = {
        padding: "10px 12px",
        fontWeight: 700,
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
    };

    const td = {
        padding: "8px 12px",
        fontSize: "0.9rem",
        whiteSpace: "nowrap",
    };


    const fetchData = async () => {
        setLoading(true);
        try {
            const allProcesses = await processService.listAll();
            setPreembarques(allProcesses);
        } catch (err) {
            console.error(err);
            if (err.status === 401) {
                toast.error("Sesión expirada. Vuelve a iniciar sesión.");
            } else {
                toast.error("No se pudieron cargar los registros");
            }
            setPreembarques([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);
    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    };

    const flattenObjectValues = (obj) => {
        let values = [];
        Object.values(obj || {}).forEach((value) => {
            if (value == null) return;
            if (typeof value === "object" && !(value instanceof Date)) {
                values = values.concat(flattenObjectValues(value));
            } else {
                values.push(String(value));
            }
        });
        return values;
    };

    const filtered = preembarques
        .filter(p => p.proceso === "COM") // <-- filtra solo procesos COM
        .filter((p) => {
            const term = search.toLowerCase().trim();
            if (!term) return true;
            const allValues = flattenObjectValues(p).join(" ").toLowerCase();
            return allValues.includes(term);
        });

    const getValueByPath = (obj, path) => {
        return path.split(".").reduce((acc, key) => acc?.[key], obj);
    };

    const exportToExcel = () => {
        if (!filtered.length) {
            toast.error("No hay datos para exportar");
            return;
        }

        const rows = [];

        filtered.forEach((registro) => {
            const items = registro.preembarque?.items?.length ? registro.preembarque.items : [{}];

            items.forEach((item) => {
                const row = {};

                celdasExcel.forEach(({ header, path, fixedValue }) => {
                    let value;

                    if (fixedValue !== undefined) {
                        value = fixedValue;
                    } else if (path?.startsWith("preembarque.items")) {
                        const key = path.replace("preembarque.items.", "");
                        value = item[key] ?? "";
                    } else {
                        value = getValueByPath(registro, path) ?? "";
                    }

                    // Status especial
                    if (header.toLowerCase() === "status") {
                        if (registro.anulado) value = "anulado";
                        else if (registro.despacho?.fechaFacturacionCostos) value = "historico";
                        else if (registro.despacho?.fechaRealDespachoPuerto) value = "concluido";
                        else if (registro.postembarque?.fechaRealEmbarque) value = "transito";
                        else if (registro.postembarque?.fechaRealLlegadaPuerto) value = "aduana";
                        else value = "por despachar origen";
                    }

                    // Si es fecha
                    if (value && ((path && path.toLowerCase().includes("fecha")) || value instanceof Date)) {
                        value = formatDate(value);
                    }

                    row[header] = value;
                });

                rows.push(row);
            });
        });

        const ws = XLSX.utils.json_to_sheet(rows);

        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: 0 };
            const cell_ref = XLSX.utils.encode_cell(cell_address);

            if (!ws[cell_ref]) continue;

            ws[cell_ref].s = {
                fill: { patternType: "solid", fgColor: { rgb: "C0C0C0" } },
                font: { bold: true, color: { rgb: "000000" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }

        ws["!autofilter"] = { ref: XLSX.utils.encode_range(XLSX.utils.decode_range(ws["!ref"])) };
        ws["!freeze"] = { xSplit: 0, ySplit: 1 };
        ws["!cols"] = celdasExcel.map(() => ({ wch: 22 }));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "COMERCIAL");

        XLSX.writeFile(wb, `comercial_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };



    return (
        <Layout>
            <div
                className="page"
                style={{
                    paddingTop: "1rem",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    overflowX: "hidden",
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            paddingBottom: "1rem",
                            flexWrap: "wrap",
                            width: "100%",
                            maxWidth: "100%",
                            boxSizing: "border-box",
                        }}>
                            <h1 style={{ margin: 0 }}>Procesos comerciales</h1>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.75rem",
                                    alignItems: "center",
                                    flexWrap: "nowrap",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <input
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        padding: "10px 14px",
                                        width: "min(280px, 100%)",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={exportToExcel}
                                    sx={{ whiteSpace: "nowrap", minWidth: "fit-content", px: 2 }}
                                >
                                    Exportar Excel
                                </Button>
                            </div>
                        </div>

                        <div
                            className="card"
                            style={{
                                width: "100%",
                                marginBottom: "2rem",
                                background: "rgba(255,255,255,0.92)",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                                maxWidth: "100%",
                                minWidth: 0,
                            }}
                        >
                            <div
                                className="responsive-table-wrapper no-scrollbar-commerce"
                                style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    minWidth: 0,
                                    overflowX: "auto",
                                    overflowY: "hidden",
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}
                            >
                                <style>
                                    {`
                                      .no-scrollbar-commerce::-webkit-scrollbar {
                                        display: none;
                                      }
                                    `}
                                </style>
                                <table style={{ width: "max-content", minWidth: "2200px", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                            {celdasExcel.map((col) => (
                                                <th
                                                    key={col.header}
                                                    style={{
                                                        ...th,
                                                        position: "sticky", // Bloquea la celda
                                                        top: 0,              // En la parte superior del div
                                                        background: "#fff",  // Fondo sólido para que no se vea el texto de abajo
                                                        zIndex: 1,
                                                        // Asegura que esté por encima de las celdas del body
                                                    }}
                                                >
                                                    {col.header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.flatMap((p) =>
                                            (p.preembarque?.items?.length ? p.preembarque.items : [{}]).map((item, idx) => (
                                                <tr
                                                    key={`${p._id}-${idx}`}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelected({ registro: p, item });
                                                        setOpenDrawer(true);
                                                    }}
                                                >
                                                    {celdasExcel.map((col) => {
                                                        // Valor base: fixedValue, item o path del objeto
                                                        let value = col.fixedValue ?? (
                                                            col.path?.startsWith("preembarque.items")
                                                                ? item[col.path.replace("preembarque.items.", "")]
                                                                : getValueByPath(p, col.path)
                                                        );

                                                        // Status especial
                                                        if (col.header?.toLowerCase() === "status") {
                                                            if (p.anulado) value = "anulado";
                                                            else if (p.despacho?.fechaFacturacionCostos) value = "historico";
                                                            else if (p.despacho?.fechaRealDespachoPuerto) value = "concluido";
                                                            else if (p.postembarque?.fechaRealEmbarque) value = "transito";
                                                            else if (p.postembarque?.fechaRealLlegadaPuerto) value = "aduana";
                                                            else if (p.currentStage === "inicio") value = "por despachar origen";
                                                            else value = "por despachar origen";
                                                        }

                                                        // Si es fecha
                                                        if (value && ((col.path && col.path.toLowerCase().includes("fecha")) || value instanceof Date)) {
                                                            value = formatDate(value);
                                                        }

                                                        return (
                                                            <td
                                                                key={col.header}
                                                                style={{
                                                                    ...td,
                                                                    fontWeight: col.header?.toLowerCase() === "status" ? 600 : "normal",
                                                                    color: col.header?.toLowerCase() === "status"
                                                                        ? value === "anulado" ? "red"
                                                                            : value === "historico" ? "gray"
                                                                                : value === "concluido" ? "blue"
                                                                                    : value === "transito" ? "orange"
                                                                                        : value === "aduana" ? "purple"
                                                                                            : "green"
                                                                        : "inherit"
                                                                }}
                                                            >
                                                                {value ?? "-"}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        )}

                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan={celdasExcel.length} style={{ padding: "12px 15px", textAlign: "center" }}>
                                                    No hay registros.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <ModalViewCommerce
                            open={openDrawer}
                            onClose={() => setOpenDrawer(false)}
                            selected={selected}
                            onRefresh={fetchData}   // 👈 clave
                        />

                    </>
                )}
            </div>
        </Layout >
    );
}
