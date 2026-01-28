import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  const formData = await req.formData();

  const upstream = await fetch("http://localhost:3002/contracts/bank-account", {
    method: "POST",
    headers: { cookie },
    body: formData,
    cache: "no-store",
  });

  const contentType = upstream.headers.get("content-type") || "text/plain";

  // Si el upstream responde JSON, devolvemos JSON real (no string).
  if (contentType.includes("application/json")) {
    const data = await upstream.json();
    return Response.json(data, { status: upstream.status });
  }

  // Fallback: texto
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
