// src/pages/manage/ManageImports.jsx
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import Layout from "../../components/Dashboard/Layout";
import ModalCreateImport from "../../components/Modals/ModalCreateImport";
import ModalEditImport from "../../components/Modals/ModalEditImport";

export default function ManageImports() {
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedImport, setSelectedImport] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Fetch de todos los imports
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/imports`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Error al cargar imports");

            const data = await res.json();
            setImports(data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar las importaciones");
        } finally {
            setLoading(false);
        }
    };

    // Fetch de un import por ID y abrir Drawer solo cuando está listo
    const fetchById = async (id) => {
        try {
            setLoadingDetails(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/api/imports/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Error al cargar detalle");
            const data = await res.json();
            setSelectedImport(data);
            setOpenDrawer(true); // Se abre el Drawer solo cuando hay data
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
                    <h1>Importaciones</h1>

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                    >
                        Crear Importación
                    </Button>
                </div>

                <div className="card">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={{ padding: "12px 15px" }}>Código Importación</th>
                                <th style={{ padding: "12px 15px" }}>Status</th>
                                <th style={{ padding: "12px 15px" }}>Origen</th>
                                <th style={{ padding: "12px 15px" }}>Destino</th>
                                <th style={{ padding: "12px 15px" }}>Descripción</th>
                                <th style={{ padding: "12px 15px" }}>Quintales Solicitados</th>
                                <th style={{ padding: "12px 15px" }}>Forwarder</th>
                                <th style={{ padding: "12px 15px" }}>MOT</th>
                                <th style={{ padding: "12px 15px", textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {imports.map((imp) => (
                                <tr
                                    key={imp._id}
                                    onClick={() => fetchById(imp._id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ padding: "12px 15px" }}>{imp.importCode}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.status}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.origin}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.destination}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.description}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.quintalesRequested}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.forwarder}</td>
                                    <td style={{ padding: "12px 15px" }}>{imp.mot}</td>

                                    <td
                                        style={{
                                            padding: "12px 15px",
                                            textAlign: "center",
                                            opacity: 0.5,
                                        }}
                                    >
                                        Próximamente…
                                    </td>
                                </tr>
                            ))}

                            {imports.length === 0 && (
                                <tr>
                                    <td colSpan="10" style={{ padding: "12px 15px", textAlign: "center" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <ModalCreateImport
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onCreated={(nuevo) => {
                        setImports([nuevo, ...imports]);
                    }}
                />

                <ModalEditImport
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    data={selectedImport}
                    loading={loadingDetails}
                    onUpdated={(updated) => {
                        setImports((prev) =>
                            prev.map((p) => (p._id === updated._id ? updated : p))
                        );
                        toast.success("Importación actualizada");
                    }}
                />
            </div>
        </Layout>
    );
}
