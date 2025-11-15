import { CcfForm } from "@/components/ccf-form";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl font-headline">
          Análise de Caso – CCF (versão mai.24)
        </h1>
        <p className="mt-2 text-muted-foreground">
          Formulário interativo para avaliação de pacientes segundo os critérios do CCF.
        </p>
      </header>
      <CcfForm />
      <Toaster />
    </main>
  );
}
