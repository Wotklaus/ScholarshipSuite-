"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./contract-final.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function ContractFinalPage() {
  const router = useRouter();

  const [numPages, setNumPages] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [uploadName, setUploadName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [detected, setDetected] = useState<null | {
    bankName: string;
    accountType: string;
    accountNumber: string;
    identification?: string;
    holderName?: string;
  }>(null);

  const [savedOk, setSavedOk] = useState(false);

  // Para forzar reload del PDF cuando ya se guardó bank_account
  const [pdfNonce, setPdfNonce] = useState<number>(Date.now());
  const DYNAMIC_URL = useMemo(() => `/api/contracts/dynamic?ts=${pdfNonce}`, [pdfNonce]);

  const pdfWrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapWidth, setWrapWidth] = useState<number>(900);

  useEffect(() => {
    const el = pdfWrapRef.current;
    if (!el) return;

    const compute = () => {
      const PADDING_SAFE = 24;
      const w = Math.max(320, el.clientWidth - PADDING_SAFE);
      setWrapWidth(w);
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageWidth = useMemo(() => {
    const maxDesktop = 820;
    return Math.min(maxDesktop, wrapWidth);
  }, [wrapWidth]);

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1.5;
    const base = window.devicePixelRatio || 1;
    return Math.min(2, Math.max(1.25, base));
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => setNumPages(numPages);

  async function handlePickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage("");
    setSavedOk(false);
    setDetected(null);

    const file = e.target.files?.[0];
    if (!file) return;

    setUploadName(file.name);
    setIsUploading(true);

    try {
      // 1) Parse en validation-service (via Next route)
      const fd = new FormData();
      fd.append("file", file);

      const parseRes = await fetch("/api/validation/bank-certificate", {
        method: "POST",
        body: fd,
      });

      if (!parseRes.ok) {
        const text = await parseRes.text();
        throw new Error(text || "No se pudo parsear el certificado.");
      }

      const parsed = await parseRes.json();

      if (!parsed?.bankName || !parsed?.accountType || !parsed?.accountNumber) {
        throw new Error("No se detectaron datos bancarios en el certificado.");
      }

      setDetected(parsed);

      // 2) Guardar en contracts-service (DB + archivo)
      const saveFd = new FormData();
      saveFd.append("file", file);
      saveFd.append("identification", parsed.identification ?? "");
      saveFd.append("bankName", parsed.bankName);
      saveFd.append("accountType", parsed.accountType);
      saveFd.append("accountNumber", parsed.accountNumber);
      saveFd.append("holderName", parsed.holderName ?? "N/D");

      // ✅ AQUÍ ESTABA EL ERROR: PATCH -> POST
      const saveRes = await fetch("/api/contracts/bank-account", {
        method: "POST",
        body: saveFd,
      });

      if (!saveRes.ok) {
        const raw = await saveRes.text();

        // Intentar leer JSON típico de Nest: { message, error, statusCode }
        let msg = raw;
        try {
          const j = JSON.parse(raw);
          if (typeof j?.message === "string") msg = j.message;
        } catch { }

        // Mensaje “bonito” para el usuario
        if (msg.includes("no coincide")) {
          throw new Error(
            "⚠️ El certificado bancario que subiste no corresponde a tu usuario.\n" +
            "Recuerda: el certificado debe pertenecer al becario y la cédula debe coincidir."
          );
        }

        throw new Error(msg || "No se pudo guardar la información bancaria.");
      }

      setSavedOk(true);

      // 3) Forzar recarga del PDF dinámico ya con datos bancarios nuevos
      setPdfNonce(Date.now());
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        typeof err?.message === "string" ? err.message : "Ocurrió un error procesando el certificado."
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const handleContinue = () => {
    alert("Continuar (OK) — aquí conectas el siguiente paso real");
    // router.push("/dashboard/student/next-step");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contrato generado</h1>

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

        <div className={styles.actions}>
          <label className={styles.secondaryButton}>
            {isUploading ? "Procesando..." : "Subir certificado bancario"}
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handlePickFile}
              className={styles.hiddenInput}
              disabled={isUploading}
            />
          </label>

          <button className={styles.primaryButton} onClick={handleContinue} disabled={!savedOk || isUploading}>
            Continuar
          </button>
        </div>

        {uploadName ? (
          <p className={styles.uploadInfo}>
            Archivo seleccionado: <b>{uploadName}</b>
          </p>
        ) : (
          <p className={styles.uploadHint}>
            Selecciona un archivo para habilitar <b>“Continuar”</b>.
          </p>
        )}

        {detected && (
          <p style={{ marginTop: 10 }}>
            ✅ Datos detectados: <b>{detected.bankName}</b> / <b>{detected.accountType}</b> /{" "}
            <b>{detected.accountNumber}</b>
          </p>
        )}

        {savedOk && <p style={{ marginTop: 6 }}>✅ Guardado en el sistema. El contrato se actualizó.</p>}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

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
