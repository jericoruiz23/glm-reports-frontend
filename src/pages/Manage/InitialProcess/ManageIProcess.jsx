import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import Layout from "../../../components/Dashboard/Layout";
import ModalCreateProcess from "../../../components/Modals/InitialProcess/ModalCreateInProcess";
import ModalViewProcess from "../../../components/Modals/InitialProcess/ModalEditInProcess";
import ModalSubmitData from "../../../components/Modals/SubmitData/ModalSubmitData";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ManageInitialProcess() {
    const [procesos, setProcesos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openSubmit, setOpenSubmit] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");

    const th = {
        padding: "10px 12px",
        fontWeight: 700,
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    };

    const td = {
        padding: "8px 12px",
        fontSize: "0.9rem",
    };


    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (res.status === 401) {
                toast.error("Sesión expirada. Vuelve a iniciar sesión.");
                setProcesos([]);
                return;
            }

            if (!res.ok) throw new Error("Error al obtener procesos");
            const dataRaw = await res.json();
            const procesosArray = Array.isArray(dataRaw) ? dataRaw : dataRaw.data;

            setProcesos(procesosArray || []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los registros");
            setProcesos([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const filtered = procesos
        .filter((p) => p.currentStage === "inicio")
        .filter((p) => {
            const term = search.toLowerCase();
            const data = { ...p, ...p.inicio };
            const stringData = Object.values(data)
                .map((v) => (v ? String(v) : ""))
                .join(" ")
                .toLowerCase();
            return stringData.includes(term);
        });

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page" style={{ paddingTop: "1rem" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "3rem", paddingBottom: "2rem" }}>
                    <h1>Inicio de Proceso</h1>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <input
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: "10px 14px", width: "300px", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
                            Crear Proceso
                        </Button>
                        {/* <Button
                            variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenSubmit(true)}>
                            Subir Procesos
                        </Button> */}

                    </div>
                </div>

                {/* Tabla */}
                <div className="card">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={th}>Código Importación</th>
                                <th style={th}>Proveedor</th>
                                <th style={th}>Prioridad</th>
                                <th style={th}>Factura Comercial</th>
                                <th style={th}>O/C</th>
                                <th style={th}>Régimen</th>
                                <th style={th}>Orden</th>
                                <th style={th}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => {
                                const inicio = p.inicio || {};
                                return (
                                    <tr key={p._id} onClick={() => { setSelected(p); setOpenView(true); }} style={{ cursor: "pointer" }}>
                                        <td style={td}>{inicio.codigoImportacion || "-"}</td>
                                        <td style={td}>{inicio.proveedor || "-"}</td>
                                        <td style={td}>{inicio.prioridad || "-"}</td>
                                        <td style={td}>{inicio.facturaComercial || "-"}</td>
                                        <td style={td}>{inicio.ordenCompra || "-"}</td>
                                        <td style={td}>{inicio.regimen || "-"}</td>
                                        <td style={td}>{inicio.referencia || "-"}</td>
                                        <td style={td}>Inicio</td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "12px 15px" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modales */}
                <ModalCreateProcess
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onCreated={(nuevo) => setProcesos((prev) => [nuevo, ...prev])}
                />

                <ModalViewProcess
                    open={openView}
                    onClose={() => setOpenView(false)}
                    data={selected}
                    onUpdated={(updated) => setProcesos((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))}
                    onDeleted={(id) => {
                        setProcesos((prev) => prev.filter((p) => p._id !== id));
                        setOpenView(false);
                    }}
                />

                <ModalSubmitData
                    open={openSubmit}
                    onClose={() => setOpenSubmit(false)}
                />

            </div>
        </Layout>
    );
}