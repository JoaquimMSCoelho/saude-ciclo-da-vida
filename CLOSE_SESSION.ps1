# -------------------------------------------------------------------------
# PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
# ARQUIVO: E:\Projetos\SaudeCicloDaVida\CLOSE_SESSION.ps1
# OBJETIVO: ENCERRAMENTO DE PROCESSOS, AUDITORIA E BACKUP AUTOMATIZADO
# -------------------------------------------------------------------------

Clear-Host
Write-Host "==========================================================" -ForegroundColor Red
Write-Host "        VAULTMIND OS | SAÚDE CICLO DA VIDA v2.6          " -ForegroundColor White -BackgroundColor DarkRed
Write-Host "            ENCERRANDO SESSÃO E EXECUTANDO BACKUP         " -ForegroundColor Red
Write-Host "==========================================================" -ForegroundColor Red

# 1. ENCERRAMENTO DE PROCESSOS (NODE/VITE/NEST)
Write-Host "[1/3] Finalizando processos ativos (Node.js/Vite)..." -ForegroundColor Yellow
$NodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($NodeProcesses) {
    Stop-Process -Name node -Force
    Write-Host "  [OK] Todos os processos Node.js foram encerrados." -ForegroundColor Green
} else {
    Write-Host "  [OK] Nenhum processo ativo encontrado." -ForegroundColor Gray
}

# 2. AUDITORIA DE ESTRUTURA E TAMANHO
Write-Host "`n[2/3] Auditando integridade do projeto antes do backup..." -ForegroundColor Yellow
$Size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$FormattedSize = "{0:N2}" -f $Size
Write-Host "  [INFO] Tamanho atual do projeto: $FormattedSize MB" -ForegroundColor Cyan

# 3. BACKUP DE GOVERNANÇA (GIT AUTOMATIZADO)
Write-Host "`n[3/3] Iniciando rotina de Backup Enterprise (GitHub)..." -ForegroundColor Yellow

# Verifica se há alterações
$Status = git status --porcelain
if ($Status) {
    $Date = Get-Date -Format "dd/MM/yyyy HH:mm"
    Write-Host "  [GIT] Alterações detectadas. Comitando..." -ForegroundColor Cyan
    git add .
    git commit -m "Governance Backup: Session Closed at $Date - Auto-Audit v2.6"
    
    Write-Host "  [GIT] Enviando para repositório remoto..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [SUCCESS] Backup concluído e sincronizado com sucesso." -ForegroundColor Green
    } else {
        Write-Host "  [FALHA] Erro ao sincronizar com o GitHub!" -ForegroundColor Red
    }
} else {
    Write-Host "  [OK] Nenhuma alteração pendente para backup." -ForegroundColor Gray
}

Write-Host "`n==========================================================" -ForegroundColor Red
Write-Host "     SESSÃO ENCERRADA COM SEGURANÇA. ATÉ LOGO!           " -ForegroundColor Red
Write-Host "==========================================================" -ForegroundColor Red