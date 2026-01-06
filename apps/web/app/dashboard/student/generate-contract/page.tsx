"use client";

import React, { useState } from "react";
import styles from "./generate-contract.module.css"; // Estilos para el componente

export default function GenerateContract() {
  const [showPDF, setShowPDF] = useState(false); // Estado para mostrar el PDF
  const [loading, setLoading] = useState(false); // Estado de carga
  const [errorMessage, setErrorMessage] = useState(""); // Error al cargar

  const handleShowTemplate = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Cambiamos la bandera para mostrar el PDF
      setShowPDF(true);
    } catch (error) {
      setErrorMessage("Error al cargar la plantilla. Por favor, inténtalo de nuevo.");
      console.error("Detalles del error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generar Contrato de Becas</h1>

      <button
        className={styles.button}
        onClick={handleShowTemplate}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Ver Plantilla"}
      </button>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      {showPDF && (
        <div className={styles.pdfContainer}>
          {/* Renderizar el PDF con un <iframe> */}
          <iframe
            src="http://localhost:3002/static/Template-Exc.pdf" // URL del microservicio
            width="100%"
            height="600px"
            title="Plantilla de Contrato"
          ></iframe>
        </div>
      )}
    </div>
  );
}