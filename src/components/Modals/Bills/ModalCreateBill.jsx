import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import api from "../../../services/api";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 2,
};

export default function ModalCreateBills({ open, onClose, refresh }) {
    const [form, setForm] = useState({
        numero: "",
        cliente: "",
        monto: "",
        fecha: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await api.post("/bills/create", form);
            toast.success("Factura creada");
            refresh();
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <h2 className="text-xl font-bold mb-4">Crear Factura</h2>

                <div className="flex flex-col gap-3">
                    <TextField label="Número" name="numero" value={form.numero} onChange={handleChange} fullWidth />
                    <TextField label="Cliente" name="cliente" value={form.cliente} onChange={handleChange} fullWidth />
                    <TextField label="Monto" name="monto" value={form.monto} onChange={handleChange} fullWidth />
                    <TextField type="date" name="fecha" value={form.fecha} onChange={handleChange} fullWidth />

                    <Button variant="contained" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
