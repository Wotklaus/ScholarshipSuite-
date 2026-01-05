"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Cambiar `next/router` por `next/navigation`
import { jwtDecode } from 'jwt-decode'; // Correcto
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // useRouter ahora de `next/navigation`

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('Intentando iniciar sesión con:', { email, password });

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('Error en la autenticación. Código de estado:', response.status);
        setError('Credenciales incorrectas. Por favor intenta de nuevo.');
        return;
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      const token = data.accessToken;
      const decoded = jwtDecode(token);

      console.log('Datos decodificados del JWT:', decoded);
      const role = decoded.role;

      localStorage.setItem('jwt', token);

      if (role === 'Administrator') {
        console.log('Redirigiendo al dashboard administrador...');
        router.push('/dashboard/admin');
      } else if (role === 'Scholar') {
        console.log('Redirigiendo al dashboard de estudiante...');
        router.push('/dashboard/student');
      } else {
        console.error('Rol inesperado recibido:', role);
        setError('Rol desconocido. Contacta a soporte.');
      }
    } catch (err) {
      console.error('Error durante el proceso de inicio de sesión:', err);
      setError('Ocurrió un error. Intenta nuevamente más tarde.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <h1 className={styles.title}>ScholarshipSuite</h1>
          <form className={styles.form} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder=" Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Log in
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.footer}>
            Forgot password? <a href="#">Click here</a>
          </p>
        </div>
        <div className={styles.rightSection}>
          <img src="/logo.jpg" alt="ScholarshipSuite Logo" className={styles.image} />
        </div>
      </div>
    </div>
  );
}