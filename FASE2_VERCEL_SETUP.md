# FASE 2 — Vercel

## Data de Execução
06/10/2025

## Responsável Técnico
Joaquim M. S. Coelho — Desenvolvedor Sênior Full Stack  
Email: joaquimmscoelho@outlook.com  
Plataforma: Windows  
Terminal: PowerShell  
Editor: VSCode  
Hospedagem: Vercel

---

## 🎯 Objetivo da Fase
Configurar a hospedagem do frontend do projeto Saúde Ciclo da Vida na plataforma Vercel, com deploy automatizado via GitHub e variáveis de ambiente aplicadas.

---

## 🧱 Etapas Executadas

### 1. Autenticação na Vercel

- Conta: `JoaquimMSCoelho`
- Autenticado via GitHub

---

### 2. Importação do Projeto

| Campo              | Valor                     |
|--------------------|---------------------------|
| Repositório        | `saude-ciclo-da-vida`     |
| Framework Preset   | `React (Vite)`            |
| Root Directory     | `frontend-app`            |
| Build Command      | `npm run build`           |
| Output Directory   | `dist`                    |

---

### 3. Configuração de Variáveis de Ambiente

```env
VITE_API_URL=https://api.saude.com
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_KEY=chave_publica

---

## 📍 Checkpoint Final do Deploy

- Commit: `d11c4fc`  
- Mensagem: Atualização dos arquivos técnicos `.md`  
- Status: ✅ `Ready`  
- Ambiente: `Production`  
- Duração: `4s`  
- Domínio principal: [saude-ciclo-da-vida.vercel.app](https://saude-ciclo-da-vida.vercel.app)  
- Data: 06/10/2025 — 17:24

Deploy concluído com sucesso. Frontend publicado e disponível para integração com Supabase.
---

## 🔧 Ajuste Técnico — Root Directory

Durante a reimportação do projeto via [https://vercel.com/import](https://vercel.com/import), foi necessário definir:

- Root Directory: `frontend-app`
- Build Command: `npm run build`
- Output Directory: `dist`

⚠️ A Vercel sugeriu renomear o projeto para `saude-ciclo-da-vida/frontend-app`, o que gerou erro por conter caractere inválido `/`.

✅ Solução aplicada: renomear o projeto para `saude-ciclo-da-vida-frontend`, mantendo a estrutura correta e evitando conflitos com OpenID Connect.

Deploy refeito com sucesso e estrutura validada.
