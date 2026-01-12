"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./generate-contract.module.css";

const Document = dynamic(() => import("react-pdf").then((m) => m.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
});

const TEMPLATE_URL = "http://localhost:3002/static/Template-Exc.pdf";

type Hint = {
  id: string;
  title: string;
  text: string;
};

const HINTS: Hint[] = [
  { id: "periodo", title: "Periodo académico", text: "Se reemplazará por tu periodo académico real según el sistema (ej: MAYO 2023 – SEPTIEMBRE 2023)." },
  { id: "numero", title: "Número de oficio", text: "Se reemplazará por el número oficial del contrato asignado por Bienestar Universitario." },
  { id: "nombre", title: "Nombre del estudiante", text: "Se reemplazará por tu nombre completo tal como consta en tu registro institucional." },
  { id: "id", title: "Identificación", text: "Se reemplazará por tu cédula registrada en el sistema." },
  { id: "facultad", title: "Facultad y carrera", text: "Se reemplazará por tu facultad y carrera oficiales registradas." },
  { id: "banco", title: "Banco", text: "Se reemplazará por el banco registrado en el sistema (ej: BANCO PICHINCHA)." },
  { id: "tipoCuenta", title: "Tipo de cuenta", text: "Se reemplazará por tu tipo de cuenta registrada (ej: AHORROS)." },
  { id: "cuenta", title: "Número de cuenta", text: "Se reemplazará por tu número de cuenta registrado." },
  { id: "titularFirma", title: "Titular / Firma", text: "Se reemplazará por el titular de la cuenta (quien firma como becario/a)." },
];

export default function GenerateContract() {
  const router = useRouter();

  // worker solo cliente
  useEffect(() => {
    (async () => {
      const mod = await import("react-pdf");
      mod.pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
    })();
  }, []);

  const [step, setStep] = useState<1 | 2>(1);
  const [showPDF, setShowPDF] = useState(false);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ✅ medir ancho real del contenedor del PDF
  const pdfWrapRef = useRef<HTMLDivElement | null>(null);
  const [pdfWrapWidth, setPdfWrapWidth] = useState<number>(900);

  useEffect(() => {
    const el = pdfWrapRef.current;
    if (!el) return;

    const update = () => {
      setPdfWrapWidth(Math.max(320, el.clientWidth - 24));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const pageWidth = useMemo(() => {
    return Math.min(860, pdfWrapWidth);
  }, [pdfWrapWidth]);

  const handleContinue = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      setTemplateUrl(TEMPLATE_URL);
      setShowPDF(true);
      setStep(2);
      setPageNumber(1);
    } catch (e) {
      console.error(e);
      setErrorMessage("No se pudo cargar la plantilla. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    router.push("/dashboard/student/contract-final");
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeHeader}>
          <div className={styles.welcomeLeft}>
            <div className={styles.uceLogoWrap}>
              <img
                className={styles.uceLogo}
                src="/uce-logo.png"
                alt="Universidad Central del Ecuador"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div>
              <h2 className={styles.welcomeTitle}>¡Bienvenido/a!</h2>
              <p className={styles.welcomeText}>
                Has sido seleccionado/a para el programa. El proceso es <b>automático</b>: el sistema tomará tu
                información institucional (nombre, identificación, facultad, carrera y periodo) y generará tu contrato
                de forma segura.
              </p>
            </div>
          </div>
        </div>

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
            <span>Comenzar el proceso de tu contrato</span>
          </div>
        </div>

        <div className={styles.alertBox}>
          <div className={styles.alertIcon}>!</div>
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Importante</div>
            <div className={styles.alertText}>
              En la plantilla verás partes destacadas (amarillo). Esas secciones se reemplazarán automáticamente por tus
              datos reales. Si algo no coincide, no continúes y contacta a Bienestar Universitario.
            </div>
          </div>
        </div>

        {!showPDF && (
          <button className={styles.primaryButton} onClick={handleContinue} disabled={loading}>
            {loading ? "Cargando..." : "Continuar"}
          </button>
        )}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      {showPDF && templateUrl && (
        <>
          <div className={styles.templateSection}>
            <div className={styles.hintsPanel}>
              <h3 className={styles.hintsTitle}>Campos que se reemplazarán</h3>

              <div className={styles.hintsList}>
                {HINTS.map((h) => {
                  const open = expandedId === h.id;
                  return (
                    <div
                      key={h.id}
                      className={`${styles.hintItem} ${open ? styles.hintItemOpen : ""}`}
                      onMouseEnter={() => setExpandedId(h.id)}
                      onMouseLeave={() => setExpandedId(null)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.hintTopRow}>
                        <div className={styles.hintBang}>!</div>
                        <div className={styles.hintTitleText}>{h.title}</div>
                        <div className={styles.hintChevron}>{open ? "▾" : "▸"}</div>
                      </div>

                      <div className={styles.hintBody}>
                        <div className={styles.hintBodyInner}>{h.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.pdfWrap} ref={pdfWrapRef}>
              <div className={styles.pdfPage}>
                <Document
                  file={templateUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<p className={styles.pdfLoading}>Cargando el PDF...</p>}
                  error={<p className={styles.pdfError}>No se pudo cargar el PDF desde el servidor.</p>}
                >
                  <Page pageNumber={pageNumber} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
              </div>
            </div>
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.primaryButton} onClick={handleStart}>
              Comenzar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
