import React, { useEffect, useState } from "react";
import Layout from "../../components/Dashboard/Layout";
import toast from "react-hot-toast";
import ModalCreatePreshipping from "../../components/Modals/Preshipment/ModalCreatePreshipment";
import ModalEditPreshipping from "../../components/Modals/Preshipment/ModalEditPreshipment";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ManageShipping() {
    const [preembarques, setPreembarques] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedPreshipment, setSelectedPreshipment] = useState(null);
    const [procesos, setProcesos] = useState([]);

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
                setPreembarques([]);
                return;
            }

            if (!res.ok) throw new Error("Error al cargar preembarques");
            const dataRaw = await res.json();

            const preembarquesArray = Array.isArray(dataRaw)
                ? dataRaw
                    .filter(
                        p =>
                            p.currentStage === "preembarque" &&
                            Object.keys(p.preembarque || {}).some(
                                key => p.preembarque[key] !== null && p.preembarque[key] !== ""
                            )
                    )
                    .map(p => ({
                        _id: p._id,
                        codigoImportacion: p.inicio?.codigoImportacion || "-",
                        ...p.preembarque
                    }))
                : [];

            setPreembarques(preembarquesArray);
            setFiltered(preembarquesArray);
            setProcesos(dataRaw);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los registros");
            setPreembarques([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    // Filtrado
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(preembarques);
            return;
        }

        const lower = search.toLowerCase();

        setFiltered(
            preembarques.filter(p => [
                p.codigoImportacion,
                p.paisOrigen,
                p.formaPago,
                p.um,
                p.incoterms,
                p.entidadEmisoraDcp,
                p.numeroPermisoImportacion,
                p.valorFactura,
                p.cantidad,
                p.fechaFactura
                    ? new Date(p.fechaFactura).toLocaleDateString()
                    : ""
            ]
                .some(value =>
                    value?.toString().toLowerCase().includes(lower)
                ))
        );
    }, [search, preembarques]);


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
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: "3rem",
                    paddingBottom: "2rem",
                }}>
                    <h1>Pre-Embarques</h1>
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
                        >
                            Crear Pre-embarque
                        </Button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="card">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={th}>Código Importación</th>
                                <th style={th}>Origen</th>
                                <th style={th}>Fecha Factura</th>
                                <th style={th}>Valor Factura</th>
                                <th style={th}>Forma Pago</th>
                                <th style={th}>Cantidad</th>
                                <th style={th}>UM</th>
                                <th style={th}>Entidad Emisora</th>
                                <th style={th}>N° Permiso</th>
                                <th style={th}>Incoterms</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr
                                    key={p._id}
                                    onClick={() => { setSelectedPreshipment(p); setOpenDrawer(true); }}
                                    style={{ cursor: "pointer" }}

                                >
                                    <td style={td}>{p.codigoImportacion || "-"}</td>
                                    <td style={td}>{p.paisOrigen || "-"}</td>
                                    <td style={td}>{p.fechaFactura ? new Date(p.fechaFactura).toLocaleDateString() : "-"}</td>
                                    <td style={td}>{p.valorFactura || "-"}</td>
                                    <td style={td}>{p.formaPago || "-"}</td>
                                    <td style={td}>{p.cantidad || "-"}</td>
                                    <td style={td}>{p.um || "-"}</td>
                                    <td style={td}>{p.entidadEmisoraDcp || "-"}</td>
                                    <td style={td}>{p.numeroPermisoImportacion || "-"}</td>
                                    <td style={td}>{p.incoterms || "-"}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={10} style={{ padding: "12px 15px", textAlign: "center" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modales */}
                <ModalCreatePreshipping
                    open={openCreate}
                    onClose={async () => { setOpenCreate(false); await fetchData(); }}
                    onCreated={(nuevo) => setPreembarques([nuevo, ...preembarques])}
                    procesos={procesos}
                />

                <ModalEditPreshipping
                    open={openDrawer}
                    onClose={async () => {
                        setOpenDrawer(false)
                        await fetchData();
                    }}
                    data={selectedPreshipment}
                    onUpdated={(updated) => setPreembarques(prev => prev.map(p => p._id === updated._id ? updated : p))}
                    onDeleted={(id) => {
                        setPreembarques(prev => prev.filter(p => p._id !== id));
                        setOpenDrawer(false);
                        toast.success("Pre-embarque eliminado");
                    }}
                />
            </div>
        </Layout>
    );
}

