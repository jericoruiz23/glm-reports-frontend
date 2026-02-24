import React from "react";
import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function ItemsSection({
  items,
  itemForm,
  setItemForm,
  handleItemChange,
  addItem,
  editItem,
  removeItem,
  cancelEditItem,
  downloadItemsTemplate,
  handleUploadItems,
  fileInputRef,
}) {
  return (
    <Stack spacing={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">Agregar Items</Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" onClick={downloadItemsTemplate}>
            Descargar formato ITEMS
          </Button>

          <Button variant="outlined" size="small" onClick={() => fileInputRef.current.click()}>
            Subir
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleUploadItems}
          />
        </Stack>
      </Box>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <TextField label="Codigo" name="codigo" value={itemForm.codigo} onChange={handleItemChange} fullWidth />
        <TextField label="Descripcion" name="descripcion" value={itemForm.descripcion} onChange={handleItemChange} fullWidth />
        <TextField label="Quintales Solicitados" name="quintalesSolicitados" type="number" value={itemForm.quintalesSolicitados} onChange={handleItemChange} fullWidth />
        <TextField label="Cajas Solicitados" name="cajasSolicitados" type="number" value={itemForm.cajasSolicitados} onChange={handleItemChange} fullWidth />
        <TextField label="Quintales Despachados" name="quintalesDespachados" type="number" value={itemForm.quintalesDespachados} onChange={handleItemChange} fullWidth />
        <TextField label="Cajas Despachados" name="cajasDespachados" type="number" value={itemForm.cajasDespachados} onChange={handleItemChange} fullWidth />

        <TextField label="Causales Retraso" name="causalesRetraso" value={itemForm.causalesRetraso} onChange={handleItemChange} fullWidth />
        <TextField label="Novedades Descarga" name="novedadesDescarga" value={itemForm.novedadesDescarga} onChange={handleItemChange} fullWidth />
        <TextField label="Anomalias Temperatura" name="anomaliasTemperatura" value={itemForm.anomaliasTemperatura} onChange={handleItemChange} fullWidth />
        <TextField label="Puerto Arribo" name="puertoArribo" value={itemForm.puertoArribo} onChange={handleItemChange} fullWidth />
        <TextField label="Marca" name="marca" value={itemForm.marca} onChange={handleItemChange} fullWidth />
        <TextField label="SKU" name="sku" value={itemForm.sku} onChange={handleItemChange} fullWidth />
        <TextField label="Semana Ingreso Bodega" name="semanaIngresoBodega" type="number" value={itemForm.semanaIngresoBodega} onChange={handleItemChange} fullWidth />
        <TextField label="Year" name="year" type="number" value={itemForm.year} onChange={handleItemChange} fullWidth />
        <TextField label="Sem Solicitud" name="semSolicitud" type="number" value={itemForm.semSolicitud} onChange={handleItemChange} fullWidth />
        <TextField label="Delta REQ vs Carga" name="deltaReqVsCarga" type="number" value={itemForm.deltaReqVsCarga} onChange={handleItemChange} fullWidth />

        <DatePicker
          label="Delta Fecha Solicitud vs ETD"
          format="DD-MM-YYYY"
          value={itemForm.deltaFechaSolicitudVsETD ? dayjs(itemForm.deltaFechaSolicitudVsETD) : null}
          onChange={(v) => setItemForm((p) => ({ ...p, deltaFechaSolicitudVsETD: v ? v.format("YYYY-MM-DD") : "" }))}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label="Delta Fecha Solicitud vs Carga"
          format="DD-MM-YYYY"
          value={itemForm.deltaFechaSolicitudVsCarga ? dayjs(itemForm.deltaFechaSolicitudVsCarga) : null}
          onChange={(v) => setItemForm((p) => ({ ...p, deltaFechaSolicitudVsCarga: v ? v.format("YYYY-MM-DD") : "" }))}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label="LT Fecha Carga Hasta Ingreso Bodega"
          format="DD-MM-YYYY"
          value={itemForm.ltFechaCargaHastaIngresoBodega ? dayjs(itemForm.ltFechaCargaHastaIngresoBodega) : null}
          onChange={(v) => setItemForm((p) => ({ ...p, ltFechaCargaHastaIngresoBodega: v ? v.format("YYYY-MM-DD") : "" }))}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <TextField label="LT Hasta Round Trip Week" name="ltHastaRoundTripWeek" type="number" value={itemForm.ltHastaRoundTripWeek} onChange={handleItemChange} fullWidth />
        <TextField label="Month" name="month" type="number" value={itemForm.month} onChange={handleItemChange} fullWidth />
        <TextField label="Sem Requerida" name="semRequerida" type="number" value={itemForm.semRequerida} onChange={handleItemChange} fullWidth />

        <TextField select label="On Time" name="onTime" value={itemForm.onTime || ""} onChange={handleItemChange} fullWidth>
          <MenuItem value="OK">OK</MenuItem>
          <MenuItem value="ATRASADO">ATRASADO</MenuItem>
        </TextField>

        <TextField label="TT Tender" name="ttTender" type="number" value={itemForm.ttTender} onChange={handleItemChange} fullWidth />
        <TextField label="Delta Tiempo Transito" name="deltaTiempoTransito" type="number" value={itemForm.deltaTiempoTransito} onChange={handleItemChange} fullWidth />
        <TextField label="SAT UN" name="satUN" type="number" value={itemForm.satUN} onChange={handleItemChange} fullWidth />
        <TextField label="SAT CONT" name="satCONT" type="number" value={itemForm.satCONT} onChange={handleItemChange} fullWidth />
        <TextField label="Flete Primario" name="fletePrimario" type="number" value={itemForm.fletePrimario} onChange={handleItemChange} fullWidth />
        <TextField label="Otros" name="otros" type="number" value={itemForm.otros} onChange={handleItemChange} fullWidth />
        <TextField label="Seguro" name="seguro" type="number" value={itemForm.seguro} onChange={handleItemChange} fullWidth />
        <TextField label="Suma Total" name="sumaTotal" type="number" value={itemForm.sumaTotal} onChange={handleItemChange} fullWidth />
      </Box>

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={addItem}>
          {itemForm._editingIndex != null ? "Actualizar Item" : "Agregar Item"}
        </Button>
        {itemForm._editingIndex != null && (
          <Button variant="outlined" color="secondary" onClick={cancelEditItem}>
            Cancelar
          </Button>
        )}
      </Box>

      {items.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1">Items agregados:</Typography>
          <Stack spacing={1}>
            {items.map((i, idx) => (
              <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" p={1} border="1px solid #ccc" borderRadius="8px">
                <Typography>
                  {i.codigo} - {i.descripcion} | QS: {i.quintalesSolicitados} | CS: {i.cajasSolicitados} | QD: {i.quintalesDespachados} | CD: {i.cajasDespachados} | OnTime: {i.onTime ? "Si" : "No"}
                </Typography>
                <Box>
                  <Button size="small" variant="outlined" color="info" onClick={() => editItem(idx)}>
                    Editar
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => removeItem(idx)} sx={{ ml: 1 }}>
                    Borrar
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
