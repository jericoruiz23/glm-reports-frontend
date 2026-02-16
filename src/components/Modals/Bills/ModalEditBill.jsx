import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";

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

export default function ModalEditBills({ open, onClose, bill, refresh }) {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (bill) setForm(bill);
    }, [bill]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_IP_PORT}/bills/update/${bill._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error al actualizar factura");

            toast.success("Factura actualizada");
            refresh();
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <h2 className="text-xl font-bold mb-4">Editar Factura</h2>

                <div className="flex flex-col gap-3">
                    <TextField label="Número" name="numero" value={form.numero || ""} onChange={handleChange} fullWidth />
                    <TextField label="Cliente" name="cliente" value={form.cliente || ""} onChange={handleChange} fullWidth />
                    <TextField label="Monto" name="monto" value={form.monto || ""} onChange={handleChange} fullWidth />
                    <TextField type="date" name="fecha" value={form.fecha || ""} onChange={handleChange} fullWidth />

                    <Button variant="contained" onClick={handleSubmit}>
                        Guardar Cambios
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
