"use client";

import { useId, useRef, useState } from "react";
import { investmentRanges, leadSchema, type LeadField } from "@/lib/lead-schema";
import { track } from "@/lib/analytics";
import { ArrowUpRight, CheckIcon } from "@/components/icons";

type Errors = Partial<Record<LeadField, string>>;
type Status = "idle" | "sending" | "sent" | "unconfigured" | "error";

const fieldClass = (invalid: boolean) =>
  [
    "w-full rounded-md border bg-ink/60 px-3.5 py-2.5 text-[0.9375rem] text-fg",
    "placeholder:text-muted-dim/70 transition-colors",
    "focus:border-brand-bright focus:bg-ink/80 focus:outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright",
    invalid ? "border-red-400/70" : "border-line hover:border-line-strong",
  ].join(" ");

export function LeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const uid = useId();

  const fieldId = (name: string) => `${uid}-${name}`;

  const markStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("form_start", { form: "diagnostico" });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      segment: String(formData.get("segment") ?? ""),
      goal: String(formData.get("goal") ?? ""),
      investment: String(formData.get("investment") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as LeadField] = issue.message;
        }
      }
      setErrors(nextErrors);
      setStatus("idle");
      setNotice("");
      const firstKey = Object.keys(nextErrors)[0];
      if (firstKey) {
        const el = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.focus();
      }
      return;
    }

    setErrors({});
    setNotice("");
    setStatus("sending");

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        code?: string;
      };

      if (response.ok && data.ok) {
        setStatus("sent");
        form.reset();
        startedRef.current = false;
        track("form_submit_success", { form: "diagnostico" });
        return;
      }

      if (data.code === "INTEGRATION_NOT_CONFIGURED") {
        setStatus("unconfigured");
        setNotice(
          data.message ??
            "O envio ainda não está conectado a um canal de recebimento.",
        );
        track("form_submit_error", { form: "diagnostico", reason: "not_configured" });
        return;
      }

      setStatus("error");
      setNotice(data.message ?? "Não foi possível enviar agora. Tente novamente.");
      track("form_submit_error", { form: "diagnostico", reason: String(response.status) });
    } catch {
      setStatus("error");
      setNotice("Falha de conexão. Verifique sua internet e tente novamente.");
      track("form_submit_error", { form: "diagnostico", reason: "network" });
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/[0.07] p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand/20 text-brand-light">
          <CheckIcon size={22} />
        </span>
        <h3 className="mt-5 font-display text-xl font-medium tracking-[-0.02em] text-fg">
          Diagnóstico enviado.
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-[0.875rem] leading-relaxed text-muted">
          Recebemos suas informações. A ONZE entra em contato pelo e-mail informado
          para combinar a conversa inicial.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-line bg-surface/70 p-6 md:p-8"
      aria-describedby={`${uid}-privacy`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-fg">
          Solicitar diagnóstico
        </h3>
        <span className="text-[0.6875rem] tracking-wide text-muted-dim">2 min</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Nome" htmlFor={fieldId("name")} error={errors.name} required>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            onFocus={markStart}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId("name")}-error` : undefined}
            className={fieldClass(Boolean(errors.name))}
          />
        </Field>

        <Field label="E-mail" htmlFor={fieldId("email")} error={errors.email} required>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@empresa.com"
            onFocus={markStart}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined}
            className={fieldClass(Boolean(errors.email))}
          />
        </Field>

        <Field label="Empresa" htmlFor={fieldId("company")} error={errors.company} required>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Nome da empresa"
            onFocus={markStart}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? `${fieldId("company")}-error` : undefined}
            className={fieldClass(Boolean(errors.company))}
          />
        </Field>

        <Field label="Segmento" htmlFor={fieldId("segment")} error={errors.segment} required>
          <input
            id={fieldId("segment")}
            name="segment"
            type="text"
            placeholder="Ex.: clínica, e-commerce, serviços"
            onFocus={markStart}
            aria-invalid={Boolean(errors.segment)}
            aria-describedby={errors.segment ? `${fieldId("segment")}-error` : undefined}
            className={fieldClass(Boolean(errors.segment))}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Objetivo principal"
            htmlFor={fieldId("goal")}
            error={errors.goal}
            hint="O que você quer melhorar na aquisição de clientes?"
            required
          >
            <textarea
              id={fieldId("goal")}
              name="goal"
              rows={3}
              placeholder="Descreva o momento do negócio e o resultado esperado."
              onFocus={markStart}
              aria-invalid={Boolean(errors.goal)}
              aria-describedby={errors.goal ? `${fieldId("goal")}-error` : undefined}
              className={`${fieldClass(Boolean(errors.goal))} resize-y`}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Faixa de investimento em anúncios"
            htmlFor={fieldId("investment")}
            error={errors.investment}
            hint="Opcional"
          >
            <select
              id={fieldId("investment")}
              name="investment"
              defaultValue=""
              onFocus={markStart}
              aria-invalid={Boolean(errors.investment)}
              className={`${fieldClass(Boolean(errors.investment))} appearance-none`}
            >
              <option value="">Selecione (opcional)</option>
              {investmentRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Honeypot: oculto para humanos, ignorado por leitores de tela */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor={fieldId("website")}>Não preencha este campo</label>
          <input
            id={fieldId("website")}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar e falar com a ONZE"}
        {status !== "sending" ? (
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        ) : null}
      </button>

      <p
        id={`${uid}-privacy`}
        className="mt-3 text-[0.6875rem] leading-relaxed text-muted-dim"
      >
        Usamos seus dados apenas para responder a este contato. Nada de lista de
        e-mail, nada de venda de dados. Ao enviar, você concorda com esse uso.
      </p>

      <div aria-live="polite" role="status" className="min-h-0">
        {status === "unconfigured" || status === "error" ? (
          <p className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/[0.08] px-3.5 py-3 text-[0.75rem] leading-relaxed text-amber-200">
            {notice}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[0.75rem] font-medium text-fg/90">
          {label}
          {required ? <span className="text-brand-light"> *</span> : null}
        </label>
        {hint ? <span className="text-[0.625rem] text-muted-dim">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[0.6875rem] text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
