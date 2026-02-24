// src/pages/manage/ManageControlImport.jsx
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import Layout from "../../components/Dashboard/Layout";
import * as XLSX from 'xlsx-js-style';
import ModalViewControlImport from "../../components/Modals/ControlImport/ModalViewControlImport";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../../context/AuthContext";



import { celdasExcel } from "./ControlImport/controlimportOptions";

export default function ManageControlImport() {
    const [preembarques, setPreembarques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const { currentUser } = useAuth();
    const th = {
        padding: "10px 12px",
        fontWeight: 700,
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    };

    const td = {
        padding: "8px 12px",
        fontSize: "0.95rem",
    };
    const getValueByPath = (obj, path, fallback = "") => {
        return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? fallback;
    };


    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Error al cargar procesos");

            const data = await res.json();
            setPreembarques(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los registros");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

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

    const filtered = preembarques.filter((p) => {
        const term = search.toLowerCase().trim();
        if (!term) return true;
        const allValues = flattenObjectValues(p).join(" ").toLowerCase();
        return allValues.includes(term);
    });

    const isDateValue = (v) => {
        if (!v) return false;

        // Date real
        if (v instanceof Date) return true;

        // ISO string válido
        if (typeof v === "string") {
            const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
            if (!isoRegex.test(v)) return false;

            const d = new Date(v);
            return !isNaN(d.getTime());
        }

        return false;
    };


    const exportToExcel = () => {
        if (!preembarques.length) {
            toast.error("No hay datos para exportar");
            return;
        }

        const rows = preembarques.map((item) => {
            const row = {};

            celdasExcel.forEach(({ header, path }) => {
                let value = getValueByPath(item, path);

                // ✅ Convertir a Date REAL si es fecha
                if (isDateValue(value)) {
                    value = new Date(value);
                }

                // Booleanos
                if (typeof value === "boolean") {
                    value = value ? "Sí" : "No";
                }

                if (value === null || value === undefined || Number.isNaN(value)) {
                    value = "";
                }

                row[header] = value;
            });

            return row;
        });

        // ✅ CLAVE
        const ws = XLSX.utils.json_to_sheet(rows, {
            cellDates: true
        });

        Object.keys(ws).forEach((cell) => {
            if (cell[0] === "!") return;

            const cellObj = ws[cell];

            if (cellObj.v instanceof Date) {
                cellObj.t = "d";               // Tipo fecha
                cellObj.z = "dd/mm/yyyy";      // Formato europeo
            }
        });

        // --- Cabecera gris ---
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: 0 };
            const cell_ref = XLSX.utils.encode_cell(cell_address);

            if (!ws[cell_ref]) continue;

            ws[cell_ref].s = {
                fill: { patternType: "solid", fgColor: { rgb: "C0C0C0" } },
                font: { bold: true, color: { rgb: "000000" } },
                alignment: { horizontal: "center", vertical: "center" },
            };
        }

        ws["!autofilter"] = { ref: ws["!ref"] };
        ws["!freeze"] = { xSplit: 0, ySplit: 1 };
        ws["!cols"] = celdasExcel.map(() => ({ wch: 22 }));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Control Importación");

        XLSX.writeFile(
            wb,
            `control_importacion_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
    };


    return (
        <Layout>
            <div className="page" style={{ paddingTop: "1rem" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            paddingBottom: "1rem",
                            flexWrap: "wrap",
                        }}>
                            <h1>Control de Importación</h1>

                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                <input
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        padding: "10px 14px",
                                        width: "280px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                                <Button variant="outlined" onClick={exportToExcel}>
                                    Exportar Excel
                                </Button>
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="card">
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                        <th style={th}>Código</th>
                                        <th style={th}>Proceso</th>
                                        <th style={th}>Prioridad</th>
                                        <th style={th}>Proveedor</th>
                                        <th style={th}>Origen</th>
                                        <th style={th}>Valor Factura</th>
                                        <th style={th}>Etapa</th>
                                        <th style={th}>Actualizado</th>
                                        <th style={th}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr
                                            key={p._id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelected(p);
                                                setOpenDrawer(true);
                                            }}
                                        >
                                            <td style={td}>{p.inicio?.codigoImportacion || "-"}</td>
                                            <td style={td}>{p.proceso || "-"}</td>
                                            <td style={td}>{p.inicio?.prioridad || "-"}</td>
                                            <td style={td}>{p.inicio?.proveedor || "-"}</td>
                                            <td style={td}>{p.preembarque?.paisOrigen || "-"}</td>
                                            <td style={td}>{p.preembarque?.valorFactura ?? "-"}</td>
                                            <td style={{ ...td, fontWeight: 600 }}>{p.currentStage}</td>
                                            <td style={td}>
                                                {p.updatedAt
                                                    ? new Date(p.updatedAt).toLocaleDateString("es-ES")
                                                    : "-"}
                                            </td>
                                            <td style={{ ...td, fontWeight: 600, color: p.anulado ? "red" : "green" }}>
                                                {p.anulado ? "Anulado" : "Activo"} {/* ← Estado */}
                                            </td>
                                        </tr>
                                    ))}

                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={9} style={{ padding: "12px 15px", textAlign: "center" }}>
                                                No hay registros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal */}
                        <ModalViewControlImport
                            open={openDrawer}
                            onClose={() => setOpenDrawer(false)}
                            selected={selected}
                            currentUser={currentUser}
                            onUpdated={fetchData}
                        />
                    </>
                )}
            </div>
        </Layout>
    );
}
