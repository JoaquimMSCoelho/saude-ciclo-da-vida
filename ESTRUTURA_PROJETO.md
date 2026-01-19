# 📁 ESTRUTURA DO PROJETO: SaudeCicloDaVida
> Status: VALIDADO EM 19/01/2026 (Backend Porta 4000 / Rota SOS)

```text
    📄 docker-compose.yml
    📄 ESTRUTURA_PROJETO.md
    📄 DESIGN_SYSTEM.md
    📄 PADROES.md
    📄 README.md
    📂 backend/
        📄 .env
        📄 .gitignore
        📄 .prettierrc
        📄 eslint.config.mjs
        📄 nest-cli.json
        📄 package-lock.json
        📄 package.json
        📄 README.md
        📄 tsconfig.build.json
        📄 tsconfig.json
        📂 prisma/
            📄 schema.prisma
            📄 seed.ts
            📂 migrations/
        📂 src/
            📄 app.controller.ts
            📄 app.module.ts
            📄 app.service.ts
            📄 emergency.controller.ts  <-- (NOVO: ROTA /sos)
            📄 main.ts                  <-- (MODIFICADO: PORTA 4000)
            📄 prisma.service.ts
            📂 alerts/
                📄 alerts.module.ts
            📂 auth/
                📄 auth.module.ts
                📄 auth.service.ts
            📂 users/
                📄 users.module.ts
    📂 mobile/
        📄 app.json
        📄 App.tsx
        📄 index.ts
        📄 package.json
        📄 tsconfig.json
        📂 src/
            📂 components/
                📄 PanicButtonSmall.tsx
                📄 LogoutButton.tsx
            📂 screens/
                📄 HomeScreen.tsx
                📄 LoginScreen.tsx
                📄 PanicScreen.tsx      <-- (ROTA ATUALIZADA)
            📂 services/
                📄 api.ts               <-- (PORTA 4000)
            📂 styles/
                📄 global.ts
    📂 web-admin/
        📄 next.config.ts
        📄 package.json
        📄 postcss.config.mjs
        📄 tailwind.config.ts
        📄 tsconfig.json
        📂 src/
            📂 app/
                📄 layout.tsx
                📄 page.tsx             <-- (DASHBOARD ATIVO)
                📄 globals.css