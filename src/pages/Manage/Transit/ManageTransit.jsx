// src/pages/manage/ManageTransitTime.jsx
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import Layout from "../../../components/Dashboard/Layout";
import ModalCreateTransit from "../../../components/Modals/Transit/ModalCreateTransit";
import ModalViewTransit from "../../../components/Modals/Transit/ModalEditTransit";

export default function ManageTransitTime() {
    const [transits, setTransits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedTransit, setSelectedTransit] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/transit`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Error al cargar registros");
            const data = await res.json();
            setTransits(data);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los registros");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id) => {
        try {
            setLoadingDetails(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/transit/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Error al cargar detalle");
            const data = await res.json();
            setSelectedTransit(data);
        } catch (err) {
            console.error(err);
            toast.error("No se pudo cargar el detalle");
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p style={{ padding: "2rem" }}>Cargando registros...</p>;

    return (
        <Layout>
            <div className="page" style={{ paddingTop: "1rem" }}>
                {/* Header */}
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
                    <h1>Transit Time</h1>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                    >
                        Crear Forwarder
                    </Button>
                </div>

                {/* Tabla */}
                <div className="card">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={{ padding: "12px 15px" }}>Origen</th>
                                <th style={{ padding: "12px 15px" }}>Forwarder</th>
                                <th style={{ padding: "12px 15px" }}># Operaciones</th>
                                <th style={{ padding: "12px 15px" }}>Prom. Transit Port to Port</th>
                                <th style={{ padding: "12px 15px" }}>Prom. TT Tender</th>
                                <th style={{ padding: "12px 15px" }}>Prom. Delta Tiempo</th>
                                <th style={{ padding: "12px 15px" }}>Máx. LT Carga-Bodega</th>
                                <th style={{ padding: "12px 15px" }}>Prom. LT Round Trip Week</th>
                                <th style={{ padding: "12px 15px", textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transits.map((t) => (
                                <tr
                                    key={t._id}
                                    onClick={() => {
                                        fetchById(t._id);
                                        setOpenView(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ padding: "12px 15px" }}>{t.origen}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.forwarder}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.numeroOp}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.avgPortToPort}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.avgTTender}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.avgDeltaTransit}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.maxLTCargaBodega}</td>
                                    <td style={{ padding: "12px 15px" }}>{t.avgLTRoundTripWeek}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", opacity: 0.5 }}>
                                        Próximamente…
                                    </td>
                                </tr>
                            ))}
                            {transits.length === 0 && (
                                <tr>
                                    <td colSpan={9} style={{ padding: "12px 15px", textAlign: "center" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modales */}
                <ModalCreateTransit
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onCreated={(nuevo) => setTransits([nuevo, ...transits])}
                />

                <ModalViewTransit
                    open={openView}
                    onClose={() => setOpenView(false)}
                    data={selectedTransit}
                    loading={loadingDetails}
                />
            </div>
        </Layout>
    );
}
