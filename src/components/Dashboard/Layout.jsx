import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./layout.css";

export default function Layout({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setMobileOpen(!mobileOpen);
        } else {
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        let hideTimer;

        const startHideTimer = () => {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    setIsOpen(false);
                } else {
                    setMobileOpen(false);
                }
            }, 10000); 
        };

        // Inicia el timer al cargar
        startHideTimer();

        // Detecta actividad del usuario para reiniciar el timer
        const resetTimer = () => startHideTimer();
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("touchstart", resetTimer);

        return () => {
            clearTimeout(hideTimer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("touchstart", resetTimer);
        };
    }, []);

    return (
        <div className="layout">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isOpen} mobileOpen={mobileOpen} />
            <main
                className={`main ${isOpen ? "sidebar-open" : "sidebar-collapsed"} ${mobileOpen ? "mobile-open" : ""
                    }`}
            >
                {children}
            </main>

            <Toaster position="top-right" />
        </div>
    );
}
