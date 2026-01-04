import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Sección izquierda: Formulario */}
        <div className={styles.leftSection}>
          <h1 className={styles.title}>ScholarshipSuite</h1>
          
          <form className={styles.form}>
            <input type="email" placeholder=" Email" className={styles.input} />
            <input type="password" placeholder=" Password" className={styles.input} />
            <button className={styles.button}>Log in</button>
          </form>
          <p className={styles.footer}>
            Forgot password? <a href="#">Click here</a><br />
          
          </p>
        </div>

        {/* Sección derecha: Imagen */}
        <div className={styles.rightSection}>
          <img src="/logo.jpg" alt="ScholarshipSuite Logo" className={styles.image} />
        </div>
      </div>
    </div>
  );
}