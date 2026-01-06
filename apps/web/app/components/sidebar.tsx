"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./style/sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers, faFileContract, faFileAlt, faFileCircleCheck, faFileExcel, faChartLine, faHome, faSignOutAlt, faMoneyCheckAlt, faPen } from "@fortawesome/free-solid-svg-icons";

type SidebarProps = {
  role: "admin" | "student";
};

const Sidebar = ({ role }: SidebarProps) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionName: string) => {
    setOpenSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        -<FontAwesomeIcon icon={faUsers} />  - Scholarship
      </div>
      <div className={styles.sidebarContent}>
        {role === "admin" && (
          <>
            {/* Core */}
            <div className={styles.sidebarHeading}>Core</div>
            <Link className={styles.sidebarLink} href="/dashboard/admin">
              <FontAwesomeIcon icon={faChartLine} /> Admin Dashboard
            </Link>

            {/* Management */}
            <div className={styles.sidebarHeading}>Management</div>
            <div className={styles.sidebarGroup}>
              <button
                className={styles.collapsible}
                onClick={() => toggleSection("users")}
              >
                <FontAwesomeIcon icon={faUsers} /> Users
              </button>
              {openSections["users"] && (
                <div className={styles.sidebarNested}>
                  <Link className={styles.sidebarLink} href="/dashboard/admin/users/pending">
                    <FontAwesomeIcon icon={faUser} /> Pending
                  </Link>
                  <Link className={styles.sidebarLink} href="/dashboard/admin/users/approved">
                    <FontAwesomeIcon icon={faFileCircleCheck} /> Approved
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.sidebarGroup}>
              <button
                className={styles.collapsible}
                onClick={() => toggleSection("contracts")}
              >
                <FontAwesomeIcon icon={faFileContract} /> Contracts
              </button>
              {openSections["contracts"] && (
                <div className={styles.sidebarNested}>
                  <Link className={styles.sidebarLink} href="/dashboard/admin/contracts/pending">
                    <FontAwesomeIcon icon={faFileAlt} /> Pending
                  </Link>
                  <Link className={styles.sidebarLink} href="/dashboard/admin/contracts/signed">
                    <FontAwesomeIcon icon={faFileCircleCheck} /> Signed
                  </Link>
                  <Link className={styles.sidebarLink} href="/dashboard/admin/contracts/rejected">
                    <FontAwesomeIcon icon={faFileExcel} /> Rejected
                  </Link>
                </div>
              )}
            </div>

            {/* Reports */}
            <div className={styles.sidebarHeading}>Reports</div>
            <Link className={styles.sidebarLink} href="/dashboard/admin/reports">
              <FontAwesomeIcon icon={faChartLine} /> Reports
            </Link>
          </>
        )}

        {role === "student" && (
          <>
            {/* Core */}
            <div className={styles.sidebarHeading}>Core</div>
            <Link className={styles.sidebarLink} href="/dashboard/student">
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>

            {/* My Contracts */}
            <div className={styles.sidebarHeading}>My Contracts</div>
            <div className={styles.sidebarGroup}>
              <button
                className={styles.collapsible}
                onClick={() => toggleSection("contracts")}
              >
                <FontAwesomeIcon icon={faFileAlt} /> Contracts
              </button>
              {openSections["contracts"] && (
                <div className={styles.sidebarNested}>
                  <Link className={styles.sidebarLink} href="/dashboard/student/contracts/active">
                    <FontAwesomeIcon icon={faFileContract} /> Active
                  </Link>
                  <Link className={styles.sidebarLink} href="/dashboard/student/contracts/status">
                    <FontAwesomeIcon icon={faFileExcel} /> Status
                  </Link>
                </div>
              )}
            </div>

            {/* Bank Accounts */}
            <div className={styles.sidebarHeading}>Bank Accounts</div>
            <div className={styles.sidebarGroup}>
              <button
                className={styles.collapsible}
                onClick={() => toggleSection("bankAccounts")}
              >
                <FontAwesomeIcon icon={faMoneyCheckAlt} /> Bank Accounts
              </button>
              {openSections["bankAccounts"] && (
                <div className={styles.sidebarNested}>
                  <Link className={styles.sidebarLink} href="/dashboard/student/bank/pichincha">
                    Pichincha
                  </Link>
                  <Link className={styles.sidebarLink} href="/dashboard/student/bank/guayaquil">
                    Guayaquil
                  </Link>
                  <Link className={styles.sidebarLink} href="/dashboard/student/bank/pacifico">
                    Pacifico
                  </Link>
                </div>
              )}
            </div>

            {/* Signatures */}
            <div className={styles.sidebarHeading}>Signatures</div>
            <div className={styles.sidebarGroup}>
              <button
                className={styles.collapsible}
                onClick={() => toggleSection("signatures")}
              >
                <FontAwesomeIcon icon={faPen} /> Signatures
              </button>
              {openSections["signatures"] && (
                <div className={styles.sidebarNested}>
                  <Link className={styles.sidebarLink} href="/dashboard/student/signatures/signature1">
                    Signature 1
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Static Footer */}
      <div className={styles.sidebarFooter}>
        <Link className={`${styles.sidebarLink} ${styles.sidebarLogout}`} href="/">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;