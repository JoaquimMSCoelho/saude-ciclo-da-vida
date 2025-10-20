# 🧭 Roadmap Técnico — Projeto Saúde Ciclo da Vida (Backend)

📅 Atualizado em: 19/10/2025  
👤 Responsável: Joaquim  
📂 Local: `backend/`  
🛠️ Stack: Node.js, Fastify/Express, JWT, Prisma, Jest, Axios

---

## 📌 Visão Geral

Este roadmap organiza o progresso técnico do backend por fases, com entregas claras, status atual e próximos passos. Serve como guia de desenvolvimento e controle de débito técnico.

---

## ✅ Fase 1 — Planejamento e Setup

**Objetivo:** Definir escopo, stack e estrutura inicial do projeto

- [x] Escolha do stack técnico (Node.js, JWT, Prisma, Jest)
- [x] Inicialização do projeto com `npm init`
- [x] Criação da estrutura de pastas (`src`, `tests`, `docs`)
- [x] Instalação de dependências principais e dev

---

## ✅ Fase 2 — Implementação da API de Autenticação

**Objetivo:** Criar rotas básicas de autenticação com JWT

- [x] `POST /auth/register` — registro de usuário com validação
- [x] `POST /auth/login` — login com geração de token JWT
- [x] `GET /auth/me` — rota protegida com verificação de token
- [x] Middleware de autenticação JWT
- [x] Hash de senha com `bcrypt`

---

## ✅ Fase 3 — Testes Manuais

**Objetivo:** Validar rotas via REST Client

- [x] Criação de `auth-test.http` para testes manuais
- [x] Testes de registro, login e acesso protegido

---

## ✅ Fase 4 — Testes Automatizados com Jest

**Objetivo:** Cobrir autenticação com testes automatizados

- [x] Instalação e configuração do Jest
- [x] Criação de `auth.test.js` com cobertura para:
  - Registro de usuário
  - Login com sucesso
  - Acesso à rota protegida
  - Token inválido
  - Múltiplos usuários
  - Rota `/auth/update` (simulada)
  - Rota `/auth/logout` (simulada)

---

## ✅ Fase 5 — Documentação Técnica

**Objetivo:** Registrar progresso e decisões técnicas

- [x] Criação de `checkpoint.md` com histórico técnico
- [x] Criação de `roadmap.md` com fases e entregas
- [ ] Criar `api.md` com documentação das rotas

---

## 🔄 Fase 6 — Expansão de Rotas e Testes

**Objetivo:** Completar autenticação e aumentar cobertura

- [ ] Implementar `PUT /auth/update`
- [ ] Implementar `POST /auth/logout`
- [ ] Corrigir status HTTP para token inválido (`403` → `401`)
- [ ] Adicionar testes para:
  - [ ] Login com senha incorreta
  - [ ] Registro com e-mail inválido
  - [ ] Acesso sem token
- [ ] Melhorar geração de e-mails aleatórios nos testes

---

## 🔜 Fase 7 — Integração com Banco e Limpeza

**Objetivo:** Gerenciar dados de teste com Prisma

- [ ] Criar seed de dados para testes
- [ ] Adicionar `beforeAll` / `afterAll` para limpar usuários
- [ ] Validar rollback ou truncamento entre execuções

---

## 🔜 Fase 8 — Cobertura e Monitoramento

**Objetivo:** Medir qualidade e performance

- [ ] Gerar relatório com `jest --coverage`
- [ ] Analisar % de cobertura por rota
- [ ] Adicionar logs estruturados (`pino`, `winston`)
- [ ] Preparar métricas básicas (tempo de resposta, erros)

---

## 🔜 Fase 9 — Deploy e Integração Contínua

**Objetivo:** Preparar ambiente de produção

- [ ] Criar `Dockerfile` e `docker-compose.yml`
- [ ] Configurar `.env` para produção
- [ ] Configurar CI/CD (ex: GitHub Actions)
- [ ] Deploy em ambiente de staging (Render, Railway, etc.)

---

## 🧠 Observações Técnicas

- Testes automatizados estão funcionando e cobrem os principais fluxos
- A estrutura modular permite expansão por domínio (auth, user, etc.)
- O uso de JWT permite autenticação stateless, ideal para escalabilidade
- O projeto está pronto para integração com frontend e deploy

---
