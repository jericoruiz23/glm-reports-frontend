import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

export default function ModalEditUser({ open, onClose, user, onSave }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setRole(user.role || "");
        }
    }, [user]);

    const handleSave = () => {
        if (!name || !email || !role) {
            toast.error("Completa todos los campos");
            return;
        }
        onSave({ ...user, name, email, role });
        toast.success("Usuario actualizado!");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: "rgba(255, 255, 255, 0.83)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                },
            }}
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Editar Usuario
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
                <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth size="small" />
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" />
                <TextField label="Rol" value={role} onChange={(e) => setRole(e.target.value)} fullWidth size="small" />
            </DialogContent>

            <DialogActions style={{ padding: "16px" }}>
                <Button variant="contained" color="info" onClick={handleSave}>Guardar</Button>
                <Button variant="outlined" color="error" onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
