import styles from './student.module.css';

export default function StudentDashboard() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Student Dashboard</h1>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h2>Your Courses</h2>
          <p>Active: 5</p>
        </div>
        <div className={styles.card}>
          <h2>Contracts</h2>
          <p>Pending: 3</p>
        </div>
      </div>
    </div>
  );
}