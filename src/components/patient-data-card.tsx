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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
    <Card>
      <CardHeader>
        <CardTitle>🧓 Dados Gerais</CardTitle>
        <CardDescription>
          Informações demográficas e de saúde do paciente para cálculo do CCF Clínico.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <div className="flex items-center gap-2">
                        <FormLabel>Nome do Paciente</FormLabel>
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Nome completo do paciente (opcional).</p>
                            </TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
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
          name="idade"
          render={({ field }) => (
            <FormItem>
                <div className="flex items-center gap-2">
                    <FormLabel>Idade</FormLabel>
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Idade do paciente em anos.</p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                </div>
              <FormControl>
                <Input type="number" placeholder="Ex: 75" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderSelectField("hd", "HD", "Hipótese Diagnóstica", ["CID Crônico estável", "CID Crônico", "CID Crônico limitante", "CID Agudo/Avançado"])}
        {renderSelectField("internacao", "Internação não eletiva anual", "Número de internações não planejadas no último ano.", ["Não", "1", "2 ou mais"])}
        {renderSelectField("fragilidade", "Fragilidade", "Nível de fragilidade do paciente.", ["Robusto", "Pré-frágil", "Frágil"])}
        {renderSelectField("sarcopenia", "Sarcopenia", "Presença e nível de sarcopenia.", ["Não sarcopênico", "Pré-sarcopênico", "Sarcopênico"])}
        {renderSelectField("quedas", "Quedas anuais", "Número de quedas no último ano.", ["Nenhuma", "1", "2 ou mais"])}
      </CardContent>
    </Card>
  );
}
