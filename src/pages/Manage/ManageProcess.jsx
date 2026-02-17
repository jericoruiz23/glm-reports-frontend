import React, { useState, useEffect } from "react";
import Delete from "../../assets/cross.svg";
import Edit from "../../assets/edit.svg";
import CreateUserIcon from "../../assets/create_user.svg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import ModalGeneric from "../../components/Modals/ModalGeneric";
import ModalEditUser from "../../components/Modals/ModalEditUser";
import { useMediaQuery } from "@mui/material";
import ModalProcesoDetalle from "../../components/Modals/ModalProcessDetail";
import ModalCreateProcess from "../../components/Modals/ModalCreateProcess";
import api from "../../services/api";


export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");
    const [search, setSearch] = useState("");
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedProceso, setSelectedProceso] = useState(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.get("/api/procesos");
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // 🔍 FILTRO COMPLETO
    const filteredProcesos = users.filter((p) => {
        const t = search.toLowerCase();

        return (
            p.name?.toLowerCase().includes(t) ||
            p.owner?.toLowerCase().includes(t) ||
            p.description?.toLowerCase().includes(t) ||
            p.status?.toLowerCase().includes(t) ||
            p.priority?.toLowerCase().includes(t) ||
            p.tags?.some((x) => x.toLowerCase().includes(t)) ||
            p.documents?.some((x) => x.toLowerCase().includes(t)) ||
            p.comments?.some(
                (c) =>
                    c.comment.toLowerCase().includes(t) ||
                    c.user.toLowerCase().includes(t)
            )
        );
    });

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
                <span style={{ fontWeight: 500, fontSize: 16 }}>
                    ¿Eliminar este proceso?
                </span>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={async () => {
                            try {
                                await api.del(`/api/procesos/${id}`);

                                setUsers(users.filter((u) => u._id !== id));
                                toast.success("Proceso eliminado correctamente");
                            } catch (err) {
                                console.error(err);
                                toast.error("No se pudo eliminar el proceso");
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

    const handleUserCreated = (newUser) => {
        setUsers([...users, newUser]);
        setOpenCreate(false);
    };

    if (loading) return <p>Cargando procesos...</p>;

    return (
        <div className="page" style={{ paddingTop: "1rem" }}>
            <Toaster position="top-center" reverseOrder={false} />

            {/* ---------- HEADER ---------- */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: "1rem",
                    paddingBottom: "2rem",
                }}
            >
                <h1>Procesos</h1>

                <Button
                    className="create-proceso-btn"
                    variant="outlined"
                    color="primary"
                    startIcon={
                        <img
                            src={CreateUserIcon}
                            alt="Crear"
                            style={{ width: 20, height: 20 }}
                        />
                    }
                    onClick={() => setOpenCreate(true)}
                >
                    {!isMobile && "Crear Proceso"}
                </Button>
            </div>

            {/* 🔍 BUSCADOR */}
            <TextField
                label="Buscar proceso..."
                variant="outlined"
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    marginBottom: "1.5rem",
                    background: "white",
                    borderRadius: "8px",
                }}
            />

            <div className="card">
                {/* ------------------ DESKTOP TABLE ------------------ */}
                <div className="responsive-table-wrapper">
                    <table
                        className="desktop-table"
                        style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    textAlign: "left",
                                }}
                            >
                                <th style={{ padding: "12px 15px" }}>Nombre</th>
                                <th style={{ padding: "12px 15px" }}>Responsable</th>
                                <th style={{ padding: "12px 15px" }}>Estado</th>
                                <th style={{ padding: "12px 15px" }}>Prioridad</th>
                                <th style={{ padding: "12px 15px" }}>Inicio</th>
                                <th style={{ padding: "12px 15px" }}>Fin</th>
                                <th
                                    style={{
                                        padding: "12px 15px",
                                        textAlign: "center",
                                    }}
                                >
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProcesos.map((proceso) => (
                                <tr key={proceso._id}
                                    onClick={() => {
                                        setSelectedProceso(proceso);
                                        setOpenDetails(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ padding: "12px 15px" }}>{proceso.name}</td>
                                    <td style={{ padding: "12px 15px" }}>
                                        {proceso.owner || "—"}
                                    </td>
                                    <td style={{ padding: "12px 15px" }}>
                                        {proceso.status}
                                    </td>
                                    <td style={{ padding: "12px 15px" }}>
                                        {proceso.priority}
                                    </td>

                                    <td style={{ padding: "12px 15px" }}>
                                        {proceso.startDate
                                            ? new Date(
                                                proceso.startDate
                                            ).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td style={{ padding: "12px 15px" }}>
                                        {proceso?.endDate
                                            ? new Date(
                                                proceso.endDate
                                            ).toLocaleDateString()
                                            : "—"}
                                    </td>

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
                                            onClick={(e) => {
                                                setSelectedUser(proceso);
                                                setOpenEdit(true);
                                                e.stopPropagation();
                                            }}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={Edit}
                                                alt="Editar"
                                                style={{ width: "20px" }}
                                            />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                handleDelete(proceso._id)
                                                e.stopPropagation();
                                            }

                                            }
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={Delete}
                                                alt="Eliminar"
                                                style={{ width: "20px" }}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ------------------ MOBILE CARDS ------------------ */}
                {filteredProcesos.map((proceso) => (
                    <div key={proceso._id} className="mobile-card">
                        <div className="mobile-card-row">
                            <span>
                                <strong>Nombre: </strong>
                            </span>
                            <span>{proceso.name}</span>
                        </div>

                        <div className="mobile-card-row">
                            <span>
                                <strong>Responsable: </strong>
                            </span>
                            <span>{proceso.owner || "—"}</span>
                        </div>

                        <div className="mobile-card-row">
                            <span>
                                <strong>Estado: </strong>
                            </span>
                            <span>{proceso.status}</span>
                        </div>

                        <div className="mobile-card-row">
                            <span>
                                <strong>Prioridad: </strong>
                            </span>
                            <span>{proceso.priority}</span>
                        </div>

                        <div className="mobile-card-row">
                            <span>
                                <strong>Inicio: </strong>
                            </span>
                            <span>
                                {proceso.startDate
                                    ? new Date(
                                        proceso.startDate
                                    ).toLocaleDateString()
                                    : "—"}
                            </span>
                        </div>

                        <div className="mobile-card-row">
                            <span>
                                <strong>Fin:</strong>
                            </span>
                            <span>
                                {proceso.endDate
                                    ? new Date(
                                        proceso.endDate
                                    ).toLocaleDateString()
                                    : "—"}
                            </span>
                        </div>

                        <div className="actions-row">
                            <button
                                onClick={() => {
                                    setSelectedUser(proceso);
                                    setOpenEdit(true);
                                }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <img src={Edit} alt="Editar" style={{ width: 22 }} />
                            </button>

                            <button
                                onClick={() => handleDelete(proceso._id)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <img src={Delete} alt="Eliminar" style={{ width: 22 }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para crear */}
            <ModalCreateProcess
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={handleUserCreated}
            />



            {/* Modal editar */}
            <ModalEditUser
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                user={selectedUser}
                onSave={(updatedUser) => {
                    setUsers(
                        users.map((u) =>
                            u._id === updatedUser._id ? updatedUser : u
                        )
                    );
                    setOpenEdit(false);

                    api.put(`/api/procesos/${updatedUser._id}`, updatedUser)
                        .then(() => toast.success("Proceso actualizado"))
                        .catch(() => toast.error("Error al actualizar"));
                }}
            />
            <ModalProcesoDetalle
                open={openDetails}
                onClose={() => setOpenDetails(false)}
                proceso={selectedProceso}
            />

        </div>
    );
}
