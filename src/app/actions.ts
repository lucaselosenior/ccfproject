'use server';

import type { ClassifyCCFOutput } from "@/lib/calculations";
import { classifyCcfScoreAndSuggestPlan } from "@/lib/calculations";

export async function getCcfClassification(totalScore: number): Promise<ClassifyCCFOutput | { error: string }> {
  try {
    // A lógica de IA foi substituída por uma função local para maior eficiência e confiabilidade.
    const result = classifyCcfScoreAndSuggestPlan({ ccfScore: totalScore });
    return result;
  } catch (e) {
    console.error(e);
    // Embora seja improvável que essa função local falhe, mantemos o tratamento de erros.
    return { error: 'Falha ao obter classificação do CCF.' };
  }
}
