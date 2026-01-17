# -*- coding: utf-8 -*-
"""
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
ARQUITETURA: FULL STACK (NestJS + React Native + Next.js)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÓDULO: GERADOR DE DOCUMENTAÇÃO ESTRUTURAL (TREE v2.0)
DESCRIÇÃO: Mapeia pastas e arquivos e exporta um relatório Markdown (.md)
para a raiz do projeto, ignorando lixo de sistema.
-------------------------------------------------------------------------
"""

import os

def generate_tree_content(startpath, ignore_dirs=None):
    if ignore_dirs is None:
        # LISTA NEGRA: Pastas ignoradas
        ignore_dirs = [
            'node_modules', '.git', '.next', 'dist', 'build', 
            'coverage', '__pycache__', '.expo', '.vscode', '.idea'
        ]
    
    # Buffer para armazenar as linhas do relatório
    lines = []
    
    root_name = os.path.basename(os.path.abspath(startpath))
    
    # Cabeçalho do Markdown
    lines.append(f"# 📁 ESTRUTURA DO PROJETO: {root_name}")
    lines.append(f"> Relatório gerado automaticamente.\n")
    lines.append("```text") # Inicia bloco de código para manter indentação

    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        
        # Filtra pastas ignoradas
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        folder_name = os.path.basename(root)
        
        # Lógica de desenho da árvore
        if level == 0:
            pass 
        else:
            lines.append(f"{indent}📂 {folder_name}/")
        
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            lines.append(f"{subindent}📄 {f}")

    lines.append("```") # Fecha bloco de código
    lines.append("\n_Fim do Mapeamento_")
    
    return "\n".join(lines)

def main():
    # Limpa console
    os.system('cls' if os.name == 'nt' else 'clear')
    print("=" * 50)
    print("   GERADOR DE ESTRUTURA v2.0")
    print("=" * 50)

    # Identifica a raiz do projeto
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir)
    
    print(f"📍 Mapeando raiz: {root_dir}...")
    
    # Gera o conteúdo
    markdown_content = generate_tree_content(root_dir)
    
    # Define o nome do arquivo de saída na Raiz
    output_file = os.path.join(root_dir, "ESTRUTURA_PROJETO.md")
    
    # Escreve no disco (UTF-8 para suportar emojis)
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
        print(f"\n✅ SUCESSO! Arquivo gerado:")
        print(f"   📄 {output_file}")
        print("\n   Você pode abrir este arquivo no VS Code para visualizar.")
        
    except Exception as e:
        print(f"\n❌ ERRO AO GRAVAR ARQUIVO: {e}")

if __name__ == "__main__":
    main()