// src/pages/manage/ManageBills.jsx
import React, { useState } from "react";
import Layout from "../../../components/Dashboard/Layout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FormFactura from "../../../components/Modals/Ingreso/FormBill";
import FormLogistica from "../../../components/Modals/Ingreso/FormLogistics";
import FormDispatch from "../../../components/Modals/Ingreso/FormDispatch";
// -------------------------
// Tab Panel sin TypeScript
// -------------------------
function CustomTabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}



// -------------------------
// Main component
// -------------------------
export default function ManageBills() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Layout>
            <Box sx={{ width: "100%", mt: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={value} onChange={handleChange} aria-label="Tabs de facturación">
                        <Tab label="Factura" {...a11yProps(0)} />
                        <Tab label="Logística" {...a11yProps(1)} />
                        <Tab label="Despacho" {...a11yProps(2)} />
                    </Tabs>
                </Box>

                <CustomTabPanel value={value} index={0}>
                    <FormFactura />
                </CustomTabPanel>


                <CustomTabPanel value={value} index={1}>

                    <FormLogistica />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                    <FormDispatch />
                </CustomTabPanel>
            </Box>
        </Layout>
    );
}
