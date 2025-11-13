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
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const imsOptions = [
    { value: 10, label: "10 - deambula 5m independente" },
    { value: 9, label: "9 - deambula 5m com DAM" },
    { value: 8, label: "8 - deambula 5m com auxílio de 1 pessoa" },
    { value: 7, label: "7 - deambula 5m com auxílio de 2 pessoas" },
    { value: 6, label: "6 - marcha 4 passos no lugar, com ou sem auxílio" },
    { value: 5, label: "5 - participa de transferência para cadeira" },
    { value: 4, label: "4 - assume OT com auxílio" },
    { value: 3, label: "3 - senta, mas precisa de auxílio" },
    { value: 2, label: "2 - passivo para CR - não realiza OT" },
    { value: 1, label: "1 - restrito ao leito" },
    { value: 0, label: "0 - passivo" },
  ];

export default function EvaluationItemsCard() {
  const form = useFormContext();
  
  const renderSelectField = (name: string, label: string, tooltip: string, options: string[] | {value: number, label: string}[], isNumeric: boolean = false) => (
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
          <Select onValueChange={(value) => field.onChange(isNumeric ? Number(value) : value)} value={field.value.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                typeof option === 'string' ? (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ) : (
                    <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                    </SelectItem>
                )
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
        <CardTitle>⚙️ Itens de Avaliação Funcional</CardTitle>
        <CardDescription>
          Critérios para cálculo do CCF Funcional.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
        {renderSelectField("ims", "IMS", "Índice de Mobilidade de Sarcopenia", imsOptions, true)}
        {renderSelectField("vm", "VM", "Velocidade da Marcha", ["> 1", "0.8 a 1", "0.4 a 0.8", "< 0.4"])}
        {renderSelectField("tsl5x", "TSL 5x", "Teste de Sentar e Levantar 5 vezes.", ["Esperado", "Pior que o esperado", "Não realiza"])}
        <FormField
          control={form.control}
          name="equilibrioSppb"
          render={({ field }) => (
            <FormItem>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FormLabel>Equilíbrio SPPB</FormLabel>
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Short Physical Performance Battery (Equilíbrio) - 0 a 4.</p>
                            </TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
                    </div>
                     <span className="w-12 rounded-md border bg-muted px-2 py-0.5 text-right text-sm text-muted-foreground tabular-nums">
                        {field.value}
                    </span>
                </div>
                <FormControl>
                    <Slider
                    min={0}
                    max={4}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                    value={[field.value]}
                    className="py-2"
                    />
                </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
