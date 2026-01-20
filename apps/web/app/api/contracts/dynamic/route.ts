import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 1) Agarrar cookie del browser (llega a Next porque es same-origin /api)
  const cookie = req.headers.get("cookie") ?? "";

  // 2) Reenviar request al microservicio, pasando la cookie
  const upstream = await fetch("http://localhost:3002/contracts/dynamic", {
    method: "GET",
    headers: {
      cookie,
    },
    // OJO: en Next server-side, esto evita cache raro
    cache: "no-store",
  });

  // 3) Si el microservicio devolvió error, lo devolvemos igual
  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text, { status: upstream.status });
  }

  // 4) Devolver el PDF tal cual
  const pdfBuffer = await upstream.arrayBuffer();

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="contract.pdf"',
    },
  });
}
