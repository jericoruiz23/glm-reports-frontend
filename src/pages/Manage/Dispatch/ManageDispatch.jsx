import React, { useEffect, useState } from "react";
import Layout from "../../../components/Dashboard/Layout";
import toast from "react-hot-toast";
import ModalCreateDispatch from "../../../components/Modals/Dispatch/ModalCreateDispatch";
import ModalEditDispatch from "../../../components/Modals/Dispatch/ModalEditDispatch";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ManageDispatch() {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
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
                credentials: "include",
            });

            if (!res.ok) throw new Error("Error al cargar procesos");

            const data = await res.json();
            setProcesses(data);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los procesos");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const formatDateUTC = (isoDate) => {
        if (!isoDate) return "-";

        const date = new Date(isoDate);

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    };


    // =============================== FILTRO ===============================
    const dispatchProcesses = processes
        .filter((p) => p.currentStage === "despacho")
        .filter((p) => {
            const term = search.toLowerCase();
            return (
                (p.inicio?.codigoImportacion || "").toLowerCase().includes(term) ||
                (p.despacho?.numeroContainer || "").toLowerCase().includes(term) ||
                (p.despacho?.tipoContenedor || "").toLowerCase().includes(term)
            );
        });

    const readyForDispatch = processes.filter((p) => p.currentStage === "aduana");

    return (
        <Layout>
            <div className="page" style={{ paddingTop: "1rem" }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "60vh",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* ================= HEADER ================= */}
                        <div
                            className="page-header"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingRight: "3rem",
                                paddingBottom: "2rem",
                            }}
                        >
                            <h1>Despacho</h1>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                <input
                                    type="text"
                                    placeholder="Buscar por Código, Container o Tipo"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "300px",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    disabled={readyForDispatch.length === 0}
                                    onClick={() => setOpenCreate(true)}
                                >
                                    Crear Despacho
                                </Button>
                            </div>
                        </div>

                        {/* ================= TABLA ================= */}
                        <div className="card">
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                        <th style={th}>Código Importación</th>
                                        <th style={th}>Container</th>
                                        <th style={th}>Tipo</th>
                                        <th style={th}>Est. Despacho Puerto</th>
                                        <th style={th}>Real Despacho Puerto</th>
                                        <th style={th}>Est. Entrega Bodega</th>
                                        <th style={th}>Real Entrega Bodega</th>
                                        <th style={th}>Confirmado Naviera</th>
                                        <th style={th}>Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dispatchProcesses.map((p) => (
                                        <tr
                                            key={p._id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedProcess(p);
                                                setOpenEdit(true);
                                            }}
                                        >
                                            <td style={td}>{p.inicio?.codigoImportacion || "-"}</td>
                                            <td style={td}>{p.despacho?.numeroContainer || "-"}</td>
                                            <td style={td}>{p.despacho?.tipoContenedor || "-"}</td>
                                            <td style={td}>
                                                {formatDateUTC(p.despacho?.fechaEstDespachoPuerto)}
                                            </td>

                                            <td style={td}>
                                                {formatDateUTC(p.despacho?.fechaRealDespachoPuerto)}
                                            </td>

                                            <td style={td}>
                                                {formatDateUTC(p.despacho?.fechaEstEntregaBodega)}
                                            </td>

                                            <td style={td}>
                                                {formatDateUTC(p.despacho?.fechaRealEntregaBodega)}
                                            </td>

                                            <td style={td}>{p.despacho?.confirmadoNaviera ? "Sí" : "No"}</td>
                                            <td style={td}>{p.despacho?.observaciones || "-"}</td>
                                        </tr>
                                    ))}

                                    {dispatchProcesses.length === 0 && (
                                        <tr>
                                            <td colSpan={11} style={{ padding: "20px", textAlign: "center" }}>
                                                No hay procesos que coincidan con la búsqueda
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ================= MODALES ================= */}
                        <ModalCreateDispatch
                            open={openCreate}
                            processes={readyForDispatch}
                            onClose={() => setOpenCreate(false)}
                            onSuccess={() => {
                                setOpenCreate(false);
                                fetchData();
                            }}
                        />

                        <ModalEditDispatch
                            open={openEdit}
                            dispatchprocess={selectedProcess}
                            onClose={() => {
                                setOpenEdit(false);
                                setSelectedProcess(null);
                            }}
                            onSuccess={() => {
                                setOpenEdit(false);
                                setSelectedProcess(null);
                                fetchData();
                            }}
                        />

                    </>
                )}
            </div>
        </Layout>
    );
}
