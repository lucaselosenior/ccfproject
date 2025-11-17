import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ELO SENIOR CARE - Análise de Caso CCF',
  description: 'Sistema profissional de análise e classificação de casos clínicos segundo os critérios do CCF. Ferramenta interativa para avaliação de pacientes.',
  keywords: ['ELO SENIOR CARE', 'CCF', 'Análise de Caso', 'Avaliação de Pacientes', 'Cuidado com Idosos'],
  authors: [{ name: 'ELO SENIOR CARE' }],
  creator: 'ELO SENIOR CARE',
  publisher: 'ELO SENIOR CARE',
  robots: 'index, follow',
  openGraph: {
    title: 'ELO SENIOR CARE - Análise de Caso CCF',
    description: 'Sistema profissional de análise e classificação de casos clínicos segundo os critérios do CCF.',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: [
      { url: '/logocurto.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logocurto.png', type: 'image/png' },
    ],
    shortcut: '/logocurto.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logocurto.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logocurto.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logocurto.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
