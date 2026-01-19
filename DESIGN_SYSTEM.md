# SAÚDE CICLO DA VIDA - DESIGN SYSTEM (PGT-01)
> Data de Congelamento: 19/01/2026

## 1. Regras Globais de Cores
- **Fundo (Background):** #FFFFFF (Branco Puro) - OBRIGATÓRIO EM TODAS AS TELAS.
- **Texto Principal:** #000000 (Preto).
- **Inputs (Campos):**
  - Cor de Fundo: #f3f4f6 (Cinza muito claro).
  - Borda: #333333 (1px sólida).
  - Texto Interno: Centralizado e Preto.
- **Botão Principal (Ação):**
  - Estilo: Cinza (#d1d5db) com borda escura.
  - Texto: "ENTER" (Caixa alta, negrito, preto).

## 2. Identidade Visual (Logos)
- **Tela de Login:**
  - Imagem: `LogoApp.png` (Logo + Texto embutido).
  - Tamanho: Grande (aprox. 170x250).
  - Posição: Topo Centralizado.
  - *Proibido:* Escrever o nome do app em texto abaixo deste logo.
- **Telas Internas (Home/Dashboard):**
  - Imagem: `LogoAppGeral.png` (Apenas o símbolo da gota).
  - Tamanho: Pequeno (aprox. 100x100).
  - Texto: "Saúde Ciclo da Vida" escrito em preto abaixo do logo.

## 3. Componentes Críticos
- **Botão SOS (Pânico):**
  - **Formato:** Redondo (Circular).
  - **Posição:** Flutuante no Canto Inferior Direito (Bottom-Right).
  - **Cor Ativo:** Vermelho (#dc2626).
  - **Cor Inativo:** Cinza (#9ca3af).
  - **Regra de Negócio:** Só ativa após o primeiro login bem-sucedido (AsyncStorage).

## 4. Navegação
- Botão "SAIR" deve estar sempre presente na Home (Canto Superior Esquerdo ou Header).