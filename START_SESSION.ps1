# -------------------------------------------------------------------------
# PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
# ARQUIVO: E:\Projetos\SaudeCicloDaVida\START_SESSION.ps1
# OBJETIVO: ORQUESTRAÇÃO DE INICIALIZAÇÃO, LIMPEZA DE CACHE E AUDITORIA
# -------------------------------------------------------------------------

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "        VAULTMIND OS | SAÚDE CICLO DA VIDA v2.6          " -ForegroundColor White -BackgroundColor Blue
Write-Host "            INICIANDO SESSÃO DE DESENVOLVIMENTO           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. VALIDAÇÃO DE ESTRUTURA
Write-Host "[1/4] Auditando estrutura de pastas..." -ForegroundColor Yellow
$Paths = @("backend", "web", "mobile")
foreach ($p in $Paths) {
    if (Test-Path "E:\Projetos\SaudeCicloDaVida\$p") {
        Write-Host "  [OK] Diretório $p localizado." -ForegroundColor Green
    } else {
        Write-Host "  [ALERTA] Diretório $p não encontrado!" -ForegroundColor Red
    }
}

# 2. LIMPEZA DE AMBIENTE (Prevenindo conflitos de cache)
Write-Host "`n[2/4] Limpando resíduos e caches temporários..." -ForegroundColor Yellow
# Limpa logs do NestJS se existirem
if (Test-Path "backend/dist") { Remove-Item -Path "backend/dist" -Recurse -Force }
Write-Host "  [OK] Cache de compilação Backend limpo." -ForegroundColor Green

# 3. VERIFICAÇÃO DE PORTAS (4000 e 5173)
Write-Host "`n[3/4] Verificando integridade das portas de rede..." -ForegroundColor Yellow
$Ports = @(4000, 5173)
foreach ($port in $Ports) {
    $checkPort = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($checkPort) {
        Write-Host "  [ALERTA] A porta $port já está em uso! Tentando liberar..." -ForegroundColor Red
        Stop-Process -Id $checkPort.OwningProcess -Force
        Write-Host "  [OK] Porta $port liberada." -ForegroundColor Green
    } else {
        Write-Host "  [OK] Porta $port disponível." -ForegroundColor Green
    }
}

# 4. INICIALIZAÇÃO DOS SERVIÇOS EM NOVAS JANELAS
Write-Host "`n[4/4] Disparando motores do ecossistema..." -ForegroundColor Yellow

# Iniciar Backend (NestJS)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev" -WindowStyle Normal
Write-Host "  [START] Servidor API NestJS (Porta 4000) iniciado." -ForegroundColor Green

# Iniciar Frontend (Vite/React)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev" -WindowStyle Normal
Write-Host "  [START] Dashboard Web Vite (Porta 5173) iniciado." -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "     AMBIENTE PRONTO. BOA CODIFICAÇÃO, ARQUITETO!        " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan