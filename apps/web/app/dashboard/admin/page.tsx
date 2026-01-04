"use client";

import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";
import styles from "./admin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Admin Dashboard</h1>
          <input
            type="text"
            className={styles.search}
            placeholder="Buscar en el dashboard..."
          />
        </div>
        <p>Bienvenido de vuelta, administrador. Aquí está la actividad del sistema.</p>
      </header>

      <section className={styles.statistics}>
        <div className={styles.card}>
          <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
          <h2>Becarios</h2>
          <p>345 Registrados</p>
        </div>
        <div className={styles.card}>
          <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
          <h2>Contratos Pendientes</h2>
          <p>50</p>
        </div>
        <div className={`${styles.card} ${styles.approved}`}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
          <h2>Contratos Aprobados</h2>
          <p>300</p>
        </div>
        <div className={`${styles.card} ${styles.rejected}`}>
          <FontAwesomeIcon icon={faTimesCircle} className={styles.icon} />
          <h2>Contratos Rechazados</h2>
          <p>15</p>
        </div>
      </section>

      <section className={styles.graphics}>
        {/* Gráfico circular */}
        <PieChart />

        {/* Gráfico de líneas */}
        <LineChart />
      </section>

      <section className={styles.actions}>
        <h2>Acciones rápidas</h2>
        <div className={styles.actionGroup}>
          <button className={styles.actionButton}>Registrar Becarios</button>
          <button className={styles.actionButton}>Generar Reportes</button>
          <button className={styles.actionButton}>Revisar Notificaciones</button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;