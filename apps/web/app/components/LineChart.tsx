import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./style/lineChart.module.css";

// Registro de componentes necesarios para gráficos tipo "line"
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null); // Referencia al canvas
  const chartInstanceRef = useRef<Chart | null>(null); // Referencia para la instancia activa del gráfico

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Si ya hay una instancia activa, destruirla antes de crear una nueva
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Crear una nueva instancia del gráfico
    chartInstanceRef.current = new Chart(ctx, {
      type: "line", // Tipo gráfico
      data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"], // Etiquetas del eje x
        datasets: [
          {
            label: "Contratos gestionados",
            data: [100, 150, 200, 250, 300], // Datos para el eje y
            borderColor: "#007bff",
            tension: 0.4, // Suaviza las curvas de las líneas
          },
        ],
      },
      options: {
        responsive: true, // Permitir respuestas adaptativas
        plugins: {
          legend: {
            display: true, // Mostrar la leyenda
            position: "top", // Posicionamiento de la leyenda
          },
        },
      },
    });

    // Cleanup: destruir la instancia del gráfico cuando el componente se desmonte
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []); // Dependencias vacías para ejecutar solo cuando el componente se monte

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Contratos gestionados</h3>
      <canvas ref={chartRef} className={styles.canvas}></canvas>
    </div>
  );
};

export default LineChart;