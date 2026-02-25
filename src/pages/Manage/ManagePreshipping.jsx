import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import ManageTable from "../../components/common/ManageTable";
import Layout from "../../components/Dashboard/Layout";
import ModalCreatePreshipping from "../../components/Modals/Preshipment/ModalCreatePreshipment";
import ModalEditPreshipping from "../../components/Modals/Preshipment/ModalEditPreshipment";
import useProcesses from "../../hooks/useProcesses";
import styles from "./ManageTableLayout.module.css";

export default function ManageShipping() {
  const { items, loading, refresh, error } = useProcesses({ showErrorToast: false });
  const [preembarques, setPreembarques] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPreshipment, setSelectedPreshipment] = useState(null);
  const [procesos, setProcesos] = useState([]);

  useEffect(() => {
    // Deriva la vista solo para etapa preembarque con datos cargados.
    const hasPreembarqueData = (preembarque = {}) =>
      Object.values(preembarque).some((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined && value !== "";
      });

    const allItems = Array.isArray(items) ? items : [];
    const inPreembarqueStage = allItems.filter((p) => p.currentStage === "preembarque");
    const withPreembarqueData = inPreembarqueStage.filter((p) => hasPreembarqueData(p.preembarque || {}));

    console.log("[ManagePreshipping] total items:", allItems.length);
    console.log("[ManagePreshipping] stage=preembarque:", inPreembarqueStage.length);
    console.log("[ManagePreshipping] stage=preembarque con data:", withPreembarqueData.length);
    console.log(
      "[ManagePreshipping] muestra stages:",
      allItems.slice(0, 10).map((p) => ({ id: p._id, stage: p.currentStage, codigo: p.inicio?.codigoImportacion || p.codigoImportacion }))
    );

    const preembarquesArray = Array.isArray(items)
      ? items
        .filter(
          (p) => p.currentStage === "preembarque" && hasPreembarqueData(p.preembarque || {})
        )
        .map((p) => ({
          _id: p._id,
          codigoImportacion: p.inicio?.codigoImportacion || p.codigoImportacion || "-",
          ...p.preembarque,
        }))
      : [];

    setPreembarques(preembarquesArray);
    setFiltered(preembarquesArray);
    setProcesos(Array.isArray(items) ? items : []);
  }, [items]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(preembarques);
      return;
    }

    const lower = search.toLowerCase();
    setFiltered(
      preembarques.filter((p) =>
        [
          p.codigoImportacion,
          p.paisOrigen,
          p.formaPago,
          p.um,
          p.incoterms,
          p.entidadEmisoraDcp,
          p.numeroPermisoImportacion,
          p.valorFactura,
          p.cantidad,
          p.fechaFactura ? new Date(p.fechaFactura).toLocaleDateString() : "",
        ].some((value) => value?.toString().toLowerCase().includes(lower))
      )
    );
  }, [search, preembarques]);

  useEffect(() => {
    if (!error) return;

    if (error.status === 401) {
      toast.error("Sesion expirada. Vuelve a iniciar sesion.");
      return;
    }

    toast.error("No se pudieron cargar los registros");
  }, [error]);

  // Define una sola vez la estructura visual de la tabla de gestion.
  const columns = [
    { key: "codigoImportacion", header: "Codigo Importacion" },
    { key: "paisOrigen", header: "Origen" },
    {
      key: "fechaFactura",
      header: "Fecha Factura",
      render: (row) => (row.fechaFactura ? new Date(row.fechaFactura).toLocaleDateString() : "-"),
    },
    { key: "valorFactura", header: "Valor Factura" },
    { key: "formaPago", header: "Forma Pago" },
    { key: "cantidad", header: "Cantidad" },
    { key: "um", header: "UM" },
    { key: "entidadEmisoraDcp", header: "Entidad Emisora" },
    { key: "numeroPermisoImportacion", header: "N Permiso" },
    { key: "incoterms", header: "Incoterms" },
  ];

  if (loading) {
    return (
      <Layout>
        <Box className={styles.loadingCenter}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`page ${styles.pageTop}`}>
        <div className={styles.headerBar}>
          <h1>Pre-Embarques</h1>
          <div className={styles.headerActions}>
            <input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
              Crear Pre-embarque
            </Button>
          </div>
        </div>

        <ManageTable
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row._id}
          onRowClick={(row) => {
            setSelectedPreshipment(row);
            setOpenDrawer(true);
          }}
        />

        <ModalCreatePreshipping
          open={openCreate}
          onClose={async () => {
            setOpenCreate(false);
            await refresh();
          }}
          onCreated={(nuevo) => setPreembarques([nuevo, ...preembarques])}
          procesos={procesos}
        />

        <ModalEditPreshipping
          open={openDrawer}
          onClose={async () => {
            setOpenDrawer(false);
            await refresh();
          }}
          data={selectedPreshipment}
          onUpdated={(updated) =>
            setPreembarques((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
          }
          onDeleted={(id) => {
            setPreembarques((prev) => prev.filter((p) => p._id !== id));
            setOpenDrawer(false);
            toast.success("Pre-embarque eliminado");
          }}
        />
      </div>
    </Layout>
  );
}
