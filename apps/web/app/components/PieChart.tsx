import { useEffect, useRef } from "react";
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  ChartItem,
} from "chart.js";
import styles from "./style/pieChart.module.css";

Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return; // ✅ CLAVE

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx as ChartItem, {
      type: "pie",
      data: {
        labels: ["Pendientes", "Aprobados", "Rechazados"],
        datasets: [
          {
            data: [20, 50, 30],
            backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
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
