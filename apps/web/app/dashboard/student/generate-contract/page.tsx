"use client";

import React, { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./generate-contract.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const TEMPLATE_URL = "http://localhost:3002/static/Template-Exc.pdf";
const DYNAMIC_URL = "http://localhost:3002/contracts/dynamic";

type Hint = {
  id: string;
  title: string;
  text: string;
};

const HINTS: Hint[] = [
  {
    id: "periodo",
    title: "Periodo académico",
    text: "Esto se reemplazará por tu periodo académico real según el sistema (ej: MAYO 2023 – SEPTIEMBRE 2023).",
  },
  {
    id: "numero",
    title: "Número de oficio",
    text: "Esto se reemplazará por el número oficial del contrato asignado por Bienestar Universitario.",
  },
  {
    id: "nombre",
    title: "Nombre del estudiante",
    text: "Esto se reemplazará por tu nombre completo tal como consta en tu registro institucional.",
  },
  {
    id: "id",
    title: "Identificación",
    text: "Esto se reemplazará por tu cédula registrada.",
  },
  {
    id: "facultad",
    title: "Facultad y carrera",
    text: "Esto se reemplazará por tu facultad y carrera oficiales registradas.",
  },
];

export default function GenerateContract() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPDF, setShowPDF] = useState(false);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeHint, setActiveHint] = useState<string | null>(null);

  const pageWidth = useMemo(() => {
    if (typeof window === "undefined") return 760;
    return Math.min(880, Math.max(650, window.innerWidth * 0.62));
  }, []);

  const handleContinue = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      setTemplateUrl(TEMPLATE_URL);
      setShowPDF(true);
      setStep(2);
    } catch (e) {
      console.error(e);
      setErrorMessage("No se pudo cargar la plantilla. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDynamic = () => {
    try {
      window.open(DYNAMIC_URL, "_blank");
    } catch (e) {
      console.error(e);
      setErrorMessage("No se pudo generar el contrato dinámico.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generar Contrato de Becas</h1>

      {/* CARD INICIAL (la que te gustaba) */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeHeader}>
          <div>
            <h2 className={styles.welcomeTitle}>¡Bienvenido/a al proceso de beca!</h2>
            <p className={styles.welcomeText}>
              Has sido seleccionado/a para el programa. El proceso es <b>automático</b>: el sistema
              tomará tu información institucional (nombre, identificación, facultad, carrera y periodo)
              y generará tu contrato de forma segura.
            </p>
          </div>

          <span className={styles.stepBadge}>Paso {step} de 2</span>
        </div>

        {/* CHECKLIST (lo que extrañabas) */}
        <div className={styles.checklist}>
          <div className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>Revisar la plantilla oficial</span>
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>Confirmar qué campos se reemplazarán con tus datos</span>
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>Generar el contrato dinámico con tu información real</span>
          </div>
        </div>

        {/* ALERTA NARANJA (la que te gustaba) */}
        <div className={styles.alertBox}>
          <div className={styles.alertIcon}>!</div>
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Importante</div>
            <div className={styles.alertText}>
              En la plantilla verás partes destacadas (amarillo). Esas secciones se reemplazarán automáticamente
              por tus datos reales. Si algo no coincide, no continúes y contacta a Bienestar Universitario.
            </div>
          </div>
        </div>

        {!showPDF ? (
          <button className={styles.primaryButton} onClick={handleContinue} disabled={loading}>
            {loading ? "Cargando..." : "Continuar"}
          </button>
        ) : (
          <button className={styles.primaryButton} onClick={handleStartDynamic}>
            Empezar
          </button>
        )}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      {/* TEMPLATE ESTÁTICO + PANEL DE ICONOS CON TOOLTIP */}
      {showPDF && templateUrl && (
        <div className={styles.templateSection}>
          <div className={styles.hintsPanel}>
            <h3 className={styles.hintsTitle}>Campos que se reemplazarán</h3>

            <div className={styles.hintsList}>
              {HINTS.map((h) => (
                <div key={h.id} className={styles.hintRow}>
                  <div
                    className={styles.hintBang}
                    onMouseEnter={() => setActiveHint(h.id)}
                    onMouseLeave={() => setActiveHint(null)}
                  >
                    !
                    {activeHint === h.id && (
                      <div className={styles.tooltip}>
                        <div className={styles.tooltipTitle}>{h.title}</div>
                        <div className={styles.tooltipText}>{h.text}</div>
                      </div>
                    )}
                  </div>
                  <span className={styles.hintLabel}>{h.title}</span>
                </div>
              ))}
            </div>

            <p className={styles.hintsFooter}>
              Revisa la plantilla a la derecha. Cuando estés listo, presiona <b>Empezar</b>.
            </p>
          </div>

          <div className={styles.pdfWrap}>
            <Document
              file={templateUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<p className={styles.pdfLoading}>Cargando el PDF...</p>}
              error={<p className={styles.pdfError}>No se pudo cargar el PDF desde el servidor.</p>}
            >
              {Array.from(new Array(numPages || 0), (_el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}
