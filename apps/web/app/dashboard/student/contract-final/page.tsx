"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./contract-final.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const DYNAMIC_URL = "/api/contracts/dynamic";





export default function ContractFinalPage() {
  const router = useRouter();

  const [numPages, setNumPages] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadName, setUploadName] = useState<string | null>(null);

  // ✅ Mide ancho del contenedor del PDF para evitar overflow/desalineación
  const pdfWrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapWidth, setWrapWidth] = useState<number>(900);

  useEffect(() => {
    const el = pdfWrapRef.current;
    if (!el) return;

    const compute = () => {
      const PADDING_SAFE = 24; // deja aire dentro del wrap
      const w = Math.max(320, el.clientWidth - PADDING_SAFE);
      setWrapWidth(w);
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // ✅ Render prudente:
  // - En desktop no pasamos de ~820px para no “agrandar” demasiado letras
  // - En móvil sí usamos casi todo el ancho disponible
  const pageWidth = useMemo(() => {
    const maxDesktop = 820; // ← AJUSTA AQUÍ si quieres un poco más/menos
    return Math.min(maxDesktop, wrapWidth);
  }, [wrapWidth]);

  // ✅ Render nítido sin agrandar ancho:
  // si tu Windows está en 125%/150%, esto ayuda
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1.5;
    const base = window.devicePixelRatio || 1;
    // clamp para no reventar performance
    return Math.min(2, Math.max(1.25, base));
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadName(file.name);

    // ✅ luego conectas endpoint:
    // - subir certificado
    // - extraer banco/tipo/numero
  };

  const handleContinue = () => {
    alert("Continuar (pendiente: conectar flujo de subida y extracción de datos bancarios)");
    // router.push("/dashboard/student/next-step");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contrato generado</h1>

      {/* CARD SUPERIOR */}
      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <div>
            <h2 className={styles.infoTitle}>Revisión y validación del documento</h2>
            <p className={styles.infoText}>
              A continuación se muestra tu contrato generado con la información institucional registrada.
              Verifica que tus datos personales, facultad, carrera y periodo académico sean correctos antes de continuar.
            </p>
          </div>

          <span className={styles.badge}>Paso 2 de 2</span>
        </div>

        {/* ALERTA */}
        <div className={styles.alertBox}>
          <div className={styles.alertIcon}>!</div>
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Certificado bancario obligatorio</div>
            <div className={styles.alertText}>
              Para completar los campos de <b>banco</b>, <b>tipo de cuenta</b> y <b>número de cuenta</b>, sube tu{" "}
              <b>certificado bancario oficial</b>. El sistema usará ese documento para extraer y validar los datos.
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className={styles.actions}>
          <label className={styles.secondaryButton}>
            Subir certificado bancario
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handlePickFile}
              className={styles.hiddenInput}
            />
          </label>

          <button className={styles.primaryButton} onClick={handleContinue} disabled={!uploadName}>
            Continuar
          </button>
        </div>

        {/* Estado archivo */}
        {uploadName ? (
          <p className={styles.uploadInfo}>
            Archivo seleccionado: <b>{uploadName}</b>
          </p>
        ) : (
          <p className={styles.uploadHint}>
            Selecciona un archivo para habilitar <b>“Continuar”</b>.
          </p>
        )}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      {/* PDF */}
      <div className={styles.pdfSection}>
        <div className={styles.pdfWrap} ref={pdfWrapRef}>
          <Document
            file={DYNAMIC_URL}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p className={styles.pdfLoading}>Generando y cargando el contrato...</p>}
            error={<p className={styles.pdfError}>No se pudo cargar el contrato.</p>}
            onLoadError={(e) => {
              console.error(e);
              setErrorMessage("No se pudo cargar el contrato dinámico.");
            }}
          >


            {Array.from(new Array(numPages || 0), (_el, index) => (
              <div key={`pagewrap_${index + 1}`} className={styles.pageRow}>
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  devicePixelRatio={dpr}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
