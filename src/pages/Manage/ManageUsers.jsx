import React, { useState } from "react";
import Delete from "../../assets/cross.svg";
import Edit from "../../assets/edit.svg";
import CreateUserIcon from "../../assets/create_user.svg";
import Button from "@mui/material/Button";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import CreateUserForm from "../../components/CreateUser/CreateUserForm";
import ModalGeneric from "../../components/Modals/ModalGeneric";
import ModalEditUser from "../../components/Modals/ModalEditUser";
import useUsers from "../../hooks/useUsers";
import usersService from "../../services/usersService";

export default function ManageUsers() {
    const { items: users, loading, refresh } = useUsers();
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

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
                                await usersService.remove(id);
                                toast.success("Usuario eliminado correctamente");
                                await refresh();
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
        await refresh();   // recargar lista completa
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
                onSave={async (updatedUser) => {
                    try {
                        await usersService.update(updatedUser._id, updatedUser);
                        toast.success("Usuario actualizado correctamente");
                        setOpenEdit(false);
                        await refresh();
                    } catch (err) {
                        console.error(err);
                        toast.error("Error al actualizar usuario en el servidor");
                    }
                }}
            />
        </div>
    );
}
