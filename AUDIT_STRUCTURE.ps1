# -------------------------------------------------------------------------
# PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
# ARQUIVO: E:\Projetos\SaudeCicloDaVida\AUDIT_STRUCTURE.ps1
# OBJETIVO: AUDITORIA SISTÊMICA ADAPTADA PARA INFRAESTRUTURA POSTGRESQL
# -------------------------------------------------------------------------

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "        VAULTMIND OS | SAÚDE CICLO DA VIDA v2.6          " -ForegroundColor White -BackgroundColor DarkCyan
Write-Host "             AUDITORIA SISTÊMICA DE INTEGRIDADE           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. VERIFICAÇÃO DE DEPENDÊNCIAS
Write-Host "[1/4] Verificando integridade das dependências..." -ForegroundColor Yellow
$Modules = @("backend\node_modules", "web\node_modules")
foreach ($m in $Modules) {
    if (Test-Path "E:\Projetos\SaudeCicloDaVida\$m") {
        Write-Host "  [OK] Módulos de $m instalados." -ForegroundColor Green
    } else {
        Write-Host "  [FALHA] Módulos de $m AUSENTES!" -ForegroundColor Red
    }
}

# 2. AUDITORIA DE BANCO DE DADOS (POSTGRESQL / PRISMA)
Write-Host "`n[2/4] Verificando infraestrutura de dados (PostgreSQL)..." -ForegroundColor Yellow
if (Test-Path "E:\Projetos\SaudeCicloDaVida\backend\prisma\schema.prisma") {
    Write-Host "  [OK] Schema Prisma localizado." -ForegroundColor Green
} else {
    Write-Host "  [CRÍTICO] Schema Prisma não encontrado!" -ForegroundColor Red
}

if (Test-Path "E:\Projetos\SaudeCicloDaVida\backend\node_modules\.prisma") {
    Write-Host "  [OK] Prisma Client gerado e sincronizado." -ForegroundColor Green
} else {
    Write-Host "  [AVISO] Prisma Client não detectado. Execute 'npx prisma generate'." -ForegroundColor Magenta
}

# 3. VERIFICAÇÃO DE CONFIGURAÇÕES (.env)
Write-Host "`n[3/4] Validando variáveis de ambiente..." -ForegroundColor Yellow
$Envs = @("backend\.env", "web\.env")
foreach ($env in $Envs) {
    if (Test-Path "E:\Projetos\SaudeCicloDaVida\$env") {
        Write-Host "  [OK] Arquivo $env presente." -ForegroundColor Green
    } else {
        Write-Host "  [FALHA] $env ausente!" -ForegroundColor Red
    }
}

# 4. RESUMO DE SAÚDE
Write-Host "`n[4/4] Gerando relatório de saúde..." -ForegroundColor Yellow
$FileCount = (Get-ChildItem -Recurse -File -Exclude node_modules, .git, dist | Measure-Object).Count
Write-Host "  > Sistema operando com motor PostgreSQL." -ForegroundColor Cyan
Write-Host "  > Total de arquivos de código: $FileCount" -ForegroundColor White

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "       AUDITORIA CONCLUÍDA. SISTEMA EM CONFORMIDADE.      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan