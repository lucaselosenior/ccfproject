import type { CcfFormData } from "./schema";

// --- Tipos de Saída ---
export type ClassifyCCFOutput = {
    classification: 'Extreme' | 'High' | 'Moderate' | 'Low';
    suggestedPlan: string;
};

// --- Funções de Cálculo de Pontuação ---

function getAgeScore(age?: number): number {
  if (age === undefined) return 0;
  if (age >= 90) return 3;
  if (age >= 80) return 2;
  if (age >= 70) return 1;
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

function getImsScore(ims: CcfFormData["ims"]): number {
  if (ims <= 2) return 4;
  if (ims <= 5) return 3;
  if (ims <= 8) return 2;
  return 1;
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

  return ageScore + hdScore + fragilidadeScore + internacaoScore + quedasScore + sarcopeniaScore;
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


export type { CcfFormData };
