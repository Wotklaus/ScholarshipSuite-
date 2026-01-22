"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import mqtt from "mqtt";
import styles from "./contract-final.module.css";

/* =====================================================
   react-pdf → CLIENT ONLY (CRÍTICO PARA BUILD)
   ===================================================== */
const Document = dynamic(
  () => import("react-pdf").then((m) => m.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import("react-pdf").then((m) => m.Page),
  { ssr: false }
);

/* =====================================================
   Types
   ===================================================== */
type DetectedBankData = {
  bankName: string;
  accountType: string;
  accountNumber: string;
  identification?: string;
  holderName?: string;
};

type SignatureMethod = "ELECTRONIC" | "MANUAL";

/* =====================================================
   Helpers
   ===================================================== */
function extractNestErrorMessage(raw: string): string {
  try {
    const j = JSON.parse(raw);
    if (typeof j?.message === "string") return j.message;
    if (Array.isArray(j?.message) && typeof j.message?.[0] === "string") {
      return j.message[0];
    }
  } catch {}
  return raw;
}

function toFriendlyUploadError(msg: string): string {
  const m = (msg || "").toLowerCase();

  if (m.includes("no coincide") || m.includes("cédula") || m.includes("cedula")) {
    return (
      "⚠️ The uploaded bank certificate does not belong to your account.\n" +
      "Please upload a certificate issued for the scholarship holder."
    );
  }

  if (m.includes("only pdf") || m.includes("pdf")) {
    return "⚠️ Please upload a PDF file (official bank certificate).";
  }

  return msg || "An unexpected error occurred while processing the certificate.";
}

/* =====================================================
   Page
   ===================================================== */
export default function ContractFinalPage() {
  /* -------------------- State -------------------- */
  const [numPages, setNumPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [mqttNotification, setMqttNotification] = useState<string | null>(null);

  const [uploadName, setUploadName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [detected, setDetected] = useState<DetectedBankData | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const [pdfNonce, setPdfNonce] = useState(Date.now());

  const DYNAMIC_URL = useMemo(
    () => `/api/contracts/dynamic?ts=${pdfNonce}`,
    [pdfNonce]
  );

  /* -------------------- Refs -------------------- */
  const pdfWrapRef = useRef<HTMLDivElement | null>(null);
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);

  /* -------------------- Layout / Responsive -------------------- */
  const [wrapWidth, setWrapWidth] = useState(900);
  const [dpr, setDpr] = useState(1.5);

  /* -------------------- react-pdf worker (CLIENT) -------------------- */
  useEffect(() => {
    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
    });
  }, []);

  /* -------------------- ResizeObserver (SAFE) -------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("ResizeObserver" in window)) return;

    const el = pdfWrapRef.current;
    if (!el) return;

    const compute = () => {
      const w = Math.max(320, el.clientWidth - 24);
      setWrapWidth(w);
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  /* -------------------- DPR (SAFE) -------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const base = window.devicePixelRatio || 1;
    setDpr(Math.min(2, Math.max(1.25, base)));
  }, []);

  const pageWidth = useMemo(() => Math.min(820, wrapWidth), [wrapWidth]);

  /* -------------------- MQTT (CLIENT ONLY) -------------------- */
  useEffect(() => {
    if (mqttClientRef.current) return;

    const client = mqtt.connect("ws://localhost:9001", {
      reconnectPeriod: 1000,
      keepalive: 30,
    });

    mqttClientRef.current = client;

    client.on("connect", () => {
      client.subscribe("dashboard/#");
    });

    client.on("message", (_topic, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        if (msg.type === "BANK_CERTIFICATE_UPLOADED") {
          setMqttNotification("✅ Certificado bancario cargado exitosamente");
        }
      } catch {}
    });

    return () => {
      mqttClientRef.current?.end(true);
      mqttClientRef.current = null;
    };
  }, []);

  /* -------------------- PDF -------------------- */
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) =>
    setNumPages(numPages);

  /* =====================================================
     Render
     ===================================================== */
  return (
    <div className={styles.container}>
      {mqttNotification && (
        <div className={styles.notification}>{mqttNotification}</div>
      )}

      <div className={styles.pdfSection}>
        <div className={styles.pdfWrap} ref={pdfWrapRef}>
          <Document
            file={DYNAMIC_URL}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p>Cargando contrato...</p>}
            error={<p>Error cargando el contrato.</p>}
          >
            {Array.from({ length: numPages }).map((_, index) => (
              <div key={index} className={styles.pageRow}>
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

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
