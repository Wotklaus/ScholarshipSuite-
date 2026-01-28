import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  const body = await req.text(); // keep raw JSON

  const upstream = await fetch("http://localhost:3002/contracts/finalize", {
    method: "POST",
    headers: {
      cookie,
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new Response(text, { status: upstream.status });
}
