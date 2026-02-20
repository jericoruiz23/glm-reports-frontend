import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Delete from "../../assets/cross.svg";
import Edit from "../../assets/edit.svg";
import CreateUserIcon from "../../assets/create_user.svg";
import Button from "@mui/material/Button";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import CreateUserForm from "../../components/CreateUser/CreateUserForm";
import ModalGeneric from "../../components/Modals/ModalGeneric";
import ModalEditUser from "../../components/Modals/ModalEditUser";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    // Función para cargar usuarios desde backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Error al cargar usuarios");

            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Función para eliminar usuario
    const handleDelete = (id) => {
        toast((t) => (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    minWidth: "320px",
                    padding: "20px",
                    background: "white",
                    color: "black",
                    borderRadius: "10px",
                    textAlign: "center",
                }}
            >
                <span style={{ fontWeight: 500, fontSize: 16 }}>¿Eliminar este usuario?</span>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                });
                                if (!res.ok) throw new Error("Error al eliminar el usuario");
                                toast.success("Usuario eliminado correctamente");
                                fetchUsers(); // 🔄 recargar lista
                            } catch (err) {
                                console.error(err);
                                toast.error("No se pudo eliminar el usuario");
                            } finally {
                                toast.dismiss(t.id);
                            }
                        }}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                    >
                        Sí
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{
                            backgroundColor: "#F44336",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                    >
                        No
                    </button>
                </div>
            </div>
        ));
    };

    // Cuando se crea un usuario
    const handleUserCreated = async () => {
        setOpenCreate(false); // cerrar modal
        await fetchUsers();   // recargar lista completa
        toast.success("Usuario creado y lista actualizada!");
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div className="page" style={{ paddingTop: "1rem" }}>
            <Toaster position="top-center" reverseOrder={false} />

            <div
                className="page-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: "3rem",
                    paddingBottom: "2rem",
                }}
            >
                <h1>Usuarios</h1>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<img src={CreateUserIcon} alt="Crear Usuario" style={{ width: 20, height: 20 }} />}
                    onClick={() => setOpenCreate(true)}
                >
                    Crear Usuario
                </Button>
            </div>

            <div className="card">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                            <th style={{ padding: "12px 15px" }}>Nombre</th>
                            <th style={{ padding: "12px 15px" }}>Email</th>
                            <th style={{ padding: "12px 15px" }}>Rol</th>
                            <th style={{ padding: "12px 15px", textAlign: "center" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td style={{ padding: "12px 15px" }}>{user.name}</td>
                                <td style={{ padding: "12px 15px" }}>{user.email}</td>
                                <td style={{ padding: "12px 15px" }}>{user.role}</td>
                                <td
                                    style={{
                                        padding: "12px 15px",
                                        textAlign: "center",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "35px",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setOpenEdit(true);
                                        }}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <img src={Edit} alt="Editar" style={{ width: "20px", height: "20px" }} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <img src={Delete} alt="Eliminar" style={{ width: "20px", height: "20px" }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: "12px 15px", textAlign: "center" }}>
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear usuario */}
            <ModalGeneric
                open={openCreate}
                onClose={() => setOpenCreate(false)} // cerrar modal solo
                title="Crear Usuario"
            >
                <CreateUserForm
                    onUserCreated={handleUserCreated}
                    onClose={() => setOpenCreate(false)}
                />
            </ModalGeneric>

            {/* Modal para editar usuario */}
            <ModalEditUser
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                user={selectedUser}
                onSave={(updatedUser) => {
                    setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
                    setOpenEdit(false);

                    fetch(`${process.env.REACT_APP_API_URL}/api/users/${updatedUser._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(updatedUser),
                    })
                        .then(res => {
                            if (!res.ok) throw new Error("Error al actualizar usuario");
                            return res.json();
                        })
                        .then(() => toast.success("Usuario actualizado correctamente"))
                        .catch(err => {
                            console.error(err);
                            toast.error("Error al actualizar usuario en el servidor");
                        });
                }}
            />
        </div>
    );
}
