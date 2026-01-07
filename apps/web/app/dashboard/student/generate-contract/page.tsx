"use client"; // Marca el componente como Client Component

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./generate-contract.module.css"; // Estilos locales

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const GenerateContract: React.FC = () => {
  const [showPDF, setShowPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);

  const handleShowTemplate = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const url = "http://localhost:3002/contracts/template";
      setTemplateUrl(url);
      setShowPDF(true);
    } catch (error) {
      console.error("Error al cargar la plantilla:", error);
      setErrorMessage("Error al cargar la plantilla. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDynamicContract = async () => {
    try {
      const userId = "12345";
      window.open(`http://localhost:3002/contracts/dynamic?userId=${userId}`, '_blank');
    } catch (error) {
      console.error("Error generando el contrato dinámico:", error);
      setErrorMessage("Hubo un problema al generar el contrato dinámico. Inténtalo nuevamente.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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

      {showPDF && templateUrl && (
        <div className={styles.pdfContainer}>
          <Document
            file={templateUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p>Cargando el PDF...</p>}
            error={<p>No se pudo cargar el PDF desde el servidor.</p>}
          >
            {Array.from(new Array(numPages || 0), (_el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={window.innerWidth * 0.62} /* Ajusta el ancho según la ventana */
                renderTextLayer={false}       /* Desactiva la capa de texto */
                renderAnnotationLayer={false} /* Desactiva la capa de anotaciones */
              />
            ))}
          </Document>
        </div>
      )}

      {showPDF && (
        <button
          className={styles.button}
          onClick={handleGenerateDynamicContract}
        >
          Generar Contrato Dinámico
        </button>
      )}
    </div>
  );
};

export default GenerateContract;