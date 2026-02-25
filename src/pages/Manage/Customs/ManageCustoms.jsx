import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import Layout from "../../../components/Dashboard/Layout";
import ModalCreateCustoms from "../../../components/Modals/Customs/ModalCreateCustoms";
import ModalEditCustoms from "../../../components/Modals/Customs/ModalEditCustoms";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import processService from "../../../services/processService";

export default function ManageCustoms() {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
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

            const allProcesses = await processService.listAll();
            setProcesses(allProcesses);
        } catch (err) {
            console.error(err);
            if (err.status === 401) {
                toast.error("Sesión expirada. Vuelve a iniciar sesión.");
            } else {
                toast.error("No se pudieron cargar los registros");
            }
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id) => {
        try {
            setLoadingDetails(true);
            const data = await processService.getById(id);
            setSelectedProcess(data);
            setOpenEdit(true);
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

    const filteredProcesses = processes
        .filter((p) => p.currentStage === "aduana")
        .filter((p) => {
            const term = search.toLowerCase();
            const searchable = [
                ...Object.values(p.aduana ?? {}),
                p.inicio?.codigoImportacion,
                p.inicio?.facturaComercial,
            ]
                .map((v) => (v ? String(v) : ""))
                .join(" ")
                .toLowerCase();

            return searchable.includes(term);
        });

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
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingRight: "3rem",
                                paddingBottom: "1.5rem",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <h1>Aduana</h1>

                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
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
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
                                    Crear Registro
                                </Button>
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="card">
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                        <th style={th}>Código</th>
                                        <th style={th}>Factura Comercial</th>
                                        <th style={th}>Envío Electrónico</th>
                                        <th style={th}>Pago Liquidación</th>
                                        <th style={th}>Salida Autorizada</th>
                                        <th style={th}>Tipo Aforo</th>
                                        <th style={th}>Refrendo</th>
                                        <th style={th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProcesses.map((p) => (
                                        <tr
                                            key={p._id}
                                            onClick={() => fetchById(p._id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td style={td}>{p.inicio?.codigoImportacion || "-"}</td>
                                            <td style={td}>{p.inicio?.facturaComercial || "-"}</td>
                                            <td style={td}>
                                                {p.aduana?.fechaEnvioElectronico
                                                    ? new Date(p.aduana.fechaEnvioElectronico).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td style={td}>
                                                {p.aduana?.fechaPagoLiquidacion
                                                    ? new Date(p.aduana.fechaPagoLiquidacion).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td style={td}>
                                                {p.aduana?.fechaSalidaAutorizada
                                                    ? new Date(p.aduana.fechaSalidaAutorizada).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td style={td}>{p.aduana?.tipoAforo || "-"}</td>
                                            <td style={td}>{p.aduana?.refrendo || "-"}</td>
                                            <td style={td}>{p.aduana?.statusAduana || "-"}</td>
                                        </tr>
                                    ))}

                                    {filteredProcesses.length === 0 && (
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: "center", padding: "12px" }}>
                                                No hay registros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modales */}
                        <ModalCreateCustoms
                            open={openCreate}
                            onClose={() => setOpenCreate(false)}
                            procesos={processes}
                            onCreated={(nuevo) => setProcesses((prev) => [nuevo, ...prev])}
                        />

                        <ModalEditCustoms
                            open={openEdit}
                            onClose={() => setOpenEdit(false)}
                            data={selectedProcess}
                            loading={loadingDetails}
                            onUpdated={(updated) =>
                                setProcesses((prev) =>
                                    prev.map((p) => (p._id === updated._id ? updated : p))
                                )
                            }
                        />
                    </>
                )}
            </div>
        </Layout>
    );
}
