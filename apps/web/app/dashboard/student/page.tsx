"use client";

import styles from './student.module.css';

export default function StudentDashboard() {
  return (
    <div className={styles.content}>
      {/* Welcome message */}
      <div className={styles.welcome}>
        <h1>Welcome, Nicolás!</h1>
        <p>
          Congratulations! You are now part of the scholarship program. Your efforts and dedication
          have paved the way for this achievement. Let’s make this journey remarkable together!
        </p>
        <button
          className={styles.startButton}
          onClick={() => window.location.href = '/dashboard/student/generate-contract'}
        >
          Start
        </button>
      </div>

      {/* Dashboard content */}
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