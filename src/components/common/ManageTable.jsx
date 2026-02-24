import React from "react";
import styles from "./ManageTable.module.css";

const ALIGN_CLASS = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

/**
 * Tabla reutilizable para listados de gestion.
 * Recibe columnas declarativas y filas con render opcional por celda.
 */
export default function ManageTable({
  columns = [],
  rows = [],
  getRowKey,
  onRowClick,
  emptyMessage = "No hay registros.",
  emptyColSpan,
  getRowClassName,
}) {
  const colSpan = emptyColSpan ?? columns.length;

  return (
    <div className={`card ${styles.wrapper}`}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  styles.th,
                  ALIGN_CLASS[col.align || "left"],
                  col.headerClassName || "",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : row._id || index}
              className={[
                onRowClick ? styles.clickableRow : "",
                getRowClassName ? getRowClassName(row) : "",
              ].join(" ")}
              onClick={onRowClick ? () => onRowClick(row, index) : undefined}
            >
              {columns.map((col) => (
                <td
                  key={`${col.key}-${index}`}
                  className={[
                    styles.td,
                    ALIGN_CLASS[col.align || "left"],
                    col.cellClassName || "",
                  ].join(" ")}
                >
                  {col.render ? col.render(row, index) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td className={styles.emptyCell} colSpan={colSpan}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
