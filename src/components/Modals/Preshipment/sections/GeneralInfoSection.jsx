import React from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function GeneralInfoSection({
  form,
  setForm,
  catalogos,
  procesos,
  handleChange,
  handleSubmit,
}) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          select
          name="procesoId"
          value={form.procesoId || ""}
          onChange={handleChange}
          SelectProps={{ native: true }}
          fullWidth
        >
          <option value="">Seleccionar Proceso</option>
          {procesos.filter((p) => p.currentStage === "inicio").map((p) => (
            <option key={p._id} value={p._id}>
              {p.inicio?.codigoImportacion || "Sin codigo"}
            </option>
          ))}
        </TextField>
        <TextField
          select
          name="paisOrigen"
          value={form.paisOrigen || ""}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="">Pais Origen</MenuItem>
          {catalogos.PAIS_ORIGEN.map((p) => (
            <MenuItem key={p.key} value={p.label}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <DatePicker
        label="Fecha Factura"
        format="DD-MM-YYYY"
        value={form.fechaFactura ? dayjs(form.fechaFactura) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaFactura: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField label="Valor Factura" name="valorFactura" type="number" value={form.valorFactura} onChange={handleChange} fullWidth />

      <TextField
        select
        label="Forma de Pago"
        name="formaPago"
        value={form.formaPago || ""}
        onChange={handleChange}
        fullWidth
      >
        {catalogos.FORMAS_PAGO.map((fp) => (
          <MenuItem key={fp.key} value={fp.label}>
            {fp.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField label="Cantidad" name="cantidad" type="number" value={form.cantidad} onChange={handleChange} fullWidth />

      <TextField
        select
        label="UM"
        name="um"
        value={form.um || ""}
        onChange={handleChange}
        fullWidth
      >
        {catalogos.UNIDADES_METRICAS.map((u) => (
          <MenuItem key={u.key} value={u.label}>
            {u.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Entidad Emisora DCP"
        name="entidadEmisoraDcp"
        value={form.entidadEmisoraDcp || ""}
        onChange={handleChange}
        fullWidth
      >
        {catalogos.DCP.map((d) => (
          <MenuItem key={d.key} value={d.label}>
            {d.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField label="Numero Permiso Importacion" name="numeroPermisoImportacion" value={form.numeroPermisoImportacion} onChange={handleChange} fullWidth />

      <DatePicker
        label="Fecha Solicitud Regimen"
        format="DD-MM-YYYY"
        value={form.fechaSolicitudRegimen ? dayjs(form.fechaSolicitudRegimen) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaSolicitudRegimen: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField label="Carta Reg21" name="cartaReg21" value={form.cartaReg21} onChange={handleChange} fullWidth />

      <DatePicker
        label="Fecha Solicitud Garantia"
        format="DD-MM-YYYY"
        value={form.fechaSolicitudGarantia ? dayjs(form.fechaSolicitudGarantia) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaSolicitudGarantia: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField
        select
        label="Aseguradora"
        name="aseguradora"
        value={form.aseguradora || ""}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="">Seleccione aseguradora</MenuItem>
        {catalogos.ASEGURADORA.map((a) => (
          <MenuItem key={a.key} value={a.label}>
            {a.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField label="Numero Garantia" name="numeroGarantia" value={form.numeroGarantia} onChange={handleChange} fullWidth />
      <TextField label="Monto Asegurado" name="montoAsegurado" type="number" value={form.montoAsegurado} onChange={handleChange} fullWidth />

      <DatePicker
        label="Fecha Inicio Garantia"
        format="DD-MM-YYYY"
        value={form.fechaInicioGarantia ? dayjs(form.fechaInicioGarantia) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaInicioGarantia: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <DatePicker
        label="Fecha Fin Garantia"
        format="DD-MM-YYYY"
        value={form.fechaFinGarantia ? dayjs(form.fechaFinGarantia) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaFinGarantia: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField label="Numero CDA Garantia" name="numeroCdaGarantia" value={form.numeroCdaGarantia} onChange={handleChange} fullWidth />

      <DatePicker
        label="Fecha Envio Poliza"
        format="DD-MM-YYYY"
        value={form.fechaEnvioPoliza ? dayjs(form.fechaEnvioPoliza) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaEnvioPoliza: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <DatePicker
        label="Fecha Recepcion Documento Original"
        format="DD-MM-YYYY"
        value={form.fechaRecepcionDocumentoOriginal ? dayjs(form.fechaRecepcionDocumentoOriginal) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaRecepcionDocumentoOriginal: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField label="Numero Poliza" name="numeroPoliza" value={form.numeroPoliza} onChange={handleChange} fullWidth />

      <TextField
        select
        label="Incoterms"
        name="incoterms"
        value={form.incoterms || ""}
        onChange={handleChange}
        fullWidth
      >
        {catalogos.INCOTERMS.map((i) => (
          <MenuItem key={i.key} value={i.label}>
            {i.label}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Fecha Recolect Estimada"
        format="DD-MM-YYYY"
        value={form.fechaRecolectEstimada ? dayjs(form.fechaRecolectEstimada) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaRecolectEstimada: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <DatePicker
        label="Fecha Recolect Proveedor"
        format="DD-MM-YYYY"
        value={form.fechaRecolectProveedor ? dayjs(form.fechaRecolectProveedor) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaRecolectProveedor: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <DatePicker
        label="Fecha Recolect Real"
        format="DD-MM-YYYY"
        value={form.fechaRecolectReal ? dayjs(form.fechaRecolectReal) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaRecolectReal: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <DatePicker
        label="Fecha Req Bodega"
        format="DD-MM-YYYY"
        value={form.fechaReqBodega ? dayjs(form.fechaReqBodega) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaReqBodega: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <DatePicker
        label="Fecha Max Req Bodega"
        format="DD-MM-YYYY"
        value={form.fechaMaxReqBodega ? dayjs(form.fechaMaxReqBodega) : null}
        onChange={(v) => setForm((p) => ({ ...p, fechaMaxReqBodega: v ? v.format("YYYY-MM-DD") : "" }))}
        slotProps={{ textField: { fullWidth: true } }}
      />

      <TextField label="Carta Aclaratoria" name="cartaAclaratoria" value={form.cartaAclaratoria} onChange={handleChange} fullWidth />
      <TextField label="Certificado de Origen" name="certificadoOrigen" value={form.certificadoOrigen} onChange={handleChange} fullWidth />
      <TextField label="Lista de Empaque" name="listaEmpaque" value={form.listaEmpaque} onChange={handleChange} fullWidth />
      <TextField label="Carta de Gastos" name="cartaGastos" value={form.cartaGastos} onChange={handleChange} fullWidth />

      <TextField label="Pais Procedencia" name="paisProcedencia" value={form.paisProcedencia || ""} disabled fullWidth />

      <Box mt={5} textAlign="right">
        <Button variant="contained" color="primary" size="large" sx={{ borderRadius: "12px", px: 4 }} onClick={handleSubmit}>
          Guardar
        </Button>
      </Box>
    </Stack>
  );
}
