import React from "react";
import { Box, Typography } from "@mui/material";
import Layout from "../../../components/Dashboard/Layout";
import useTimes from "../../../hooks/useTimes";

export default function ManageTimes() {
  const { items, loading, compararEtaEnvioElectronico, calcularFueraTiempo } =
    useTimes();

  if (loading) {
    return (
      <Layout>
        <p style={{ padding: "2rem" }}>Cargando registros...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box mt={3}>
        <Typography variant="h5" mb={2}>
          Reporte de Procesos
        </Typography>

        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.1)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "12px 15px" }}>ID</th>
                <th style={{ padding: "12px 15px" }}>
                  ETA - Envio Electronico
                </th>
                <th style={{ padding: "12px 15px" }}>
                  Envio Electronico - Salida Autorizada
                </th>
                <th style={{ padding: "12px 15px" }}>
                  Total ETA - Salida Autorizada
                </th>
                <th style={{ padding: "12px 15px" }}>A tiempo</th>
              </tr>
            </thead>

            <tbody>
              {items.map((proceso) => {
                const etaStatus = compararEtaEnvioElectronico(proceso);

                return (
                  <tr key={proceso._id}>
                    <td style={{ padding: "12px 15px" }}>
                      {proceso.codigoImportacion}
                    </td>
                    <td style={{ padding: "12px 15px", whiteSpace: "nowrap" }}>
                      {proceso.automatico?.diasHabilesRealEtaEnvioElectronico ??
                        "-"}
                      {etaStatus && <span style={{ marginLeft: 8 }}>{etaStatus}</span>}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      {proceso.automatico?.diasLabEnvioElectronicoSalidaAutorizada ??
                        "-"}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      {proceso.automatico?.diasLabEtaSalidaAutorizada ?? "-"}
                    </td>
                    <td style={{ padding: "12px 15px" }}>
                      {calcularFueraTiempo(proceso.automatico)}
                    </td>
                  </tr>
                );
              })}

              {items.length === 0 && (
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
