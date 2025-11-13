import { z } from "zod";

export const ccfFormSchema = z.object({
  // Dados Gerais
  nome: z.string().optional(),
  idade: z.coerce.number().min(0, "Idade inválida").optional(),
  hd: z.enum(["CID Crônico estável", "CID Crônico", "CID Crônico limitante", "CID Agudo/Avançado"]),
  internacao: z.enum(["Não", "1", "2 ou mais"]),
  fragilidade: z.enum(["Robusto", "Pré-frágil", "Frágil"]),
  sarcopenia: z.enum(["Não sarcopênico", "Pré-sarcopênico", "Sarcopênico"]),
  quedas: z.enum(["Nenhuma", "1", "2 ou mais"]),

  // Itens de avaliação
  ims: z.coerce.number().min(0).max(10),
  vm: z.enum(["> 1", "0.8 a 1", "0.4 a 0.8", "< 0.4"]),
  tsl5x: z.enum(["Esperado", "Pior que o esperado", "Não realiza"]),
  equilibrioSppb: z.coerce.number().min(0).max(4),
});

export type CcfFormData = z.infer<typeof ccfFormSchema>;
