import { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./style/pieChart.module.css";

// Registramos los componentes necesarios para el gráfico de tipo "pie"
Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null); // Referencia para la instancia activa del gráfico

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Si ya existe una instancia de Chart, destrúyela antes de crear una nueva
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Crear una nueva instancia del gráfico
    chartInstanceRef.current = new Chart(ctx, {
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

    // Cleanup: Destruir la instancia activa al desmontar el componente
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []); // Dependencias vacías: solo se inicializa al montar el componente

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