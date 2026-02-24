import React, { useState } from "react";
import Layout from "../../../components/Dashboard/Layout";
import { Box, Checkbox, Typography, Paper, Button } from "@mui/material";
import toast from "react-hot-toast";
import * as XLSX from "xlsx-js-style";
import useProcesses from "../../../hooks/useProcesses";

import { VariableCatalog } from "./VariableCatalog";

const AVAILABLE_FIELDS = Object.entries(VariableCatalog).flatMap(
    ([section, fields]) =>
        fields.map(field => ({
            key: field.path,
            label: field.label,
            section
        }))
);

export default function ReportFieldSelector({ data }) {
    const { refresh } = useProcesses({ autoFetch: false, showErrorToast: false });
    const [selectedFields, setSelectedFields] = useState([]);

    const toggleField = (field) => {
        const exists = selectedFields.find(f => f.key === field.key);
        const updated = exists
            ? selectedFields.filter(f => f.key !== field.key)
            : [...selectedFields, field];

        setSelectedFields(updated);
    };

    const sections = [...new Set(AVAILABLE_FIELDS.map(f => f.section))];

    const exportExcel = async () => {
        try {
            // Si no tienes "data" pasada por props, fetch al backend:
            let reportData = data;
            if (!reportData) {
                reportData = await refresh();
            }

            if (!Array.isArray(reportData) || reportData.length === 0) {
                toast.error("No hay datos para exportar");
                return;
            }

            // Convertir los objetos a rows de Excel según las variables seleccionadas
            const rows = reportData.map(item => {
                const row = {};
                selectedFields.forEach(f => {
                    const keys = f.key.split(".");
                    let value = item;
                    for (let k of keys) {
                        value = value?.[k];
                    }

                    // Detectar fecha
                    let cellValue = value;
                    if (value) {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            // Formato dd-mm-aaaa
                            const dd = String(date.getDate()).padStart(2, "0");
                            const mm = String(date.getMonth() + 1).padStart(2, "0");
                            const yyyy = date.getFullYear();
                            cellValue = `${dd}-${mm}-${yyyy}`;
                        }
                    }

                    row[f.label] = cellValue ?? "-";
                });
                return row;
            });

            // Crear worksheet
            const ws = XLSX.utils.json_to_sheet(rows);

            // Aplicar formato de fecha a las columnas que sean fechas
            selectedFields.forEach((f, colIndex) => {
                // verificar si es tipo date en el catalogo
                const fieldInfo = Object.values(VariableCatalog).flat().find(v => v.path === f.key);
                if (fieldInfo?.type === "date") {
                    const range = XLSX.utils.decode_range(ws['!ref']);
                    for (let r = 1; r <= range.e.r; r++) { // empieza en 1 para saltar headers
                        const cellAddress = { c: colIndex, r };
                        const cellRef = XLSX.utils.encode_cell(cellAddress);
                        if (ws[cellRef]) {
                            // Convertimos valor string dd-mm-aaaa a fecha de Excel
                            const [d, m, y] = ws[cellRef].v.split("-");
                            const excelDate = new Date(`${y}-${m}-${d}`);
                            ws[cellRef].v = excelDate;
                            ws[cellRef].t = "d"; // tipo fecha
                            ws[cellRef].z = "dd-mm-yyyy"; // formato
                        }
                    }
                }
            });

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte");

            XLSX.writeFile(wb, "reporte_personalizado.xlsx");
        } catch (err) {
            console.error(err);
            toast.error("Error generando Excel");
        }
    };

    return (
        <Layout>
            <div className="page" style={{ paddingTop: "1rem" }}>
                <Paper sx={{ p: 3, boxShadow: "none" }}>
                    {sections.map(section => (
                        <Box key={section} sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                {section}
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                {AVAILABLE_FIELDS
                                    .filter(f => f.section === section)
                                    .map(field => {
                                        const checked = selectedFields.some(f => f.key === field.key);
                                        return (
                                            <Box
                                                key={field.key}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "6px 10px",
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "6px",
                                                    background: checked ? "#f0f8ff" : "white",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => toggleField(field)}
                                            >
                                                <Checkbox checked={checked} size="small" />
                                                <Typography sx={{ flex: 1, ml: 1, fontSize: "0.9rem" }}>
                                                    {field.label}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                            </Box>
                        </Box>
                    ))}

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={selectedFields.length === 0}
                            onClick={exportExcel}
                        >
                            Generar Excel
                        </Button>
                    </Box>

                    {/* Resumen */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Resumen de Variables Seleccionadas:
                        </Typography>

                        {sections.map(section => {
                            const selectedInSection = selectedFields.filter(f => f.section === section);
                            if (selectedInSection.length === 0) return null;
                            return (
                                <Box key={section} sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {section}:
                                    </Typography>
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        {selectedInSection.map(f => f.label).join(", ")}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>
            </div>
        </Layout>
    );
}
