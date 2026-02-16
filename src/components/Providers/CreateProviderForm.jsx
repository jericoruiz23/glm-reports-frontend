import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import toast from "react-hot-toast";

export default function CreateProviderForm({ onProviderCreated }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // toma el token si tu API lo requiere
            const newProviderData = { name, email, phone, address, category };

            const res = await fetch(`${process.env.BACKEND_IP_PORT}/api/auth/providers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProviderData),
            });

            if (!res.ok) throw new Error("Error al crear proveedor");

            const createdProvider = await res.json(); // respuesta del backend con _id
            onProviderCreated(createdProvider); // actualiza la tabla en ManageProviders
            toast.success("Proveedor creado correctamente");

            // limpiar campos
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            setCategory("");
        } catch (err) {
            console.error(err);
            toast.error("No se pudo crear el proveedor");
        }
    };


    return (
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSubmit}>
            <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
            <TextField label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Button type="submit" variant="contained">Crear Proveedor</Button>
        </form>
    );
}
