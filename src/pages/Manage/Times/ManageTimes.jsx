// src/components/Reports/ProcesosReport.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Dashboard/Layout";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";

export default function ProcesosReport() {
    const [procesos, setProcesos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/process`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Error al cargar procesos");

            const data = await res.json();
            setProcesos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los registros");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ===============================
    // COMPARACIÓN DE ETA → ENVÍO ELECTRÓNICO
    // ===============================
    const compararEtaEnvioElectronico = (proceso) => {
        const automatico = proceso.automatico;
        if (!automatico) return null;

        const dias = automatico.diasHabilesRealEtaEnvioElectronico;
        if (dias == null) return null;

        const regimen = String(proceso.inicio?.regimen ?? "");
        const transporte = proceso.postembarque?.tipoTransporte ?? "";

        if (regimen === "10" && transporte === "AEREO") {
            return dias > 1 ? "❌ Atrasado" : "✅ A tiempo";
        }

        // 🔥 CLAVE: no mostrar nada
        return null;
    };


    // ===============================
    // FUNCIÓN GENERAL FUERA DE TIEMPO
    // ===============================
    const calcularFueraTiempo = (automatico) => {
        if (!automatico) return "-";

        const d1 = automatico.diasHabilesRealEtaEnvioElectronico;
        const d2 = automatico.diasLabEnvioElectronicoSalidaAutorizada;
        const total = automatico.diasLabEtaSalidaAutorizada;

        if (d1 == null && d2 == null && total == null) return "-";

        if ((d1 ?? 0) > 3 || (d2 ?? 0) > 5 || (total ?? 0) > 7) {
            return "Atrasado";
        }

        return "A tiempo";
    };


    if (loading) return <Layout><p style={{ padding: "2rem" }}>Cargando registros...</p></Layout>;

    return (
        <Layout>
            <Box mt={3}>
                <Typography variant="h5" mb={2}>Reporte de Procesos</Typography>

                <div className="card" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={{ padding: "12px 15px" }}>ID</th>
                                <th style={{ padding: "12px 15px" }}>ETA → Envío Electrónico</th>
                                <th style={{ padding: "12px 15px" }}>Envío Electrónico → Salida Autorizada</th>
                                <th style={{ padding: "12px 15px" }}>Total ETA → Salida Autorizada</th>
                                <th style={{ padding: "12px 15px" }}>A tiempo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {procesos.map((p) => (
                                <tr key={p._id}>
                                    <td style={{ padding: "12px 15px" }}>{p.codigoImportacion}</td>
                                    <td style={{ padding: "12px 15px", whiteSpace: "nowrap" }}>
                                        {p.automatico?.diasHabilesRealEtaEnvioElectronico ?? "-"}
                                        {compararEtaEnvioElectronico(p) && (
                                            <span style={{ marginLeft: 8 }}>
                                                {compararEtaEnvioElectronico(p)}
                                            </span>
                                        )}
                                    </td>


                                    <td style={{ padding: "12px 15px" }}>
                                        {p.automatico?.diasLabEnvioElectronicoSalidaAutorizada ?? "-"}
                                    </td>
                                    <td style={{ padding: "12px 15px" }}>
                                        {p.automatico?.diasLabEtaSalidaAutorizada ?? "-"}
                                    </td>
                                    <td style={{ padding: "12px 15px" }}>
                                        {calcularFueraTiempo(p.automatico)}
                                    </td>
                                </tr>
                            ))}

                            {procesos.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: "12px 15px", textAlign: "center" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </Layout>
    );
}
