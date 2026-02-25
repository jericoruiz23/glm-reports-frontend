import React, { useEffect, useState } from "react";
import Layout from "../../../components/Dashboard/Layout";
import toast from "react-hot-toast";
import ModalCreatePostshipment from "../../../components/Modals/Postshipment/ModalCreatePostsh";
import ModalEditPostshipment from "../../../components/Modals/Postshipment/ModalEditPostsh";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import processService from "../../../services/processService";

export default function ManagePostShippingCompact() {
    const [postembarques, setPostembarques] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [disponiblesPostembarque, setDisponiblesPostembarque] = useState([]);
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

            const allProcesses = await processService.listAll();

            /* =========================
               POSTEMBARQUES (TABLA)
            ========================= */
            const postArray = allProcesses
                .filter(
                    p =>
                        p.currentStage === "postembarque" &&
                        p.postembarque
                )
                .map(p => ({
                    _id: p._id,
                    proceso: p.proceso,
                    ...p.postembarque,
                    codigoImportacion: p.inicio?.codigoImportacion || "-",
                    proveedor: p.inicio?.proveedor || "-"
                }));

            const procesosDisponibles = allProcesses.filter(
                p =>
                    p.currentStage === "preembarque" &&
                    p.preembarque &&
                    Object.keys(p.preembarque).some(
                        key =>
                            p.preembarque[key] !== null &&
                            p.preembarque[key] !== ""
                    )
            );

            setPostembarques(postArray);
            setFiltered(postArray);
            setDisponiblesPostembarque(procesosDisponibles);
        } catch (err) {
            console.error(err);
            if (err.status === 401) {
                toast.error("Sesión expirada. Vuelve a iniciar sesión.");
            } else {
                toast.error("No se pudieron cargar los registros");
            }
            setPostembarques([]);
            setFiltered([]);
            setDisponiblesPostembarque([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    /* =========================
       FILTRO DE BÚSQUEDA
    ========================= */
    useEffect(() => {
        if (!search) {
            setFiltered(postembarques);
            return;
        }

        const lower = search.toLowerCase();

        setFiltered(
            postembarques.filter(p =>
                (p.codigoImportacion || "").toLowerCase().includes(lower) ||
                (p.blMaster || "").toLowerCase().includes(lower) ||
                (p.tipoTransporte || "").toLowerCase().includes(lower) ||
                (p.forwarder || "").toLowerCase().includes(lower) ||
                (p.puertoEmbarque || "").toLowerCase().includes(lower)
            )
        );
    }, [search, postembarques]);

    if (loading) {
        return (
            <Layout>
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
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page" style={{ paddingTop: "1rem" }}>
                {/* HEADER */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: "3rem",
                        paddingBottom: "2rem",
                    }}
                >
                    <h1>Post-Embarques</h1>

                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <input
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: "10px 14px",
                                width: "300px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                            }}
                        />

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenCreate(true)}
                            disabled={disponiblesPostembarque.length === 0}
                        >
                            Crear Post-embarque
                        </Button>
                    </div>
                </div>

                {/* TABLA */}
                <div className="card">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={th}>Código Importación</th>
                                <th style={th}>BL Master</th>
                                <th style={th}>Tipo Transporte</th>
                                <th style={th}>Forwarder</th>
                                <th style={th}>Puerto Embarque</th>
                                <th style={th}>F. Est. Embarque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr
                                    key={p._id}
                                    onClick={() => {
                                        setSelectedProcess(p);
                                        setOpenDrawer(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={td}>{p.codigoImportacion || "-"}</td>
                                    <td style={td}>{p.blMaster || "-"}</td>
                                    <td style={td}>{p.tipoTransporte || "-"}</td>
                                    <td style={td}>{p.forwarder || "-"}</td>
                                    <td style={td}>{p.puertoEmbarque || "-"}</td>
                                    <td style={td}>
                                        {p.fechaEstEmbarque
                                            ? new Date(p.fechaEstEmbarque).toLocaleDateString("es-ES")
                                            : "-"}
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: "12px 15px", textAlign: "center" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODALES */}
                <ModalCreatePostshipment
                    open={openCreate}
                    onClose={async () => {
                        setOpenCreate(false);
                        await fetchData();
                    }}
                    procesos={disponiblesPostembarque}
                />

                <ModalEditPostshipment
                    open={openDrawer}
                    onClose={async () => {
                        setOpenDrawer(false);
                        await fetchData();
                    }}
                    data={selectedProcess}
                    procesos={postembarques}
                />
            </div>
        </Layout>
    );
}
