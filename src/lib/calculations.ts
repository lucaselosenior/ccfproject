
import type { CcfFormData } from "./schema";

// --- Tipos de Saída ---
export type ClassifyCCFOutput = {
    classification: 'Extreme' | 'High' | 'Moderate' | 'Low';
    suggestedPlan: string;
};

export type TrilhaDeFuncionalidade = {
    nivel: string;
    subnivel: string;
    pontuacao: string;
    nome: string;
    tempo: string;
    diretriz: string;
    color: string; // Cor em HSL para o card
};

// --- Estrutura de Dados do IMS ---
export const imsData = [
    { imsValue: 0, ccfScore: 4, label: "passivo" },
    { imsValue: 1, ccfScore: 4, label: "restrito ao leito" },
    { imsValue: 2, ccfScore: 4, label: "passivo para CR - não realiza OT" },
    { imsValue: 3, ccfScore: 3, label: "senta, mas precisa de auxílio" },
    { imsValue: 4, ccfScore: 3, label: "assume OT com auxílio" },
    { imsValue: 5, ccfScore: 3, label: "participa de transferência para cadeira" },
    { imsValue: 6, ccfScore: 2, label: "marcha 4 passos no lugar, com ou sem auxílio" },
    { imsValue: 7, ccfScore: 2, label: "deambula 5m com auxílio de 2 pessoas" },
    { imsValue: 8, ccfScore: 2, label: "deambula 5m com auxílio de 1 pessoa" },
    { imsValue: 9, ccfScore: 1, label: "deambula 5m com DAM" },
    { imsValue: 10, ccfScore: 1, label: "deambula 5m independente" },
];

// --- Funções de Cálculo de Pontuação ---

function getAgeScore(age?: number): number {
  if (age === undefined || age === null || isNaN(age)) return 0;
  if (age >= 90) return 3;
  if (age >= 80) return 2;
  if (age >= 60) return 1;
  return 0;
}

function getHdScore(hd: CcfFormData["hd"]): number {
  const mapping = {
    "CID Agudo/Avançado": 4,
    "CID Crônico limitante": 3,
    "CID Crônico": 2,
    "CID Crônico estável": 1,
  };
  return mapping[hd] || 0;
}

function getFragilidadeScore(fragilidade: CcfFormData["fragilidade"]): number {
  const mapping = {
    "Frágil": 3,
    "Pré-frágil": 2,
    "Robusto": 1,
  };
  return mapping[fragilidade] || 0;
}

function getInternacaoScore(internacao: CcfFormData["internacao"]): number {
    const mapping = {
        "2 ou mais": 4,
        "1": 3,
        "Não": 1,
    };
    return mapping[internacao] || 0;
}

function getQuedasScore(quedas: CcfFormData["quedas"]): number {
    const mapping = {
        "2 ou mais": 3,
        "1": 2,
        "Nenhuma": 1,
    };
    return mapping[quedas] || 0;
}


function getSarcopeniaScore(sarcopenia: CcfFormData["sarcopenia"]): number {
  const mapping = {
    "Sarcopênico": 3,
    "Pré-sarcopênico": 2,
    "Não sarcopênico": 1,
  };
  return mapping[sarcopenia] || 0;
}

function getAtivoNaComunidadeScore(value: CcfFormData["ativoNaComunidade"]): number {
    return value === "Sim" ? -3 : 0;
}

function getFisioDiariaScore(value: CcfFormData["fisioDiaria"]): number {
    return value === "Sim" ? -3 : 0;
}

function getVinculoScore(value: CcfFormData["vinculo"]): number {
    const mapping = {
        "Não estabelecido": 2,
        "Via ELO": 1,
        "Estabelecido": 0,
    };
    return mapping[value] || 0;
}

function getImsScore(imsValue: number): number {
    const item = imsData.find(d => d.imsValue === imsValue);
    return item ? item.ccfScore : 0;
}

function getVmScore(vm: CcfFormData["vm"]): number {
    const mapping = {
        "< 0.4": 4,
        "0.4 a 0.8": 3,
        "0.8 a 1": 2,
        "> 1": 1,
    };
    return mapping[vm] || 0;
}

function getTsl5xScore(tsl5x: CcfFormData["tsl5x"]): number {
    const mapping = {
        "Não realiza": 4,
        "Pior que o esperado": 3,
        "Esperado": 1,
    };
    return mapping[tsl5x] || 0;
}


function getEquilibrioSppbScore(equilibrio: CcfFormData["equilibrioSppb"]): number {
  if (equilibrio === 0) return 4;
  if (equilibrio === 1) return 3;
  if (equilibrio === 2) return 2;
  if (equilibrio >= 3) return 1; // 3 e 4
  return 0;
}


// --- Funções de Cálculo CCF ---

export function calculateCcfClinico(data: CcfFormData): number {
  const ageScore = getAgeScore(data.idade);
  const hdScore = getHdScore(data.hd);
  const fragilidadeScore = getFragilidadeScore(data.fragilidade);
  const internacaoScore = getInternacaoScore(data.internacao);
  const quedasScore = getQuedasScore(data.quedas);
  const sarcopeniaScore = getSarcopeniaScore(data.sarcopenia);
  const ativoNaComunidadeScore = getAtivoNaComunidadeScore(data.ativoNaComunidade);
  const fisioDiariaScore = getFisioDiariaScore(data.fisioDiaria);
  const vinculoScore = getVinculoScore(data.vinculo);

  return ageScore + hdScore + fragilidadeScore + internacaoScore + quedasScore + sarcopeniaScore + ativoNaComunidadeScore + fisioDiariaScore + vinculoScore;
}


export function calculateCcfFuncional(data: CcfFormData): number {
    const imsScore = getImsScore(data.ims);
    const vmScore = getVmScore(data.vm);
    const tsl5xScore = getTsl5xScore(data.tsl5x);
    const equilibrioSppbScore = getEquilibrioSppbScore(data.equilibrioSppb);

    return imsScore + vmScore + tsl5xScore + equilibrioSppbScore;
}

export type IndividualScores = {
    ageScore: number;
    hdScore: number;
    fragilidadeScore: number;
    internacaoScore: number;
    quedasScore: number;
    sarcopeniaScore: number;
    ativoNaComunidadeScore: number;
    fisioDiariaScore: number;
    vinculoScore: number;
    imsScore: number;
    vmScore: number;
    tsl5xScore: number;
    equilibrioSppbScore: number;
};
  
export function getIndividualScores(data: CcfFormData): IndividualScores {
    return {
        ageScore: getAgeScore(data.idade),
        hdScore: getHdScore(data.hd),
        fragilidadeScore: getFragilidadeScore(data.fragilidade),
        internacaoScore: getInternacaoScore(data.internacao),
        quedasScore: getQuedasScore(data.quedas),
        sarcopeniaScore: getSarcopeniaScore(data.sarcopenia),
        ativoNaComunidadeScore: getAtivoNaComunidadeScore(data.ativoNaComunidade),
        fisioDiariaScore: getFisioDiariaScore(data.fisioDiaria),
        vinculoScore: getVinculoScore(data.vinculo),
        imsScore: getImsScore(data.ims),
        vmScore: getVmScore(data.vm),
        tsl5xScore: getTsl5xScore(data.tsl5x),
        equilibrioSppbScore: getEquilibrioSppbScore(data.equilibrioSppb),
    };
}

// --- Função de Classificação e Sugestão ---
export function classifyCcfScoreAndSuggestPlan(input: { ccfScore: number }): ClassifyCCFOutput {
  const { ccfScore } = input;

  if (ccfScore >= 31) {
    return {
      classification: 'Extreme',
      suggestedPlan: '12 meses - CCR (cuidado contínuo recomendado) com reajuste de frequência a depender das demandas',
    };
  }
  if (ccfScore >= 24) {
    return {
      classification: 'High',
      suggestedPlan: 'mínimo 6-12 meses (reajuste de frequência se mudança de status), CCP (cuidado contínuo provável)',
    };
  }
  if (ccfScore >= 17) {
    return {
      classification: 'Moderate',
      suggestedPlan: '6 meses',
    };
  }
  // ccfScore >= 10 (ou qualquer valor abaixo de 17)
  return {
    classification: 'Low',
    suggestedPlan: '3 meses',
  };
}


const trilhaData: TrilhaDeFuncionalidade[] = [
    { nivel: "Baixo", subnivel: "1A", pontuacao: "6 a 9", nome: "80+ Integridade Funcional", tempo: "Não domiciliar / Gerenciamento", diretriz: "Prevenção", color: "hsl(var(--trilha-dark-green))" },
    { nivel: "Baixo", subnivel: "1B", pontuacao: "10 a 13", nome: "80+ Vitalidade", tempo: "Até 3 meses", diretriz: "Intervenção Funcional Breve", color: "hsl(var(--trilha-light-green))" },
    { nivel: "Moderado", subnivel: "2A", pontuacao: "14 a 17", nome: "80+ Transição Funcional", tempo: "Até 6 meses", diretriz: "Reabilitação Funcional moderada", color: "hsl(var(--trilha-yellow))" },
    { nivel: "Moderado", subnivel: "2B", pontuacao: "18 a 22", nome: "80+ Reabilitação Ativa", tempo: "Até 6 meses", diretriz: "Manutenção funcional", color: "hsl(var(--trilha-light-yellow))" },
    { nivel: "Alto", subnivel: "3A", pontuacao: "23 a 27", nome: "80+ Reabilitação Assistida", tempo: "Revisão 6 meses", diretriz: "Minimizar declínio funcional", color: "hsl(var(--trilha-orange))" },
    { nivel: "Alto", subnivel: "3B", pontuacao: "28 a 31", nome: "80+ Estabilização Funcional Avançada", tempo: "Revisão 6 meses", diretriz: "Gerenciamento funcional e Controle clínico", color: "hsl(var(--trilha-light-orange))" },
    { nivel: "Extremo", subnivel: "4A", pontuacao: "32 a 36", nome: "80+ Intervenção Funcional Contínua de alta complexidade com revisão periódica", tempo: "Ajuste de frequência", diretriz: "Intervenção intensiva", color: "hsl(var(--trilha-light-red))" },
    { nivel: "Extremo", subnivel: "4B", pontuacao: "37 a 39", nome: "80+ Complexidade Avançada", tempo: "Superior a 3 semanas", diretriz: "Suporte contínuo", color: "hsl(var(--trilha-red))" },
];


export function getTrilhaDeFuncionalidade(score: number): TrilhaDeFuncionalidade | null {
    if (score < 6) return null;
    if (score <= 9) return trilhaData[0];
    if (score <= 13) return trilhaData[1];
    if (score <= 17) return trilhaData[2];
    if (score <= 22) return trilhaData[3];
    if (score <= 27) return trilhaData[4];
    if (score <= 31) return trilhaData[5];
    if (score <= 36) return trilhaData[6];
    if (score <= 39) return trilhaData[7];
    return null;
}


export type { CcfFormData };
export const imsOptions = imsData.map(item => ({
    value: item.imsValue,
    label: `${item.imsValue}\t${item.label}`
}));

export const getImsDescription = (imsValue: number): string => {
    const item = imsData.find(d => d.imsValue === imsValue);
    return item ? item.label : "";
};

export const getImsTooltip = (): string => {
    return imsData.map(item => `IMS ${item.imsValue} (${item.label}) pontua ${item.ccfScore} no CCF`).join(' | ');
}
