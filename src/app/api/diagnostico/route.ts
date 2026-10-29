import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/lead-schema";

function getClientKey(request: Request, forwardedFor: string | null) {
  const ip = forwardedFor?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown-client";
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const rateLimit = checkRateLimit(
    getClientKey(request, requestHeaders.get("x-forwarded-for")),
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Dados inválidos." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Revise os campos destacados e tente novamente." },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  // Sem CRM/webhook configurado, não fingimos que o lead foi entregue.
  // O payload validado fica pronto para a integração oficial quando definida.
  if (!process.env.LEAD_WEBHOOK_URL) {
    return NextResponse.json(
      {
        ok: false,
        code: "INTEGRATION_NOT_CONFIGURED",
        message: "O canal de recebimento ainda não está configurado. Entre em contato pelos canais oficiais.",
      },
      { status: 503 },
    );
  }

  try {
    const webhookResponse = await fetch(process.env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        source: "onze-landing-page",
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { ok: false, message: "Não foi possível concluir o envio agora. Tente novamente." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: "Não foi possível concluir o envio agora. Tente novamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
