import { z } from "zod";

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export const investmentRanges = [
  "Até R$ 5 mil/mês",
  "R$ 5 mil a R$ 15 mil/mês",
  "R$ 15 mil a R$ 50 mil/mês",
  "Acima de R$ 50 mil/mês",
  "Ainda não definido",
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(80, "Nome muito longo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(160, "E-mail muito longo.")
    .regex(emailPattern, "Informe um e-mail válido."),
  company: z
    .string()
    .trim()
    .min(2, "Informe o nome da empresa.")
    .max(120, "Nome da empresa muito longo."),
  segment: z
    .string()
    .trim()
    .min(2, "Informe o segmento do negócio.")
    .max(80, "Segmento muito longo."),
  goal: z
    .string()
    .trim()
    .min(10, "Descreva o objetivo principal em pelo menos 10 caracteres.")
    .max(800, "Descrição muito longa (máximo de 800 caracteres)."),
  investment: z.enum(investmentRanges).optional().or(z.literal("")),
  // Honeypot: campo oculto que humanos não preenchem. Aceito pelo schema de
  // propósito; a rota descarta a requisição em silêncio (202).
  website: z.string().max(500).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadField = keyof LeadInput;

export type FieldErrors = Partial<Record<LeadField, string>>;

export function flattenIssues(error: z.ZodError<LeadInput>): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as LeadField] = issue.message;
    }
  }
  return errors;
}

export function parseLead(input: unknown) {
  const result = leadSchema.safeParse(input);
  if (result.success) return { ok: true as const, data: result.data };
  return { ok: false as const, errors: flattenIssues(result.error) };
}
