import { CcfForm } from "@/components/ccf-form";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <main className="container mx-auto p-4 md:p-8">
        {/* Header com Nome da Empresa */}
        <header className="mb-10 md:mb-12">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            {/* Nome da Empresa */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                ELO SENIOR CARE
              </h1>
              <div className="h-1.5 w-32 bg-gradient-to-r from-teal-400 via-lime-400 to-orange-400 mx-auto rounded-full shadow-sm"></div>
            </div>
            
            {/* Título do Sistema */}
            <div className="text-center space-y-2 pt-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-700">
                Análise de Caso – CCF
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-medium">
                versão mai.24
              </p>
            </div>
          </div>
        </header>

        {/* Formulário */}
        <div className="max-w-7xl mx-auto">
          <CcfForm />
        </div>
        
        <Toaster />
      </main>
      
      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-slate-200 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} ELO SENIOR CARE. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
