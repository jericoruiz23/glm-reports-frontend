import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

export default function ModalEditProvider({ open, onClose, provider, onSave }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (provider) {
            setName(provider.name || "");
            setEmail(provider.email || "");
            setPhone(provider.phone || "");
            setAddress(provider.address || "");
            setCategory(provider.category || "");
        }
    }, [provider]);

    const handleSave = () => {
        if (!name || !email) {
            toast.error("Nombre y email son requeridos");
            return;
        }
        onSave({ ...provider, name, email, phone, address, category });
        toast.success("Proveedor actualizado!");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ style: { backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(10px)", borderRadius: "12px" } }}>
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Editar Proveedor
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth size="small" />
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" />
                <TextField label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth size="small" />
                <TextField label="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth size="small" />
                <TextField label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth size="small" />
            </DialogContent>
            <DialogActions style={{ padding: "16px" }}>
                <Button variant="contained" color="info" onClick={handleSave}>Guardar</Button>
                <Button variant="outlined" color="error" onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
