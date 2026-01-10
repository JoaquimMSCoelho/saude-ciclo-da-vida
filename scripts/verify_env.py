# -*- coding: utf-8 -*-
"""
SCRIPT DE VERIFICAÇÃO DE AMBIENTE (SVA)
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
ARQUITETURA: MARCO ZERO v3.0
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)

Este script valida se a máquina de desenvolvimento possui o arsenal tecnológico
mínimo para iniciar os trabalhos sem riscos de regressão ou incompatibilidade.
"""

import sys
import os
import subprocess
import shutil

# Definição de Cores ANSI para Feedback Visual
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_status(component, status, message=""):
    """Imprime o status formatado no console."""
    if status == "OK":
        color = Colors.OKGREEN
        symbol = "✅"
    elif status == "ALERTA":
        color = Colors.WARNING
        symbol = "⚠️ "
    else:
        color = Colors.FAIL
        symbol = "❌"
    
    # Formatação alinhada
    print(f"{symbol} [{component.ljust(15)}] {color}{status.ljust(10)}{Colors.ENDC} {message}")

def check_command(command, version_flag="--version"):
    """
    Verifica se um comando existe no PATH e retorna sua versão.
    Retorna: (bool_sucesso, string_versao)
    """
    try:
        # shell=True necessário para Windows reconhecer comandos do sistema
        result = subprocess.run(
            f"{command} {version_flag}", 
            shell=True, 
            capture_output=True, 
            text=True, 
            encoding='utf-8', 
            errors='ignore' # Evita crash com caracteres estranhos
        )
        
        if result.returncode == 0:
            # Pega a primeira linha da saída, que geralmente contém a versão
            version_output = result.stdout.strip().split('\n')[0]
            if not version_output: # Fallback para stderr se stdout estiver vazio
                version_output = result.stderr.strip().split('\n')[0]
            return True, version_output
        else:
            return False, None
    except Exception:
        return False, None

def check_directory_structure():
    """Verifica se a estrutura de pastas do Marco Zero existe."""
    required_dirs = ["backend", "frontend", "docs", "scripts"]
    print(f"\n{Colors.HEADER}--- 2. VALIDAÇÃO ESTRUTURAL (MARCO ZERO v3.0) ---{Colors.ENDC}")
    
    all_dirs_ok = True
    # Assume que o script está rodando de /scripts ou da raiz. 
    # Tenta localizar a raiz baseada na localização deste arquivo.
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir) # Sobe um nível para a raiz do projeto
    
    for folder in required_dirs:
        target_path = os.path.join(root_dir, folder)
        if os.path.isdir(target_path):
            print_status(f"DIR: {folder}", "OK", "Estrutura presente")
        else:
            print_status(f"DIR: {folder}", "ALERTA", "Diretório não encontrado (Criar antes de iniciar)")
            all_dirs_ok = False
    return all_dirs_ok

def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"{Colors.BOLD}{Colors.HEADER}="*70)
    print("   🛡️  CyberTreinaIA - VERIFICADOR DE AMBIENTE (SVA)")
    print("   PROJETO: SAÚDE CICLO DA VIDA | GOVERNANÇA: ATIVA")
    print("="*70 + f"{Colors.ENDC}")

    global_success = True

    # ---------------------------------------------------------
    # 1. VERIFICAÇÃO DE FERRAMENTAS (ARSENAL TECNOLÓGICO)
    # ---------------------------------------------------------
    print(f"\n{Colors.HEADER}--- 1. ARSENAL TECNOLÓGICO (VALIDAÇÃO DE BINÁRIOS) ---{Colors.ENDC}")

    # A. Python (Automação & IA)
    py_version = sys.version.split()[0]
    if sys.version_info >= (3, 10):
        print_status("PYTHON", "OK", f"Versão Detectada: {py_version}")
    else:
        print_status("PYTHON", "ERRO", f"Versão Obsoleta: {py_version} (Requer 3.10+)")
        global_success = False

    # B. Node.js (Backend NestJS)
    node_ok, node_ver = check_command("node", "-v")
    if node_ok:
        print_status("NODE.JS", "OK", f"Motor Backend: {node_ver}")
    else:
        print_status("NODE.JS", "ERRO", "Necessário para NestJS. Não encontrado.")
        global_success = False

    # C. Git (Governança)
    git_ok, git_ver = check_command("git", "--version")
    if git_ok:
        print_status("GIT", "OK", f"Controle de Versão: {git_ver}")
    else:
        print_status("GIT", "ERRO", "Ferramenta Crítica Ausente.")
        global_success = False

    # D. Docker (Infraestrutura)
    docker_ok, docker_ver = check_command("docker", "--version")
    if docker_ok:
        print_status("DOCKER", "OK", f"Container Engine: {docker_ver}")
    else:
        print_status("DOCKER", "ERRO", "Necessário para Banco de Dados. Não encontrado.")
        global_success = False

    # E. Flutter (Frontend Mobile)
    # Usamos --version pois 'doctor' é muito lento para verificação rápida
    flutter_ok, flutter_ver = check_command("flutter", "--version")
    if flutter_ok:
        # Limpa string longa do flutter
        clean_ver = flutter_ver.split('•')[0].strip() if '•' in flutter_ver else flutter_ver
        print_status("FLUTTER", "OK", f"Framework Mobile: {clean_ver}")
    else:
        print_status("FLUTTER", "ERRO", "SDK Flutter não encontrado no PATH.")
        global_success = False

    # ---------------------------------------------------------
    # 2. VALIDAÇÃO ESTRUTURAL
    # ---------------------------------------------------------
    struct_ok = check_directory_structure()
    if not struct_ok:
        global_success = False

    # ---------------------------------------------------------
    # 3. VEREDITO FINAL (NORMA EXTREMO ZERO)
    # ---------------------------------------------------------
    print(f"\n{Colors.BOLD}{Colors.HEADER}="*70)
    print("   VEREDITO DO ARQUITETO")
    print("="*70 + f"{Colors.ENDC}")

    if global_success:
        print(f"\n{Colors.OKGREEN}✅ STATUS VERDE: AMBIENTE APROVADO PARA DESENVOLVIMENTO.{Colors.ENDC}")
        print("   O Engenheiro está autorizado a iniciar a codificação.")
        sys.exit(0)
    else:
        print(f"\n{Colors.FAIL}🛑 STATUS VERMELHO: AMBIENTE CORROMPIDO OU INCOMPLETO.{Colors.ENDC}")
        print("   AÇÃO NECESSÁRIA: Corrija as dependências acima antes de prosseguir.")
        print("   VIOLAÇÃO DA CLÁUSULA 1.2 DA PGT-01.")
        sys.exit(1)

if __name__ == "__main__":
    main()