"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./contract-final.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

type DetectedBankData = {
  bankName: string;
  accountType: string;
  accountNumber: string;
  identification?: string;
  holderName?: string;
};

type SignatureMethod = "ELECTRONIC" | "MANUAL";

function extractNestErrorMessage(raw: string): string {
  try {
    const j = JSON.parse(raw);
    if (typeof j?.message === "string") return j.message;
    if (Array.isArray(j?.message) && typeof j.message?.[0] === "string") return j.message[0];
  } catch {}
  return raw;
}

function toFriendlyUploadError(msg: string): string {
  const m = (msg || "").toLowerCase();

  if (m.includes("no coincide") || m.includes("cédula") || m.includes("cedula")) {
    return (
      "⚠️ The uploaded bank certificate does not belong to your account.\n" +
      "Please upload a certificate issued for the scholarship holder (the ID number must match your profile)."
    );
  }

  if (m.includes("only pdf") || m.includes("pdf")) {
    return "⚠️ Please upload a PDF file (official bank certificate).";
  }

  return msg || "An unexpected error occurred while processing the certificate.";
}

export default function ContractFinalPage() {
  // -----------------------------
  // Contract preview + certificate flow
  // -----------------------------
  const [numPages, setNumPages] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [uploadName, setUploadName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [detected, setDetected] = useState<DetectedBankData | null>(null);
  const [savedOk, setSavedOk] = useState(false);

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

    // reset signature flow if user uploads a new certificate
    resetSignatureFlow();

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMessage("⚠️ Please upload a PDF file (official bank certificate).");
      e.target.value = "";
      return;
    }

    setUploadName(file.name);
    setIsUploading(true);

    try {
      // 1) parse via validation-service (Next route)
      const fd = new FormData();
      fd.append("file", file);

      const parseRes = await fetch("/api/validation/bank-certificate", {
        method: "POST",
        body: fd,
      });

      if (!parseRes.ok) {
        const raw = await parseRes.text();
        const msg = extractNestErrorMessage(raw);
        throw new Error(msg || "Unable to parse the certificate.");
      }

      const parsed = (await parseRes.json()) as DetectedBankData;

      if (!parsed?.bankName || !parsed?.accountType || !parsed?.accountNumber) {
        throw new Error("No bank account data could be detected in the certificate.");
      }

      setDetected(parsed);

      // 2) save in contracts-service (DB + file)
      const saveFd = new FormData();
      saveFd.append("file", file);
      saveFd.append("identification", parsed.identification ?? "");
      saveFd.append("bankName", parsed.bankName);
      saveFd.append("accountType", parsed.accountType);
      saveFd.append("accountNumber", parsed.accountNumber);
      saveFd.append("holderName", parsed.holderName ?? "N/A");

      const saveRes = await fetch("/api/contracts/bank-account", {
        method: "POST",
        body: saveFd,
      });

      if (!saveRes.ok) {
        const raw = await saveRes.text();
        const msg = extractNestErrorMessage(raw);
        throw new Error(toFriendlyUploadError(msg));
      }

      setSavedOk(true);
      setPdfNonce(Date.now());
    } catch (err: any) {
      console.error(err);
      const msg = typeof err?.message === "string" ? err.message : "";
      setErrorMessage(toFriendlyUploadError(msg));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  // -----------------------------
  // Signature flow (+ finalize contract)
  // -----------------------------
  // por ahora sigues con mock contract id (si quieres mañana lo hacemos dinámico desde contracts-service)
  const MOCK_CONTRACT_ID = "99999999-9999-9999-9999-999999999002";

  const [signatureMethod, setSignatureMethod] = useState<SignatureMethod | null>(null);
  const [signatureId, setSignatureId] = useState<string | null>(null);
  const [challengeCode, setChallengeCode] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");

  const [signatureStatus, setSignatureStatus] = useState<"IDLE" | "STARTED" | "SIGNED">("IDLE");
  const [signatureHash, setSignatureHash] = useState<string | null>(null);

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizedOk, setFinalizedOk] = useState(false);

  function resetSignatureFlow() {
    setSignatureMethod(null);
    setSignatureId(null);
    setChallengeCode(null);
    setConfirmCode("");
    setSignatureStatus("IDLE");
    setSignatureHash(null);
    setIsFinalizing(false);
    setFinalizedOk(false);
  }

  async function startSignature(method: SignatureMethod) {
    setErrorMessage("");

    try {
      const res = await fetch("/api/signatures/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: MOCK_CONTRACT_ID,
          method,
        }),
      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(extractNestErrorMessage(raw));
      }

      const data = await res.json();

      setSignatureMethod(method);
      setSignatureId(data.signatureId);
      setChallengeCode(data.challengeCode ?? null);
      setSignatureStatus("STARTED");
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to start signature process.");
    }
  }

  async function confirmSignature() {
    if (!signatureId) return;

    setErrorMessage("");

    try {
      const res = await fetch("/api/signatures/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureId,
          code: signatureMethod === "ELECTRONIC" ? confirmCode : undefined,
        }),
      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(extractNestErrorMessage(raw));
      }

      const data = await res.json();
      // ✅ aquí guardamos el hash para poder finalizar contrato
      setSignatureHash(data.signatureHash ?? null);
      setSignatureStatus("SIGNED");
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to confirm signature.");
    }
  }

  async function finalizeContract() {
    if (!signatureHash) {
      setErrorMessage("Missing signature hash. Please confirm the signature again.");
      return;
    }

    setErrorMessage("");
    setIsFinalizing(true);

    try {
      const res = await fetch("/api/contracts/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureHash }),
      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(extractNestErrorMessage(raw));
      }

      await res.json();
      setFinalizedOk(true);

      // refresca PDF (opcional) ya con status firmado
      setPdfNonce(Date.now());
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to finalize contract.");
    } finally {
      setIsFinalizing(false);
    }
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={styles.container}>
      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <div>
            <h2 className={styles.infoTitle}>Document Review and Validation</h2>
            <p className={styles.infoText}>
              Below you can preview your generated scholarship contract using the institutional data on record.
              Please verify your personal data, faculty, career, and academic period before continuing.
            </p>
          </div>
        </div>

        {/* ALERT */}
        {!savedOk ? (
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>!</div>
            <div className={styles.alertBody}>
              <div className={styles.alertTitle}>Bank Certificate Required</div>
              <div className={styles.alertText}>
                To complete the fields for <b>bank</b>, <b>account type</b>, and <b>account number</b>, please upload your{" "}
                <b>official bank certificate (PDF)</b>. The system will extract and validate the data automatically.
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>✓</div>
            <div className={styles.alertBody}>
              <div className={styles.alertTitle}>Certificate validated</div>
              <div className={styles.alertText}>
                Your bank data was saved successfully. Now choose your contract signing method.
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className={styles.actions}>
          {!savedOk && (
            <label className={styles.secondaryButton}>
              {isUploading ? "Processing..." : "Upload certificate (PDF)"}
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePickFile}
                className={styles.hiddenInput}
                disabled={isUploading}
              />
            </label>
          )}

          {savedOk && signatureStatus === "IDLE" && (
            <>
              <button className={styles.primaryButton} onClick={() => startSignature("ELECTRONIC")}>
                Sign electronically
              </button>
              <button className={styles.secondaryButton} onClick={() => startSignature("MANUAL")}>
                Sign manually (print & upload)
              </button>
            </>
          )}

          {signatureStatus === "STARTED" && signatureMethod === "ELECTRONIC" && (
            <div style={{ marginTop: 12, width: "100%" }}>
              <p style={{ marginBottom: 6 }}>Enter the confirmation code sent by the signature provider.</p>

              {/* debug opcional */}
              {challengeCode && (
                <p style={{ marginBottom: 6 }}>
                  <b>Mock code:</b> {challengeCode}
                </p>
              )}

              <input
                type="text"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="6-digit code"
                style={{ padding: 10, width: "100%", marginBottom: 10 }}
              />

              <button className={styles.primaryButton} onClick={confirmSignature}>
                Confirm signature
              </button>
            </div>
          )}

          {signatureStatus === "STARTED" && signatureMethod === "MANUAL" && (
            <button className={styles.primaryButton} onClick={confirmSignature}>
              Confirm manual signature
            </button>
          )}

          {signatureStatus === "SIGNED" && !finalizedOk && (
            <div style={{ marginTop: 12, width: "100%" }}>
              <p style={{ marginBottom: 8 }}>✅ Signature completed. Final step: store the final signed PDF.</p>

              <button className={styles.primaryButton} onClick={finalizeContract} disabled={isFinalizing}>
                {isFinalizing ? "Finalizing..." : "Finalize contract"}
              </button>

              {signatureHash && (
                <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                  <b>Signature hash:</b> {signatureHash}
                </p>
              )}
            </div>
          )}

          {finalizedOk && (
            <p style={{ marginTop: 10 }}>
              ✅ Contract stored successfully. You can now leave this page.
            </p>
          )}
        </div>

        {/* INFO */}
        {uploadName ? (
          <p className={styles.uploadInfo}>
            File: <b>{uploadName}</b>
          </p>
        ) : (
          <p className={styles.uploadHint}>Upload the certificate to enable signing.</p>
        )}

        {detected && (
          <p style={{ marginTop: 10 }}>
            Bank details detected: <b>{detected.bankName}</b> / <b>{detected.accountType}</b> /{" "}
            <b>{detected.accountNumber}</b>
          </p>
        )}

        {savedOk && <p style={{ marginTop: 6 }}>✅ Saved successfully. Your contract preview was updated.</p>}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      {/* PDF PREVIEW */}
      <div className={styles.pdfSection}>
        <div className={styles.pdfWrap} ref={pdfWrapRef}>
          <Document
            file={DYNAMIC_URL}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p className={styles.pdfLoading}>Generating and loading the contract...</p>}
            error={<p className={styles.pdfError}>Unable to load the contract preview.</p>}
            onLoadError={(e) => {
              console.error(e);
              setErrorMessage("Unable to load the dynamic contract preview.");
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
