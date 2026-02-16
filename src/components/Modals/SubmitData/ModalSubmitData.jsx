import React, { useState } from "react";
import {
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import DownloadButton from "./DownloadProcessExcelTemplate";

export default function IngestProcessFull({ open, onClose }) {
    const [sheetsData, setSheetsData] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    /* =========================
       HANDLE FILE (ALL SHEETS)
    ========================= */
    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);

        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const workbook = XLSX.read(evt.target.result, {
                    type: "binary"
                });

                const allSheets = {};

                workbook.SheetNames.forEach((sheetName) => {
                    const sheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(sheet, {
                        defval: ""
                    });

                    if (json.length > 0) {
                        allSheets[sheetName] = json;
                    }
                });

                if (!Object.keys(allSheets).length) {
                    toast.error("El archivo no contiene datos válidos");
                    return;
                }

                setSheetsData(allSheets);
                toast.success("Archivo cargado correctamente");

            } catch (err) {
                console.error(err);
                toast.error("Error leyendo el archivo Excel");
            }
        };

        reader.readAsBinaryString(selected);
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async () => {
        if (!file) {
            toast.error("Debe subir un archivo");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/process/ingest/excel`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al procesar archivo");
            }

            toast.success("Ingesta completada correctamente");
            setSheetsData({});
            setFile(null);
            onClose();

        } catch (err) {
            toast.error(err.message || "Error en la ingesta");
        } finally {
            setLoading(false);
        }
    };

    const hasData = Object.keys(sheetsData).length > 0;

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            {/* =========================
               APP BAR
            ========================= */}
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar>
                    <Typography sx={{ flex: 1 }} variant="h6">
                        Ingesta asistida de procesos
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* =========================
               CONTENT
            ========================= */}
            <Box sx={{ p: 4 }}>
                {!hasData && (
                    <Box
                        sx={{
                            border: "2px dashed #bbb",
                            borderRadius: 2,
                            p: 6,
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: "#fafafa",
                            "&:hover": { backgroundColor: "#f0f0f0" }
                        }}
                        onClick={() =>
                            document.getElementById("excel-upload-full").click()
                        }
                    >
                        <CloudUploadIcon sx={{ fontSize: 60, color: "#777" }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Subir archivo Excel
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            .xlsx / .xls
                        </Typography>

                        <input
                            id="excel-upload-full"
                            type="file"
                            accept=".xlsx,.xls"
                            hidden
                            onChange={handleFile}
                        />
                    </Box>
                )}

                {/* =========================
                   PREVIEW ALL SHEETS
                ========================= */}
                {Object.entries(sheetsData).map(([sheetName, rows]) => {
                    const headers = Object.keys(rows[0] || {});

                    return (
                        <Box key={sheetName} sx={{ mb: 6 }}>
                            <Typography variant="h6" gutterBottom>
                                {sheetName}
                            </Typography>

                            <Typography sx={{ fontSize: 14, mb: 1 }}>
                                Filas: <b>{rows.length}</b>
                            </Typography>

                            <Box
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    overflow: "auto",
                                    maxHeight: 400
                                }}
                            >
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            {headers.map((h) => (
                                                <TableCell
                                                    key={h}
                                                    sx={{
                                                        fontWeight: 600,
                                                        backgroundColor: "#fafafa",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rows.map((row, i) => (
                                            <TableRow key={i}>
                                                {headers.map((h) => (
                                                    <TableCell key={h}>
                                                        {row[h] || "-"}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* =========================
               FOOTER
            ========================= */}
            <Box
                sx={{
                    bottom: 0,
                    p: 2,
                    borderTop: "1px solid #eee",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                {/* IZQUIERDA */}
                <Button onClick={onClose} color="error">
                    Cancelar
                </Button>

                {/* DERECHA */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    {!hasData && (
                        <DownloadButton />
                    )}

                    <Button
                        variant="contained"
                        disabled={!hasData || loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={22} /> : "Confirmar"}
                    </Button>
                </Box>
            </Box>

        </Dialog>
    );
}
