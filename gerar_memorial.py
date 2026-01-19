import os
import sys
import ast
import datetime

# Diretórios que devem ser ignorados durante a varredura
DIRETORIOS_IGNORADOS = {
    ".git",
    "venv",
    "__pycache__",
    "node_modules",
    ".idea",
    ".vscode",
    ".pytest_cache",
    "dist",
    "build",
}


def identificar_tipo_arquivo(nome_arquivo: str, caminho_completo: str) -> str:
    nome_lower = nome_arquivo.lower()
    _, ext = os.path.splitext(nome_lower)

    tipos = {
        ".py": "Código-fonte (Python)",
        ".js": "Código-fonte (JavaScript)",
        ".ts": "Código-fonte (TypeScript)",
        ".jsx": "Código-fonte (React JSX)",
        ".tsx": "Código-fonte (React TSX)",
        ".html": "Arquivo HTML",
        ".css": "Arquivo CSS",
        ".json": "Arquivo JSON",
        ".yml": "Arquivo YAML",
        ".yaml": "Arquivo YAML",
        ".md": "Documentação Markdown",
        ".txt": "Arquivo de texto",
        ".env": "Variáveis de ambiente",
        ".log": "Arquivo de log",
    }

    return tipos.get(ext, "Arquivo genérico / não identificado")


def inferir_finalidade_arquivo(nome_arquivo: str, caminho_completo: str) -> str:
    nome = nome_arquivo.lower()
    caminho = caminho_completo.lower()

    if "user" in nome:
        return "Provavelmente relacionado a usuários."
    if "auth" in nome:
        return "Provavelmente relacionado a autenticação."
    if "config" in nome:
        return "Arquivo de configuração."
    if "api" in caminho:
        return "Provavelmente parte da API."
    if "model" in nome:
        return "Provavelmente define modelos de dados."
    if "service" in nome:
        return "Provavelmente implementa regras de negócio."
    if "test" in nome:
        return "Arquivo de testes automatizados."

    return "Finalidade não identificada automaticamente."


def analisar_codigo_python(caminho_completo: str) -> str:
    """
    Abre o arquivo Python e extrai:
    - Funções
    - Classes
    - Imports
    - Variáveis globais
    """
    try:
        with open(caminho_completo, "r", encoding="utf-8") as f:
            conteudo = f.read()
    except:
        return "Não foi possível ler o conteúdo do arquivo."

    try:
        arvore = ast.parse(conteudo)
    except:
        return "Arquivo Python inválido ou com erros de sintaxe."

    funcoes = []
    classes = []
    imports = []
    variaveis = []

    for node in ast.walk(arvore):
        if isinstance(node, ast.FunctionDef):
            funcoes.append(node.name)
        elif isinstance(node, ast.ClassDef):
            classes.append(node.name)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)
        elif isinstance(node, ast.ImportFrom):
            imports.append(f"{node.module} (from)")
        elif isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    variaveis.append(target.id)

    bloco = []
    bloco.append("Resumo interno do código Python:")
    bloco.append(f"- Funções encontradas: {funcoes if funcoes else 'Nenhuma'}")
    bloco.append(f"- Classes encontradas: {classes if classes else 'Nenhuma'}")
    bloco.append(f"- Imports detectados: {imports if imports else 'Nenhum'}")
    bloco.append(f"- Variáveis globais: {variaveis if variaveis else 'Nenhuma'}")
    bloco.append("")

    return "\n".join(bloco)


def obter_metadados_arquivo(caminho_completo: str) -> dict:
    stats = os.stat(caminho_completo)
    return {
        "tamanho_bytes": stats.st_size,
        "data_modificacao": datetime.datetime.fromtimestamp(stats.st_mtime),
        "data_criacao": datetime.datetime.fromtimestamp(stats.st_ctime),
    }


def gerar_bloco_analise_arquivo(caminho_completo: str) -> str:
    nome_arquivo = os.path.basename(caminho_completo)
    tipo = identificar_tipo_arquivo(nome_arquivo, caminho_completo)
    finalidade = inferir_finalidade_arquivo(nome_arquivo, caminho_completo)
    meta = obter_metadados_arquivo(caminho_completo)

    bloco = []
    bloco.append("========================================")
    bloco.append(f"ARQUIVO: {caminho_completo}")
    bloco.append("========================================")
    bloco.append(f"Nome: {nome_arquivo}")
    bloco.append(f"Tipo: {tipo}")
    bloco.append(f"Finalidade provável: {finalidade}")
    bloco.append(f"Tamanho: {meta['tamanho_bytes']} bytes")
    bloco.append(f"Modificado em: {meta['data_modificacao']}")
    bloco.append(f"Criado em: {meta['data_criacao']}")
    bloco.append("")

    # Análise interna para arquivos Python
    if tipo == "Código-fonte (Python)":
        bloco.append(analisar_codigo_python(caminho_completo))

    bloco.append("\n")
    return "\n".join(bloco)


def gerar_memorial(raiz_projeto: str):
    memorial_path = os.path.join(raiz_projeto, "MemorialProjeto.md")

    linhas = []
    linhas.append("# Memorial Técnico do Projeto")
    linhas.append(f"Projeto analisado: {raiz_projeto}")
    linhas.append(f"Data: {datetime.datetime.now()}")
    linhas.append("\n---\n")

    for dirpath, dirnames, filenames in os.walk(raiz_projeto):
        # Remover diretórios ignorados
        dirnames[:] = [d for d in dirnames if d not in DIRETORIOS_IGNORADOS]

        for filename in filenames:
            caminho_completo = os.path.join(dirpath, filename)
            linhas.append(gerar_bloco_analise_arquivo(caminho_completo))

    with open(memorial_path, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas))

    print(f"Memorial gerado com sucesso em:\n{memorial_path}")


def main():
    if len(sys.argv) < 2:
        print("Uso correto:")
        print("python gerar_memorial.py \"C:\\caminho\\do\\projeto\"")
        return

    raiz = sys.argv[1]

    if not os.path.isdir(raiz):
        print(f"Erro: diretório não encontrado: {raiz}")
        return

    gerar_memorial(raiz)


if __name__ == "__main__":
    main()
