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
  {
    id: "periodo",
    title: "Academic period",
    text: "This will be replaced with your actual academic period from the system (e.g., MAY 2023 – SEPTEMBER 2023).",
  },
  {
    id: "numero",
    title: "Official document number",
    text: "This will be replaced with the official contract reference number assigned by Student Welfare.",
  },
  {
    id: "nombre",
    title: "Student name",
    text: "This will be replaced with your full name exactly as registered in the institutional system.",
  },
  {
    id: "id",
    title: "Identification",
    text: "This will be replaced with the ID number registered in the system.",
  },
  {
    id: "facultad",
    title: "Faculty and career",
    text: "This will be replaced with your official faculty and career on record.",
  },
  {
    id: "banco",
    title: "Bank",
    text: "This will be replaced with the bank registered in the system (e.g., BANCO PICHINCHA).",
  },
  {
    id: "tipoCuenta",
    title: "Account type",
    text: "This will be replaced with your registered account type (e.g., SAVINGS).",
  },
  {
    id: "cuenta",
    title: "Account number",
    text: "This will be replaced with your registered account number.",
  },
  {
    id: "titularFirma",
    title: "Account holder / Signature",
    text: "This will be replaced with the account holder (the scholarship beneficiary who signs the contract).",
  },
];

export default function GenerateContract() {
  const router = useRouter();

  // Worker only on client
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

  // Measure actual PDF container width
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
      setErrorMessage("Unable to load the template. Please try again.");
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
              <h2 className={styles.welcomeTitle}>Welcome!</h2>
              <p className={styles.welcomeText}>
                You have been selected for the program. This process is <b>automatic</b>: the system will use your
                institutional data (name, ID, faculty, career, and academic period) to generate your contract securely.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.checklist}>
          <div className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>Review the official template</span>
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>Confirm which fields will be replaced with your data</span>
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>Start your contract process</span>
          </div>
        </div>

        <div className={styles.alertBox}>
          <div className={styles.alertIcon}>!</div>
          <div className={styles.alertBody}>
            <div className={styles.alertTitle}>Important</div>
            <div className={styles.alertText}>
              In the template you will see highlighted sections (yellow). Those parts will be replaced automatically
              with your real data. If anything does not match, do not continue and contact Student Welfare.
            </div>
          </div>
        </div>

        {!showPDF && (
          <button className={styles.primaryButton} onClick={handleContinue} disabled={loading}>
            {loading ? "Loading..." : "Continue"}
          </button>
        )}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      {showPDF && templateUrl && (
        <>
          <div className={styles.templateSection}>
            <div className={styles.hintsPanel}>
              <h3 className={styles.hintsTitle}>Fields that will be replaced</h3>

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
                  loading={<p className={styles.pdfLoading}>Loading PDF...</p>}
                  error={<p className={styles.pdfError}>Unable to load the PDF from the server.</p>}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.primaryButton} onClick={handleStart}>
              Start
            </button>
          </div>
        </>
      )}
    </div>
  );
}
