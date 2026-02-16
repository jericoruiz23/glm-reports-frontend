import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import toast from "react-hot-toast";

export default function CreateUserForm({ onUserCreated, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { name, email, role };

        try {
            const res = await fetch(
                "https://backend-app-603253447614.us-central1.run.app/api/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al crear usuario");
            }

            const data = await res.json();

            toast.success("Usuario creado!");
            onUserCreated(data); // ✅ actualizar tabla
            onClose();           // ✅ cerrar modal
            setName(""); setEmail(""); setRole(""); // limpiar campos

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al crear usuario");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
            <TextField label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField
                select
                label="Rol"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                fullWidth
            >
                <MenuItem value="admin">Administración</MenuItem>
                <MenuItem value="viewer">Lectura</MenuItem>
            </TextField>
            <Button type="submit" variant="contained">Crear Usuario</Button>
        </form>
    );
}
