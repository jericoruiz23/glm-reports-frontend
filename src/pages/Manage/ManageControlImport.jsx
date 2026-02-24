import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import * as XLSX from "xlsx-js-style";
import toast from "react-hot-toast";
import ManageTable from "../../components/common/ManageTable";
import ModalViewControlImport from "../../components/Modals/ControlImport/ModalViewControlImport";
import Layout from "../../components/Dashboard/Layout";
import { useAuth } from "../../context/AuthContext";
import styles from "./ManageTableLayout.module.css";



import { celdasExcel } from "./ControlImport/controlimportOptions";
import useProcesses from "../../hooks/useProcesses";

export default function ManageControlImport() {
  const { items: preembarques, loading, refresh, error } = useProcesses({ showErrorToast: false });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const getValueByPath = (obj, path, fallback = "") => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? fallback;
  };

  // Aplana todos los valores para aplicar el buscador global sobre el registro completo.
  const flattenObjectValues = (obj) => {
    let values = [];
    Object.values(obj || {}).forEach((value) => {
      if (value == null) return;
      if (typeof value === "object" && !(value instanceof Date)) {
        values = values.concat(flattenObjectValues(value));
      } else {
        values.push(String(value));
      }
    });
    return values;
  };

  const filtered = preembarques.filter((p) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    const allValues = flattenObjectValues(p).join(" ").toLowerCase();
    return allValues.includes(term);
  });

  const isDateValue = (v) => {
    if (!v) return false;
    if (v instanceof Date) return true;

    if (typeof v === "string") {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (!isoRegex.test(v)) return false;
      return !isNaN(new Date(v).getTime());
    }

    return false;
  };

  const exportToExcel = () => {
    if (!preembarques.length) {
      toast.error("No hay datos para exportar");
      return;
    }

    const rows = preembarques.map((item) => {
      const row = {};

      celdasExcel.forEach(({ header, path }) => {
        let value = getValueByPath(item, path);

        if (isDateValue(value)) value = new Date(value);
        if (typeof value === "boolean") value = value ? "Si" : "No";
        if (value === null || value === undefined || Number.isNaN(value)) value = "";

        row[header] = value;
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows, { cellDates: true });

    Object.keys(ws).forEach((cell) => {
      if (cell[0] === "!") return;
      if (ws[cell].v instanceof Date) {
        ws[cell].t = "d";
        ws[cell].z = "dd/mm/yyyy";
      }
    });

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = {
        fill: { patternType: "solid", fgColor: { rgb: "C0C0C0" } },
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    ws["!autofilter"] = { ref: ws["!ref"] };
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    ws["!cols"] = celdasExcel.map(() => ({ wch: 22 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Control Importacion");
    XLSX.writeFile(wb, `control_importacion_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  useEffect(() => {
    if (!error) return;

    if (error.status === 401) {
      toast.error("Sesion expirada. Vuelve a iniciar sesion.");
      return;
    }

    toast.error("No se pudieron cargar los registros");
  }, [error]);

  // Columnas declarativas para reutilizar la tabla comun.
  const columns = [
    { key: "codigo", header: "Codigo", render: (row) => row.inicio?.codigoImportacion || "-" },
    { key: "proceso", header: "Proceso", render: (row) => row.proceso || "-" },
    { key: "prioridad", header: "Prioridad", render: (row) => row.inicio?.prioridad || "-" },
    { key: "proveedor", header: "Proveedor", render: (row) => row.inicio?.proveedor || "-" },
    { key: "origen", header: "Origen", render: (row) => row.preembarque?.paisOrigen || "-" },
    { key: "valorFactura", header: "Valor Factura", render: (row) => row.preembarque?.valorFactura ?? "-" },
    {
      key: "etapa",
      header: "Etapa",
      render: (row) => <span className={styles.stageCell}>{row.currentStage}</span>,
    },
    {
      key: "actualizado",
      header: "Actualizado",
      render: (row) => (row.updatedAt ? new Date(row.updatedAt).toLocaleDateString("es-ES") : "-"),
    },
    {
      key: "estado",
      header: "Estado",
      render: (row) => (
        <span
          className={`${styles.statusCell} ${row.anulado ? styles.statusCancelled : styles.statusActive}`}
        >
          {row.anulado ? "Anulado" : "Activo"}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className={`page ${styles.pageTop}`}>
        {loading ? (
          <Box className={styles.loadingCenter}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className={styles.headerBar}>
              <h1>Control de Importacion</h1>

              <div className={styles.headerActions}>
                <input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${styles.searchInput} ${styles.searchInputCompact}`}
                />
                <Button variant="outlined" onClick={exportToExcel}>
                  Exportar Excel
                </Button>
              </div>
            </div>

            <ManageTable
              columns={columns}
              rows={filtered}
              getRowKey={(row) => row._id}
              onRowClick={(row) => {
                setSelected(row);
                setOpenDrawer(true);
              }}
            />

            <ModalViewControlImport
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              selected={selected}
              currentUser={user}
              onUpdated={refresh}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
