
"use client";

import { IndividualScores, type CcfFormData, ClassifyCCFOutput, TrilhaDeFuncionalidade, getImsDescription } from "@/lib/calculations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Copy } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type ResultCardProps = {
  totalScore: number;
  ccfClinico: number;
  ccfFuncional: number;
  classification: ClassifyCCFOutput;
  individualScores: IndividualScores;
  patientName?: string;
  trilha: TrilhaDeFuncionalidade | null;
};

const classificationConfig = {
  Low: {
    label: "Baixo",
    color: "hsl(var(--low))",
    icon: <ShieldCheck className="mr-2 h-5 w-5" style={{ color: "hsl(var(--low))" }} />,
  },
  Moderate: {
    label: "Moderado",
    color: "hsl(var(--moderate))",
    icon: <Shield className="mr-2 h-5 w-5" style={{ color: "hsl(var(--moderate))" }} />,
  },
  High: {
    label: "Alto",
    color: "hsl(var(--high))",
    icon: <ShieldAlert className="mr-2 h-5 w-5" style={{ color: "hsl(var(--high))" }} />,
  },
  Extreme: {
    label: "Extremo",
    color: "hsl(var(--extreme))",
    icon: <ShieldX className="mr-2 h-5 w-5" style={{ color: "hsl(var(--extreme))" }} />,
  },
};

const ScoreRow = ({ label, score }: { label: string; score: number }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{score}</span>
    </div>
);

const TrilhaRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-right">{value || "-"}</span>
    </div>
);


export default function ResultCard({ 
    totalScore,
    ccfClinico, 
    ccfFuncional, 
    classification, 
    individualScores, 
    patientName,
    trilha
}: ResultCardProps) {
    const { getValues } = useFormContext<CcfFormData>();
    const { toast } = useToast();
    const { classification: ccfClassification, suggestedPlan } = classification;
    const config = classificationConfig[ccfClassification] || classificationConfig.Low;
    
    const handleCopyToClipboard = () => {
      const data = getValues();
      const {
        hdScore, imsScore, fragilidadeScore, vmScore, 
        tsl5xScore, equilibrioSppbScore, sarcopeniaScore, 
        quedasScore, internacaoScore, ativoNaComunidadeScore,
        fisioDiariaScore, vinculoScore
      } = individualScores;

      const headers = [
        "Paciente", "HD", "CCF HD", "IMS", "CCF IMS", "Fragilidade", "CCF Fragilidade", "VM", "CCF VM",
        "TSL5x", "CCF TSL5x", "Equilíbrio SPPB", "CCF Equilíbrio", "Sarcopenia", "CCF Sarcopenia",
        "Quedas", "CCF Quedas", "Internação", "CCF Internação", "Ativo na Comunidade", "CCF Ativo", "Fisio Diária", "CCF Fisio", "Vínculo", "CCF Vínculo", "CCF total", "Classificação"
      ].join("\t");

      const rowData = [
        patientName || "",
        data.hd,
        hdScore,
        getImsDescription(data.ims),
        imsScore,
        data.fragilidade,
        fragilidadeScore,
        data.vm,
        vmScore,
        data.tsl5x,
        tsl5xScore,
        data.equilibrioSppb,
        equilibrioSppbScore,
        data.sarcopenia,
        sarcopeniaScore,
        data.quedas,
        quedasScore,
        data.internacao,
        internacaoScore,
        data.ativoNaComunidade,
        ativoNaComunidadeScore,
        data.fisioDiaria,
        fisioDiariaScore,
        data.vinculo,
        vinculoScore,
        totalScore,
        config.label,
      ].join("\t");

      const output = `${headers}\n${rowData}`;

      navigator.clipboard.writeText(output).then(() => {
        toast({
          title: "Copiado para a área de transferência!",
          description: "Os dados podem ser colados em sua planilha.",
        });
      }).catch(err => {
        console.error("Failed to copy text: ", err);
        toast({
          variant: "destructive",
          title: "Erro ao copiar",
          description: "Não foi possível copiar os dados.",
        });
      });
    };
  
    return (
      <Card className="sticky top-8 border-2 border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Resultado da Análise
                </CardTitle>
                <CardDescription className="mt-1.5 text-slate-600">
                    {patientName ? `Resultados para ${patientName}` : "Pontuação, classificação e plano de acompanhamento."}
                </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopyToClipboard} 
              title="Copiar para Planilha"
              className="border-slate-300 hover:bg-slate-100"
            >
                <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex w-full items-center justify-between pr-4">
                  <h4 className="font-medium">Detalhes da Pontuação</h4>
                  <span className="text-sm text-muted-foreground">Clique para expandir</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
                  <h4 className="font-medium">CCF Clínico</h4>
                  <div className="space-y-2 pl-2">
                      <ScoreRow label="Idade" score={individualScores.ageScore} />
                      <ScoreRow label="HD" score={individualScores.hdScore} />
                      <ScoreRow label="Internação não eletiva anual" score={individualScores.internacaoScore} />
                      <ScoreRow label="Fragilidade" score={individualScores.fragilidadeScore} />
                      <ScoreRow label="Sarcopenia" score={individualScores.sarcopeniaScore} />
                      <ScoreRow label="Quedas anual" score={individualScores.quedasScore} />
                      <ScoreRow label="Ativo na comunidade" score={individualScores.ativoNaComunidadeScore} />
                      <ScoreRow label="Fisio diária >= 3 semanas" score={individualScores.fisioDiariaScore} />
                      <ScoreRow label="Vínculo" score={individualScores.vinculoScore} />
                  </div>
                  <div className="flex items-center justify-between pt-2 text-base font-semibold">
                      <span>Total Clínico</span>
                      <span>{ccfClinico}</span>
                  </div>

                  <Separator className="my-3" />

                  <h4 className="font-medium">CCF Funcional</h4>
                  <div className="space-y-2 pl-2">
                      <ScoreRow label="IMS" score={individualScores.imsScore} />
                      <ScoreRow label="VM" score={individualScores.vmScore} />
                      <ScoreRow label="TSL 5x" score={individualScores.tsl5xScore} />
                      <ScoreRow label="Equilíbrio SPPB" score={individualScores.equilibrioSppbScore} />
                  </div>
                  <div className="flex items-center justify-between pt-2 text-base font-semibold">
                      <span>Total Funcional</span>
                      <span>{ccfFuncional}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">Pontuação Total CCF</span>
                <span className="text-2xl font-bold">{totalScore}</span>
            </div>
          </div>
  
          <div className="space-y-2">
            <h4 className="font-semibold">Plano de Acompanhamento Sugerido</h4>
            <p className="rounded-lg border bg-accent/50 p-3 text-sm text-accent-foreground">
              {trilha ? trilha.tempo : suggestedPlan}
            </p>
          </div>

          {trilha && (
            <div className="space-y-3 rounded-lg border p-4 shadow-sm" style={{ backgroundColor: trilha.color }}>
                <h4 className="font-medium text-card-foreground">Trilha de Funcionalidade</h4>
                <div className="space-y-2 pl-2">
                    <TrilhaRow label="Nível" value={trilha.nivel} />
                    <TrilhaRow label="Subnível" value={trilha.subnivel} />
                    <TrilhaRow label="Pontuação" value={trilha.pontuacao} />
                    <TrilhaRow label="Nome" value={trilha.nome} />
                    <TrilhaRow label="Tempo" value={trilha.tempo} />
                    <TrilhaRow label="Diretriz-chave" value={trilha.diretriz} />
                </div>
            </div>
          )}
  
        </CardContent>
      </Card>
    );
  }
