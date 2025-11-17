
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ccfFormSchema, type CcfFormData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getCcfClassification } from "@/app/actions";
import PatientDataCard from "./patient-data-card";
import EvaluationItemsCard from "./evaluation-items-card";
import ResultCard from "./result-card";
import { Loader2, Download } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import {
  calculateCcfClinico,
  calculateCcfFuncional,
  getIndividualScores,
  getTrilhaDeFuncionalidade,
  type IndividualScores,
  type ClassifyCCFOutput,
  type TrilhaDeFuncionalidade,
  getImsDescription,
} from "@/lib/calculations";

const LOCAL_STORAGE_KEY = "ccf-form-data";
const img = "/logo.png";


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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
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
        ims: 10,
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

  const handleDownloadPdf = async () => {
    if (!result) return;
    setIsGeneratingPdf(true);
    toast({
      title: "Gerando PDF...",
      description: "Aguarde um momento enquanto o relatório é preparado.",
    });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const formData = form.getValues();
      // 🖼️ Inserir Logo
      const img = new Image();
      img.src = logo.src;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const logoWidth = 40;
      const logoHeight = (img.height / img.width) * logoWidth;

      pdf.addImage(img, "PNG", 15, 10, 40, 40);

      // Agora o conteúdo começa depois do logo
      let yPos = 10 + logoHeight + 10;
      const { individualScores, ccfClinico, ccfFuncional, totalScore, trilha, classification } = result;

      // --- Estilos e Configurações --
      const margin = 15;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const titleFontSize = 14;
      const headerFontSize = 11;
      const textFontSize = 9;
      const lineSpacing = 5;
      const sectionSpacing = 8;
      
      const addSectionTitle = (title: string) => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = 15;
          }
          yPos += sectionSpacing / 2;
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(headerFontSize);
          pdf.text(title, margin, yPos);
          yPos += lineSpacing;
          pdf.setLineWidth(0.2);
          pdf.line(margin, yPos - 2, 210 - margin, yPos - 2);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(textFontSize);
      }

      // --- Cabeçalho do Documento ---
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(titleFontSize);
      pdf.text('Relatório de Análise de Caso – CCF', 105, yPos, { align: 'center' });
      yPos += lineSpacing * 2;

      // --- Dados do Paciente ---
      addSectionTitle('Dados Gerais e CCF Clínico');
      (pdf as any).autoTable({
        startY: yPos,
        head: [['Critério', 'Seleção', 'Pontuação CCF']],
        body: [
          ['Nome do Paciente', formData.nome || 'Não informado', ''],
          ['Idade', `${formData.idade || 'N/A'} anos`, individualScores.ageScore],
          ['HD', formData.hd, individualScores.hdScore],
          ['Internação não eletiva anual', formData.internacao, individualScores.internacaoScore],
          ['Fragilidade', formData.fragilidade, individualScores.fragilidadeScore],
          ['Sarcopenia', formData.sarcopenia, individualScores.sarcopeniaScore],
          ['Quedas anuais', formData.quedas, individualScores.quedasScore],
          ['Ativo na comunidade', formData.ativoNaComunidade, individualScores.ativoNaComunidadeScore],
          ['Fisio diária >= 3 semanas', formData.fisioDiaria, individualScores.fisioDiariaScore],
          ['Vínculo', formData.vinculo, individualScores.vinculoScore],
        ],
        foot: [['Total CCF Clínico', '', ccfClinico]],
        theme: 'striped',
        headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold', fontSize: 9 },
        didDrawPage: (data: any) => { yPos = data.cursor.y; }
      });

      // --- Avaliação Funcional ---
      addSectionTitle('Itens de Avaliação e CCF Funcional');
      (pdf as any).autoTable({
        startY: yPos,
        head: [['Critério', 'Seleção', 'Pontuação CCF']],
        body: [
          ['IMS', `${formData.ims} - ${getImsDescription(formData.ims)}`, individualScores.imsScore],
          ['VM (Velocidade de Marcha)', formData.vm, individualScores.vmScore],
          ['TSL 5x (sentar e levantar)', formData.tsl5x, individualScores.tsl5xScore],
          ['Equilíbrio SPPB', formData.equilibrioSppb, individualScores.equilibrioSppbScore],
        ],
        foot: [['Total CCF Funcional', '', ccfFuncional]],
        theme: 'striped',
        headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold', fontSize: 9 },
        didDrawPage: (data: any) => { yPos = data.cursor.y; }
      });
      yPos += sectionSpacing / 2;
      
      // --- Resultado Final ---
      addSectionTitle('Resultado Final');
      yPos += lineSpacing / 2; // Espaço extra para não cortar o texto abaixo
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pontuação Total CCF:', margin, yPos);
      pdf.text(totalScore.toString(), 210 - margin, yPos, { align: 'right' });
      yPos += sectionSpacing;
      
      pdf.setFontSize(textFontSize);
      pdf.setFont('helvetica', 'normal');
      
      const planLines = pdf.splitTextToSize(classification.suggestedPlan, 180);
      pdf.text('Plano de Acompanhamento Sugerido:', margin, yPos);
      yPos += lineSpacing;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos - lineSpacing + 2, 210 - (margin*2), (planLines.length * (lineSpacing -1)) + 4, 'F');
      pdf.text(planLines, margin + 2, yPos + 1);
      yPos += (planLines.length * (lineSpacing-1)) + 4;
      yPos += sectionSpacing / 2;


      // --- Trilha de Funcionalidade ---
      if (trilha) {
        addSectionTitle('Trilha de Funcionalidade');
        (pdf as any).autoTable({
            startY: yPos,
            body: [
                [{content: `Nível: ${trilha.nivel}`, styles: { fontStyle: 'bold', fontSize: 9 }}],
                [{content: `Subnível: ${trilha.subnivel}`, styles: { fontSize: 8 }}],
                [{content: `Pontuação: ${trilha.pontuacao}`, styles: { fontSize: 8 }}],
                [{content: `Nome: ${trilha.nome}`, styles: { fontSize: 8 }}],
                [{content: `Tempo: ${trilha.tempo}`, styles: { fontSize: 8 }}],
                [{content: `Diretriz-chave: ${trilha.diretriz}`, styles: { fontSize: 8 }}],
            ],
            theme: 'plain',
            styles: { cellPadding: 1.5 },
            didDrawPage: (data: any) => { yPos = data.cursor.y; }
        });
      }

      const patientName = form.getValues("nome")?.replace(/ /g, "_") || "paciente";
      pdf.save(`CCF - ${patientName}.pdf`);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível criar o relatório. Tente novamente.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8 bg-background p-2">
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
        </div>

        <div className="flex flex-col-reverse justify-end gap-4 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleReset}>
                Limpar Formulário
            </Button>
            {result && (
                <Button type="button" variant="secondary" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Baixar Relatório
                </Button>
            )}
            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Calcular CCF
            </Button>
        </div>
      </form>
    </Form>
  );
}
