"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function PatientDataCard() {
  const form = useFormContext();

  const renderSelectField = (name: string, label: string, tooltip: string, options: string[], valueAsString?: boolean) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>{label}</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
          </div>
          <Select onValueChange={field.onChange} value={field.value?.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Selecione`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={valueAsString ? option : option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <TooltipProvider>
        <Card className="border-2 border-slate-200 shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-2xl">🧓</span>
              Dados Gerais e CCF Clínico
            </CardTitle>
            <CardDescription className="text-slate-600 mt-1">
            Informações demográficas e de saúde do paciente para cálculo do CCF Clínico.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 p-6">
            <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormLabel>Nome do Paciente</FormLabel>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Nome completo do paciente (opcional).</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    <FormControl>
                        <Input type="text" placeholder="Ex: João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="dataDoCaso"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormLabel>Data do Caso</FormLabel>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Data do caso (opcional).</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    <FormControl>
                        <Input type="text" placeholder="Ex: 15/01/2024" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
            control={form.control}
            name="idade"
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                        <FormLabel>Idade</FormLabel>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>&lt; 60 anos: 0 pts | 60-79 anos: 1 pt | 80-89 anos: 2 pts | &gt;= 90 anos: 3 pts</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                <FormControl>
                    <Input type="number" placeholder="Ex: 75" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            {renderSelectField("hd", "HD", "CID Crônico estável: 1 pt | CID Crônico: 2 pts | CID Crônico limitante: 3 pts | CID Agudo/Avançado: 4 pts", ["CID Crônico estável", "CID Crônico", "CID Crônico limitante", "CID Agudo/Avançado"])}
            {renderSelectField("internacao", "Internação não eletiva anual", "Não: 1 pt | 1: 3 pts | 2 ou mais: 4 pts", ["Não", "1", "2 ou mais"])}
            {renderSelectField("fragilidade", "Fragilidade", "Robusto: 1 pt | Pré-frágil: 2 pts | Frágil: 3 pts", ["Robusto", "Pré-frágil", "Frágil"])}
            {renderSelectField("sarcopenia", "Sarcopenia", "Não sarcopênico: 1 pt | Pré-sarcopênico: 2 pts | Sarcopênico: 3 pts", ["Não sarcopênico", "Pré-sarcopênico", "Sarcopênico"])}
            {renderSelectField("quedas", "Quedas anuais", "Nenhuma: 1 pt | 1: 2 pts | 2 ou mais: 3 pts", ["Nenhuma", "1", "2 ou mais"])}
            {renderSelectField("ativoNaComunidade", "Ativo na comunidade", "Sim: -3 pts | Não: 0 pts", ["Sim", "Não"])}
            {renderSelectField("fisioDiaria", "Fisio diária >= 3 semanas", "Sim: -3 pts | Não: 0 pts", ["Sim", "Não"])}
            {renderSelectField("vinculo", "Vínculo", "Estabelecido: 0 pts | Via ELO: 1 pt | Não estabelecido: 2 pts", ["Não estabelecido", "Via ELO", "Estabelecido"])}
        </CardContent>
        </Card>
    </TooltipProvider>
  );
}
