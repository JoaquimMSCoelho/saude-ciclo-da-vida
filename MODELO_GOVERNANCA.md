[NOME_DO_PROJETO] - MANUAL MESTRE DE GOVERNANÇA E OPERAÇÃO
Responsável Técnica: Equipe de Desenvolvimento
Norma: Extremo Zero (Substituição Total)
Versão do Documento: 2.3 (Atualizada com Protocolo de Cabeçalhos)

1. 🏛️ A Constituição do Projeto (Política de Governança)
1.1. Princípio Fundamental (Cláusula Pétrea)
Fica estabelecido o padrão de "Desenvolvimento a Partir do Extremo Zero". É estritamente VEDADA a prática de "remendos", edições parciais ou incrementos diretos em artefatos corrompidos ou ambientes instáveis.
- Falhou? Apaga-se e reconstrói-se o artefato.
- Mudou de Máquina? Regenera-se o ambiente completo.
- Vai gerar versão? Limpa-se tudo antes de compilar.

1.2. Consistência de Ambiente
Nenhum código será promovido a Produção, nem o desenvolvimento será iniciado em novo equipamento, sem a prévia validação pelo Script de Verificação de Ambiente (SVA).

2. 📍 Localização e Armazenamento
- Diretório Oficial: P:\Projetos\[NOME_DO_PROJETO]
- Regra de Ouro: O desenvolvimento NUNCA deve ocorrer dentro de pastas sincronizadas em tempo real (OneDrive, Google Drive) para evitar travamento de arquivos.
- Backup: Nuvens apenas para armazenamento frio (zip) ou Repositório Git.

3. 🛡️ Procedimento Operacional Padrão (POP-001)
3.1. Pré-Migração / Início de Trabalho Diário
Sempre que iniciar o trabalho ou trocar de computador:
1. Acessar o diretório raiz do projeto.
2. Executar o script: python scripts/verify_env.py
3. Ler o relatório de saída.
   - Se retornar [ALERTA] ou [ERRO]: PARAR. Não tente rodar o projeto. Instale o que falta.
   - Se retornar [STATUS VERDE/OK]: AUTORIZADO a trabalhar.

3.2. Rotina de Alteração (O Ciclo da Substituição)
Sempre que formos [gerar um arquivo], [executar um procedimento] ou [testar uma rotina]:
1. Não editar: Ignorar o estado atual quebrado para fins de escrita.
2. Gerar do Zero: Criar o novo componente completo.
3. Substituir: Apagar o velho, colar o novo.
4. Validar: Testar se o novo componente completo funciona.

3.3. Protocolo de Segurança Anti-Regressão
Para evitar a perda de funcionalidades já aprovadas (Regressão) durante a reescrita de código:
- Auditoria de Legado (Obrigatória): Antes de solicitar a reescrita de um arquivo crítico, o Operador deve fornecer o código atual em uso.
- Mapeamento de Features: O Arquiteto (IA) deve ler o código antigo e listar as lógicas de negócio ativas.
- Reescrita Consciente: O código "Extremo Zero" deve ser gerado contendo explicitamente as features mapeadas.

4. 🚀 Procedimento de Build e Reconstrução
Para gerar uma nova versão executável ou limpar o ambiente:
1. Limpeza Total (obrigatório): Deletar manualmente as pastas dist, build e __pycache__.
2. Verificação: Rodar python scripts/verify_env.py novamente.
3. Reinstalação Limpa (Backend): npm install (ou pip install).
4. Reinstalação Limpa (Frontend): npm install.

5. ✅ Checklist de Validação (Obrigatório)
Antes de dar qualquer tarefa como "Concluída", marque os itens abaixo:

1. Validação de Ferramentas (Base)
[ ] Python (Versão correta) instalado.
[ ] Node.js instalado.
[ ] Git instalado.

2. Validação do Repositório (Extremo Zero)
[ ] Script python scripts/verify_env.py executado e retornou TUDO VERDE.
[ ] Pastas de lixo foram deletadas.

3. Teste de Fumaça
[ ] Backend roda sem erros.
[ ] Frontend roda sem erros.

6. 🛠️ Anexo Técnico: O Script de Verificação
(O código do script SVA v3.0 encontra-se no arquivo scripts/verify_env.py)

7. 🗣️ Protocolo de Comunicação e Instrução (O Padrão Didático)
Para garantir a execução perfeita das normas acima, toda interação entre o Arquiteto (IA) e o Operador (Usuário) deve obedecer aos seguintes critérios:

7.1. O Princípio da Granularidade Máxima
É PROIBIDO fornecer instruções genéricas. A instrução deve ser atômica:
* Passo a Passo: Quebre tarefas complexas em micro-tarefas.
* Linha por Linha: Se um arquivo tem 10 linhas, forneça as 10 linhas.
* Comando por Comando: Um comando por bloco de código.

7.2. O Fator "Extremo Zero"
Toda explicação deve assumir que o Operador está começando do zero absoluto naquela tarefa específica.
* Clareza Lógica: Explique o "Porquê" antes do "Como".
* Navegação Explícita: Sempre inicie o comando com "1. Abra o terminal na pasta X".

8. 🏷️ Padronização de Arquivos (Header Protocol)
Todo arquivo de código-fonte criado no projeto deve iniciar obrigatoriamente com o cabeçalho de identificação padrão.

Padrão Universal:
/*
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
ARQUITETURA: FULL STACK (NestJS + React Native + Next.js)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÓDULO: [Nome do Módulo/Arquivo]
DESCRIÇÃO: [Breve descrição do que este arquivo faz]
-------------------------------------------------------------------------
*/
(Adaptar a sintaxe de comentário conforme a linguagem: # para Python, // para TS)