
"use client";

import { IndividualScores, type CcfFormData, ClassifyCCFOutput } from "@/lib/calculations";
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

type ResultCardProps = {
  totalScore: number;
  ccfClinico: number;
  ccfFuncional: number;
  classification: ClassifyCCFOutput;
  individualScores: IndividualScores;
  patientName?: string;
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

export default function ResultCard({ 
    totalScore,
    ccfClinico, 
    ccfFuncional, 
    classification, 
    individualScores, 
    patientName 
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
        quedasScore, internacaoScore
      } = individualScores;

      const headers = [
        "Paciente", "HD", "CCF HD", "IMS", "CCF IMS", "Fragilidade", "CCF Fragilidade", "VM", "CCF VM",
        "TSL5x", "CCF TSL5x", "Equilíbrio SPPB", "CCF Equilíbrio", "Sarcopenia", "CCF Sarcopenia",
        "Quedas", "CCF Quedas", "Internação", "CCF Internação", "CCF Total", "Classificação"
      ].join("\t");

      const rowData = [
        patientName || "",
        data.hd,
        hdScore,
        data.ims,
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
      <Card className="sticky top-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>📊 Resultado da Análise</CardTitle>
                <CardDescription className="mt-1.5">
                    {patientName ? `Resultados para ${patientName}` : "Pontuação, classificação e plano de acompanhamento."}
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyToClipboard} title="Copiar para Planilha">
                <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
            <h4 className="font-medium">CCF Clínico</h4>
            <div className="space-y-2 pl-2">
                <ScoreRow label="Idade" score={individualScores.ageScore} />
                <ScoreRow label="HD" score={individualScores.hdScore} />
                <ScoreRow label="Internação não eletiva anual" score={individualScores.internacaoScore} />
                <ScoreRow label="Fragilidade" score={individualScores.fragilidadeScore} />
                <ScoreRow label="Sarcopenia" score={individualScores.sarcopeniaScore} />
                <ScoreRow label="Quedas anual" score={individualScores.quedasScore} />
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

          <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">Pontuação Total CCF</span>
                <span className="text-2xl font-bold">{totalScore}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Classificação</span>
                <div className="flex items-center">
                  {config.icon}
                  <span className="font-semibold" style={{ color: config.color }}>
                    {config.label}
                  </span>
                </div>
            </div>
          </div>
  
          <div className="space-y-2">
            <h4 className="font-semibold">Plano de Acompanhamento Sugerido</h4>
            <p className="rounded-lg border bg-accent/50 p-3 text-sm text-accent-foreground">
              {suggestedPlan}
            </p>
          </div>
  
        </CardContent>
      </Card>
    );
  }
