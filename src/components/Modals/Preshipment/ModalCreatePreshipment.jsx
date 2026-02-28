import React from "react";
import { Drawer, Box, Typography, IconButton, Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GeneralInfoSection from "./sections/GeneralInfoSection";
import ItemsSection from "./sections/ItemsSection";
import usePreshipmentForm from "../../../hooks/usePreshipmentForm";

export default function ModalCreatePreshipment({ open, onClose, onCreated, procesos = [] }) {
  const {
    form,
    setForm,
    items,
    itemForm,
    setItemForm,
    tabIndex,
    setTabIndex,
    catalogos,
    handleChange,
    handleItemChange,
    handleUploadItems,
    downloadItemsTemplate,
    addItem,
    editItem,
    removeItem,
    cancelEditItem,
    handleSubmit,
    fileInputRef,
  } = usePreshipmentForm({ open, onClose, onCreated, procesos });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "700px",
          backdropFilter: "blur(15px)",
          background: "rgba(255,255,255,1)",
          padding: "2rem",
          borderRadius: "20px 0 0 20px",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Crear Pre-Embarque
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs value={tabIndex} onChange={(_, value) => setTabIndex(value)} sx={{ mt: 2 }}>
        <Tab label="Datos Generales" />
        <Tab label="Items" />
      </Tabs>

      <Box mt={3} maxHeight="70vh" overflow="auto">
        {tabIndex === 0 && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <GeneralInfoSection
              form={form}
              setForm={setForm}
              catalogos={catalogos}
              procesos={procesos}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </LocalizationProvider>
        )}

        {tabIndex === 1 && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemsSection
              items={items}
              itemForm={itemForm}
              setItemForm={setItemForm}
              handleItemChange={handleItemChange}
              addItem={addItem}
              editItem={editItem}
              removeItem={removeItem}
              cancelEditItem={cancelEditItem}
              downloadItemsTemplate={downloadItemsTemplate}
              handleUploadItems={handleUploadItems}
              fileInputRef={fileInputRef}
            />
          </LocalizationProvider>
        )}
      </Box>
    </Drawer>
  );
}
