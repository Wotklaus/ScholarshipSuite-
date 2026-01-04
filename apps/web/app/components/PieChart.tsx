import { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./style/pieChart.module.css";

// Registramos los componentes necesarios para el gráfico de tipo "pie"
Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "pie", // Utilizamos el tipo "pie"
      data: {
        labels: ["Pendientes", "Aprobados", "Rechazados"], // Etiquetas para las divisiones
        datasets: [
          {
            data: [20, 50, 30], // Datos para cada porción
            backgroundColor: ["#ffc107", "#28a745", "#dc3545"], // Colores asignados
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right", // Coloca la leyenda a la derecha del gráfico
          },
        },
      },
    });
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Estado de los contratos</h3>
      <div className={styles.chartWrapper}>
        <canvas ref={chartRef} className={styles.canvas}></canvas>
        
      </div>
    </div>
  );
};

export default PieChart;