
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
import { imsOptions, getImsTooltip } from "@/lib/calculations";

export default function EvaluationItemsCard() {
  const form = useFormContext();

  const renderSelectField = (
    name: string,
    label: string,
    tooltip: React.ReactNode,
    options: { value: string | number; label: string }[] | string[],
    isNumeric: boolean = false
  ) => (
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
                  <div className="max-w-xs">{tooltip}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            onValueChange={(value) =>
              field.onChange(isNumeric ? Number(value) : value)
            }
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option, index) =>
                typeof option === "string" ? (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ) : (
                  <SelectItem
                    key={`${option.value}-${index}`}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  
  const imsTooltipContent = (
    <p>{getImsTooltip()}</p>
  );


  return (
    <Card className="border-2 border-slate-200 shadow-lg bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Itens de Avaliação e CCF Funcional
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          Critérios para cálculo do CCF Funcional.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2 p-6">
        {renderSelectField(
          "ims",
          "IMS",
          imsTooltipContent,
          imsOptions,
          true
        )}
        {renderSelectField(
          "vm",
          "VM (Velocidade de Marcha)",
          "4 pts: < 0.4 m/s | 3 pts: 0.4 a 0.8 m/s | 2 pts: 0.8 a 1 m/s | 1 pt: > 1 m/s",
          ["< 0.4", "0.4 a 0.8", "0.8 a 1", "> 1"]
        )}
        {renderSelectField(
          "tsl5x",
          "TSL 5x (sentar e levantar)",
          "4 pts: Não realiza | 3 pts: Pior que o esperado | 1 pt: Esperado",
          ["Não realiza", "Pior que o esperado", "Esperado"]
        )}
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
                        <p>Pontuação de Equilíbrio (0-4 pts): 4 pts: 0 | 3 pts: 1 | 2 pts: 2 | 1 pt: 3-4</p>
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
