import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../../components/Dashboard/Layout";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ModalViewAutomatic from "../../../components/Modals/Automatic/ModalViewAutomatic";

export default function ManageAutomatic() {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
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

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process`, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Error al cargar procesos");

            const data = await res.json();
            setProcesses(Array.isArray(data) ? data : data.data ?? []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los registros");
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id) => {
        try {
            setLoadingDetails(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process/${id}`, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Error al cargar detalle");

            const data = await res.json();
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
        .filter((p) => p.automatico && Object.keys(p.automatico).length > 0)
        .filter((p) => {
            const term = search.toLowerCase();

            const searchable = [
                p.inicio?.codigoImportacion,
                p.automatico?.proceso,
                p.automatico?.statusAduana,
                p.automatico?.tiempoTransitoInternacional,
                p.automatico?.diasLabEnvioElectronicoSalidaAutorizada,
                p.automatico?.diasLabEtaSalidaAutorizada,
                p.automatico?.diasCalLlegadaPuertoDespachoPuerto,
            ]
                .filter(Boolean)
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
                            <h1>Automático</h1>

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
                        </div>

                        {/* Tabla */}
                        <div className="card">
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                        <th style={th}>Código Importación</th>
                                        <th style={th}>Proceso</th>
                                        <th style={th}>Status Aduana</th>
                                        <th style={th}>Tránsito Internacional</th>
                                        <th style={th}>Envío → Salida Autorizada (Días Lab)</th>
                                        <th style={th}>ETA → Salida Autorizada (Días Lab)</th>
                                        <th style={th}>Llegada → Despacho Puerto (Días Cal)</th>
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
                                            <td style={td}>{p.automatico?.proceso || "-"}</td>
                                            <td style={td}>{p.automatico?.statusAduana || "-"}</td>
                                            <td style={td}>{p.automatico?.tiempoTransitoInternacional ?? "-"}</td>
                                            <td style={td}>{p.automatico?.diasLabEnvioElectronicoSalidaAutorizada ?? "-"}</td>
                                            <td style={td}>{p.automatico?.diasLabEtaSalidaAutorizada ?? "-"}</td>
                                            <td style={td}>{p.automatico?.diasCalLlegadaPuertoDespachoPuerto ?? "-"}</td>
                                        </tr>
                                    ))}

                                    {filteredProcesses.length === 0 && (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: "center", padding: "12px" }}>
                                                No hay registros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal */}
                        <ModalViewAutomatic
                            open={openEdit}
                            onClose={() => setOpenEdit(false)}
                            process={selectedProcess}
                            loading={loadingDetails}
                        />
                    </>
                )}
            </div>
        </Layout>
    );
}
