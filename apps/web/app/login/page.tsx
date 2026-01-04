import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Scholarship Suite Logo" className={styles.logo} />
      </div>

      {/* Título */}
      <h1 className={styles.title}>ScholarshipSuite</h1>
      <p className={styles.subtitle}>University of Ecuador</p>

      {/* Formulario */}
      <form className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
        />
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}