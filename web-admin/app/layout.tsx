/*
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
ARQUITETURA: FULL STACK (NestJS + React Native + Next.js)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÓDULO: LAYOUT ROOT (App Router)
DESCRIÇÃO: Estrutura global da aplicação. 
AJUSTE TÉCNICO: Substituição de fontes locais por Google Fonts (Inter) 
para evitar erros de build por arquivo ausente. Inclui supressão de hidratação.
-------------------------------------------------------------------------
*/

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Usa fonte da nuvem (Google)
import "./globals.css";

// Inicializa a fonte Inter (Padrão Enterprise)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Torre de Controle SOS",
  description: "Monitoramento de Vida Assistida - Enterprise Edition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* className={inter.className}: Aplica a fonte automaticamente.
        suppressHydrationWarning: Ignora erros de extensões do navegador.
      */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}