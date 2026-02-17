// src/pages/manage/ManageBills.jsx
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import Layout from "../../components/Dashboard/Layout";
import ModalViewBill from "../../components/Modals/Historical/ModalViewBill";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../../services/api";

export default function ManageBills() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Fetch de todos los bills
    const fetchData = async () => {
        try {
            const data = await api.get("/api/bills");
            setBills(data || []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar las facturas");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!bills || bills.length === 0) {
            toast.error("No hay datos para exportar");
            return;
        }

        // Transformar bills → filas Excel
        const dataForExcel = bills.map((b) => ({
            "Código": b.codigo ?? "-",
            "Descripción": b.descripcion ?? "-",
            "Origen": b.origen ?? "-",
            "Destino": b.destino ?? "-",

            "Quintales Solicitados": b.quintalesSolicitados ?? "-",
            "Cajas Solicitadas": b.cajasSolicitados ?? "-",
            "Semana Entrega": b.semanaEntrega ?? "-",

            "Marca": b.marca ?? "-",
            "SKU": b.sku ?? "-",
            "Peso Neto (Kg)": b.pesoNetoKg ?? "-",
            "Pallets": b.pallets ?? "-",
            "Quintales Requeridos": b.quintalesRequeridos ?? "-",
            "Cajas Requeridas": b.cajasRequeridas ?? "-",
            "Etapa Completada": b.stepCompleted ?? "-",

            "Fecha Creación": b.createdAt ? new Date(b.createdAt).toLocaleString() : "-",
            "Última Actualización": b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "-",
        }));

        // Crear libro Excel
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");

        // Descargar archivo
        XLSX.writeFile(workbook, "historico_facturas.xlsx");

        toast.success("Excel generado correctamente");
    };

    // Fetch por ID para abrir Drawer solo cuando está listo
    const fetchById = async (id) => {
        try {
            setLoadingDetails(true);
            const data = await api.get(`/api/bills/${id}`);
            setSelectedBill(data);
            setOpenDrawer(true);
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

    if (loading) return <p style={{ padding: "2rem" }}>Cargando facturas...</p>;

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
                    <h1>Histórico</h1>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Button
                            variant="outlined"
                            onClick={exportToExcel}
                        >
                            Exportar Excel
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenCreate(true)}
                        >
                            Crear Factura
                        </Button>
                    </div>
                </div>

                <div className="card">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                                <th style={{ padding: "12px 15px" }}>Código</th>
                                <th style={{ padding: "12px 15px" }}>Descripción</th>
                                <th style={{ padding: "12px 15px" }}>Origen</th>
                                <th style={{ padding: "12px 15px" }}>Destino</th>
                                <th style={{ padding: "12px 15px" }}>Quintales Solicitados</th>
                                <th style={{ padding: "12px 15px", textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bills.map((b) => (
                                <tr
                                    key={b._id}
                                    onClick={() => fetchById(b._id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ padding: "12px 15px" }}>{b.codigo}</td>
                                    <td style={{ padding: "12px 15px" }}>{b.descripcion}</td>
                                    <td style={{ padding: "12px 15px" }}>{b.origen}</td>
                                    <td style={{ padding: "12px 15px" }}>{b.destino}</td>
                                    <td style={{ padding: "12px 15px" }}>{b.quintalesSolicitados}</td>
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

                            {bills.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: "12px 15px", textAlign: "center" }}>
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modales */}
                {/* 
        <ModalCreateBill
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={(nuevo) => setBills([nuevo, ...bills])}
        />

        
        */}

                <ModalViewBill
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    data={selectedBill}
                    loading={loadingDetails}
                    onUpdated={(updated) => {
                        setBills((prev) =>
                            prev.map((p) => (p._id === updated._id ? updated : p))
                        );
                        toast.success("Factura actualizada");
                    }}
                />


            </div>
        </Layout>
    );
}
