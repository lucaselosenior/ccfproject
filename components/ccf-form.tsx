
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ccfFormSchema, type CcfFormData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getCcfClassification } from "@/app/actions";
import PatientDataCard from "./patient-data-card";
import EvaluationItemsCard from "./evaluation-items-card";
import ResultCard from "./result-card";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import {
  calculateCcfClinico,
  calculateCcfFuncional,
  getIndividualScores,
  getTrilhaDeFuncionalidade,
  type IndividualScores,
  type ClassifyCCFOutput,
  type TrilhaDeFuncionalidade,
  imsData,
} from "@/lib/calculations";

const LOCAL_STORAGE_KEY = "ccf-form-data";

type ResultState = {
    totalScore: number;
    ccfClinico: number;
    ccfFuncional: number;
    classification: ClassifyCCFOutput;
    individualScores: IndividualScores;
    patientName?: string;
    trilha: TrilhaDeFuncionalidade | null;
};

export function CcfForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<ResultState | null>(null);

  const form = useForm<CcfFormData>({
    resolver: zodResolver(ccfFormSchema),
    defaultValues: {
      nome: "",
      idade: '' as any,
      hd: "CID Crônico estável",
      internacao: "Não",
      fragilidade: "Robusto",
      sarcopenia: "Não sarcopênico",
      quedas: "Nenhuma",
      ativoNaComunidade: "Não",
      fisioDiaria: "Não",
      vinculo: "Estabelecido",
      ims: 0,
      vm: "> 1",
      tsl5x: "Esperado",
      equilibrioSppb: 4,
    },
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate against the schema before resetting the form
        const validation = ccfFormSchema.safeParse(parsedData);
        if (validation.success) {
          form.reset(validation.data);
        } else {
          console.warn("Invalid data in localStorage, ignoring.");
        }
      }
    } catch (error) {
      console.error("Failed to parse form data from localStorage", error);
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save form data to localStorage", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit: SubmitHandler<CcfFormData> = (data) => {
    startTransition(async () => {
      const ccfClinico = calculateCcfClinico(data);
      const ccfFuncional = calculateCcfFuncional(data);
      const totalScore = ccfClinico + ccfFuncional;
      const individualScores = getIndividualScores(data);
      const trilha = getTrilhaDeFuncionalidade(totalScore);

      const resultData = await getCcfClassification(totalScore);

      if ("error" in resultData) {
        toast({
          variant: "destructive",
          title: "Erro na Análise",
          description: resultData.error,
        });
        setResult(null);
      } else {
        setResult({
          totalScore,
          ccfClinico,
          ccfFuncional,
          classification: resultData,
          individualScores,
          patientName: data.nome,
          trilha,
        });
        toast({
          title: "Análise Concluída",
          description: "O resultado da avaliação CCF está disponível abaixo.",
        });
        console.log(
          JSON.stringify(
            {
              ...data,
              result: { totalScore, ccfClinico, ccfFuncional, classification: resultData, individualScores, trilha },
            },
            null,
            2
          )
        );
      }
    });
  };

  const handleReset = () => {
    form.reset();
    setResult(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({
      title: "Formulário Resetado",
      description: "Todos os campos foram limpos.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <PatientDataCard />
            <EvaluationItemsCard />
          </div>
          <div className="space-y-8 lg:col-span-1">
            {result ? (
              <ResultCard {...result} />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>
                    Os resultados da análise aparecerão aqui após o cálculo.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-4 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleReset}>
            Limpar Formulário
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calcular CCF
          </Button>
        </div>
      </form>
    </Form>
  );
}
