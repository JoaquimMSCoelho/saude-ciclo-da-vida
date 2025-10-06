# FASE 3 — Supabase

## Data de Execução
06/10/2025

## Responsável Técnico
JoaquimMSCoelho — DEV Sênior Full Stack  
Email: joaquimmscoelho@outlook.com  
Plataforma: Windows  
Terminal: PowerShell  
Editor: VSCode  
Backend: Supabase

---

## 🎯 Objetivo da Fase
Configurar o backend gerenciado do projeto Saúde Ciclo da Vida usando Supabase, com banco de dados PostgreSQL, autenticação e API REST.

---

## 🧱 Etapas Executadas

### 1. Criação do projeto Supabase

| Campo           | Valor                        |
|-----------------|------------------------------|
| Nome do projeto | `saude-ciclo-da-vida`        |
| Organização     | `JoaquimMSCoelho`            |
| Região          | `South America (sa-east-1)`  |
| Banco de dados  | PostgreSQL                   |

---

### 2. Estrutura inicial de tabelas

```sql
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  nascimento DATE,
  email TEXT UNIQUE,
  criado_em TIMESTAMP DEFAULT now()
);
