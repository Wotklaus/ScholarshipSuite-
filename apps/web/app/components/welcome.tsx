"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style/welcome.module.css";

type WelcomeProps = {
  username: string; // Nombre del usuario
};

export default function Welcome({ username }: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(false); // Control de visibilidad
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsVisible(true); // Muestra el modal si no hay registro previo
      localStorage.setItem("hasVisited", "true"); // Marca que el usuario ya ha visitado
    }
  }, []);

  const handleStart = () => {
    router.push("/dashboard/student/generate-contract"); // Redirige a la página deseada
  };

  if (!isVisible) return null; // No muestra nada si el modal no está visible

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Welcome, {username}!</h1>
        <p>
          Congratulations! You are now part of the scholarship program. Your effort and dedication have
          made this possible. Let’s make this journey remarkable and achieve your goals together!
        </p>
        <button className={styles.startButton} onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  );
}