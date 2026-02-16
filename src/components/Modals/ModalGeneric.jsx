import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalGeneric({ open, onClose, title, children, maxWidth = "sm" }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: "rgba(255, 255, 255, 0.83)", // un poco transparente
                    backdropFilter: "blur(10px)", // efecto glass
                    borderRadius: "12px",
                },
            }}
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {title}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
}
