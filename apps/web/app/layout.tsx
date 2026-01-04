export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body>
        <header style={{ padding: "1rem", backgroundColor: "#0070f3", color: "white" }}>
          <h2>Gestión de Becas</h2>
        </header>
        <main style={{ padding: "1rem" }}>{children}</main>
        <footer style={{ padding: "1rem", textAlign: "center", marginTop: "2rem", backgroundColor: "#333", color: "white" }}>
          Sistema de Becas © 2026
        </footer>
      </body>
    </html>
  );
}