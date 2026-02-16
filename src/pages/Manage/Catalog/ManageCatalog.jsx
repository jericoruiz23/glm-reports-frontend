import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import Layout from "../../../components/Dashboard/Layout";

const ManageCatalog = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [catalogId, setCatalogId] = useState("");
    const [label, setLabel] = useState("");
    const [loading, setLoading] = useState(false);
    const [catalogValues, setCatalogValues] = useState([]);
    const [catalogTipo, setCatalogTipo] = useState("");

    // Cargar catálogos
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const res = await fetch(
                    "https://backend-app-603253447614.us-central1.run.app/api/catalogos/list"
                );

                if (!res.ok) throw new Error("Error obteniendo catálogos");

                const data = await res.json();
                setCatalogs(data);
            } catch (error) {
                console.error(error);
                toast.error("Error cargando catálogos");
            }
        };

        fetchCatalogs();
    }, []);

    // Cargar valores del catálogo seleccionado
    useEffect(() => {
        if (!catalogId) {
            setCatalogValues([]);
            return;
        }

        const fetchCatalogValues = async () => {
            try {
                const res = await fetch(
                    `https://backend-app-603253447614.us-central1.run.app/api/catalogos/${catalogId}`
                );
                if (!res.ok) throw new Error("Error obteniendo valores del catálogo");

                const data = await res.json();
                setCatalogValues(data.valores || []);
            } catch (error) {
                console.error(error);
                toast.error("Error cargando valores del catálogo");
            }
        };

        fetchCatalogValues();
    }, [catalogId]);
    const handleDeleteValue = async (key) => {
        if (!catalogTipo) return;

        try {
            const res = await fetch(
                `https://backend-app-603253447614.us-central1.run.app/api/catalogos/${catalogTipo}/valor/${key}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Error al eliminar valor");

            toast.success("Valor eliminado correctamente");

            // 🔄 refrescar valores del catálogo
            const updatedRes = await fetch(
                `https://backend-app-603253447614.us-central1.run.app/api/catalogos/${catalogId}`
            );
            const updatedData = await updatedRes.json();
            setCatalogValues(updatedData.valores || []);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el valor");
        }
    };


    // Agregar valor
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!catalogId || !label.trim()) {
            toast.error("Seleccione un catálogo y escriba el valor");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `https://backend-app-603253447614.us-central1.run.app/api/catalogos/${catalogId}/valor`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ label: label.trim() }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al agregar valor");
            }

            toast.success("Valor agregado correctamente");
            setLabel("");

            // Refrescar valores
            const updatedRes = await fetch(
                `https://backend-app-603253447614.us-central1.run.app/api/catalogos/${catalogId}`
            );
            const updatedData = await updatedRes.json();
            setCatalogValues(updatedData.valores || []);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        (
            <Layout>
                {/* Contenedor principal centrado */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: 6,
                        pt: "3rem",
                    }}
                >
                    {/* 🔹 Izquierda: Lista de valores */}
                    <Box sx={{ width: 400 }}>
                        <Typography variant="h6" mb={2} align="center">
                            Valores del catálogo
                        </Typography>

                        {catalogValues.length === 0 ? (
                            <Typography variant="body2" align="center">
                                No hay valores aún
                            </Typography>
                        ) : (
                            <List>
                                {catalogValues.map((val) => (
                                    <React.Fragment key={val.key}>
                                        <ListItem
                                            secondaryAction={
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteValue(val.key)}
                                                >
                                                    x
                                                </Button>
                                            }
                                        >
                                            <ListItemText primary={val.label} />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>

                        )}
                    </Box>

                    {/* 🔹 Derecha: Formulario */}
                    <Box sx={{ width: 400 }}>
                        <Typography variant="h6" mb={2} align="center">
                            Agregar valor a catálogo
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                select
                                fullWidth
                                label="Catálogo"
                                value={catalogId}
                                onChange={(e) => {
                                    const selectedCat = catalogs.find(c => c._id === e.target.value);
                                    setCatalogId(selectedCat._id);
                                    setCatalogTipo(selectedCat.tipo); // 👈 clave
                                }}
                                margin="normal"
                            >

                                {catalogs.length === 0 && (
                                    <MenuItem disabled value="">
                                        No hay catálogos disponibles
                                    </MenuItem>
                                )}

                                {catalogs.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Nombre del valor"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                margin="normal"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={!catalogId || loading}
                            >
                                {loading ? "Guardando..." : "Agregar"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Layout>
        )
    );
};

export default ManageCatalog;
