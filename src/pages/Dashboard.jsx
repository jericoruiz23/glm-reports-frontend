import React, { useState } from "react";
import Layout from "../components/Dashboard/Layout";
import { useAuth } from "../context/AuthContext";
import { LinearProgress } from "@mui/material";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from "recharts";

export default function Dashboard() {
    const { user } = useAuth();

    const [highPriorityCount] = useState(0);
    const [loading] = useState(true);

    // Datos quemados para gráficos
    const trendData = [
        { week: "Semana 1", shipments: 12 },
        { week: "Semana 2", shipments: 18 },
        { week: "Semana 3", shipments: 14 },
        { week: "Semana 4", shipments: 20 },
    ];

    const barData = [
        { forwarder: "Maersk", count: 30 },
        { forwarder: "CMA CGM", count: 20 },
        { forwarder: "Hapag-Lloyd", count: 15 },
        { forwarder: "MSC", count: 25 },
    ];

    // Componente de widget
    const Widget = ({ title, children, fullWidth }) => (
        <div
            style={{
                background: "white",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                minHeight: "180px",
                justifyContent: "space-between",
                gridColumn: fullWidth ? "1 / -1" : "span 1",
            }}
        >
            <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 600 }}>{title}</h3>
            {children}
        </div>
    );

    return (
        <Layout>
            <h1 style={{ marginBottom: "0.5rem" }}>Dashboard</h1>
            {user && (
                <p style={{ marginBottom: "1.8rem" }}>
                    Bienvenido, <strong>{user.name}</strong> 👋
                </p>
            )}

            {/* GRID DE WIDGETS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {/* Widgets normales */}

                {/* KPI 1: Cumplimiento ETA → Envío Electrónico */}
                <Widget title="Cumplimiento ETA → Envío Electrónico">
                    <strong style={{ fontSize: "2rem", color: "#4caf50" }}>92%</strong>
                    <span style={{ opacity: 0.7 }}>Promedio del mes</span>
                    <LinearProgress
                        variant="determinate"
                        value={92}
                        sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: "#ececec",
                            "& .MuiLinearProgress-bar": { borderRadius: 6 },
                        }}
                    />
                </Widget>

                {/* KPI 2: Cumplimiento Desaduanización vs Estándar */}
                <Widget title="Cumplimiento desaduanización vs estándar">
                    <strong style={{ fontSize: "2rem", color: "#4caf50" }}>87%</strong>
                    <span style={{ opacity: 0.7 }}>Tiempo real vs eta</span>
                    <LinearProgress
                        variant="determinate"
                        value={87}
                        sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: "#ececec",
                            "& .MuiLinearProgress-bar": { borderRadius: 6 },
                        }}
                    />
                </Widget>

                {/* KPI 3: Lead Time total promedio */}
                <Widget title="Lead Time Total (ETA → Bodega)">
                    <strong style={{ fontSize: "2rem" }}>5.2 días</strong>
                    <span style={{ opacity: 0.7 }}>Promedio últimas 10 importaciones</span>
                </Widget>

                {/* KPI 4: Almacenaje promedio */}
                <Widget title="Costo de almacenaje">
                    <strong style={{ fontSize: "2rem" }}>$ 323.40</strong>
                    <span style={{ opacity: 0.7 }}>Por contenedor (promedio)</span>
                </Widget>

                {/* KPI 5: Operaciones sin demoraje */}
                <Widget title="Operaciones sin demoraje">
                    <strong style={{ fontSize: "2.2rem", color: "#4caf50" }}>100%</strong>
                    <span style={{ opacity: 0.7 }}>Últimos 2 meses</span>
                    <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: "#ececec",
                            "& .MuiLinearProgress-bar": { borderRadius: 6 },
                        }}
                    />
                </Widget>
                <Widget title="Procesos prioridad alta">
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "1.1rem",
                                }}
                            >
                                <span style={{ opacity: 0.7 }}>Total</span>
                                <strong style={{ fontSize: "2.3rem" }}>{highPriorityCount}</strong>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(highPriorityCount * 10, 100)}
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: "#ececec",
                                    "& .MuiLinearProgress-bar": { borderRadius: 6 },
                                }}
                            />
                        </>
                    )}
                </Widget>

                <Widget title="Pre-embarques activos">
                    <strong style={{ fontSize: "2rem" }}>34</strong>
                    <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>
                        Última actualización: hace 5 min
                    </span>
                </Widget>

                <Widget title="Envíos en tránsito">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ opacity: 0.75 }}>Activos</span>
                        <strong>12</strong>
                    </div>
                    <LinearProgress
                        variant="determinate"
                        value={60}
                        sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: "#ececec",
                            "& .MuiLinearProgress-bar": { borderRadius: 6 },
                        }}
                    />
                </Widget>
                <Widget title="Envíos últimos 4 semanas" fullWidth>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={trendData}>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="shipments"
                                stroke="#8884d8"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Widget>

                <Widget title="Retrasos detectados">
                    <strong style={{ fontSize: "2rem", color: "#d9534f" }}>3</strong>
                    <span style={{ opacity: 0.75 }}>2 inspecciones y 1 demora portuaria.</span>
                </Widget>

                <Widget title="Transit Time Port-to-Port">
                    <strong style={{ fontSize: "2rem" }}>14 días</strong>
                    <span style={{ opacity: 0.7 }}>Promedio del último mes</span>
                </Widget>

                <Widget title="Forwarder más usado">
                    <strong style={{ fontSize: "1.5rem" }}>Maersk</strong>
                    <span style={{ opacity: 0.7 }}>58% de los últimos envíos</span>
                </Widget>

                {/* GRÁFICOS ocupando toda la fila */}


                <Widget title="Distribución por Forwarder" fullWidth>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={barData}>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <XAxis dataKey="forwarder" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Widget>


            </div>
        </Layout>
    );
}
