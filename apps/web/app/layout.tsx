"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", height: "100vh" }}>
          {isDashboard && <Sidebar role={pathname.includes("admin") ? "admin" : "student"} />}
          <div
            style={{
              flex: 1, // El contenido ocupa el espacio restante
              overflowY: "auto", // Desplazable si es extenso
              background: "#f4f4f9", // Fondo del contenido
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}