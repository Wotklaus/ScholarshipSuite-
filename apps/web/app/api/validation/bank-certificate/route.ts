import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const upstream = await fetch("http://localhost:3003/bank-certificate/parse", {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}

