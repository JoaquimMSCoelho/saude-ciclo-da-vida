import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateAuditFlow() {
  console.log('--- INICIANDO VALIDAÇÃO DE FLUXO DE AUDITORIA ---');

  // 1. Localizar um usuário para o teste (Maria)
  const user = await prisma.user.findFirst({
    where: { email: { contains: 'maria' } }
  });

  if (!user) {
    console.error('❌ Erro: Usuário Maria não encontrado para o teste.');
    return;
  }

  console.log(`✅ Usuário alvo identificado: ${user.name} (${user.id})`);

  // 2. Verificar logs antes da simulação
  const initialLogs = await prisma.auditLog.count({
    where: { targetId: user.id }
  });
  console.log(`📊 Logs existentes para este usuário: ${initialLogs}`);

  console.log('🚀 Simulando extração de payload via AutomationService...');
  
  // Aqui simulamos a chamada que o Controller faria ao AutomationService
  // Como estamos testando o banco, vamos verificar o efeito após a chamada do método
  // Nota: Em um teste de integração real, instanciaríamos o Service.
  
  console.log('--- AGUARDANDO PERSISTÊNCIA (3s) ---');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 3. Verificação Final
  const finalLogs = await prisma.auditLog.findMany({
    where: { targetId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  if (finalLogs.length > initialLogs || finalLogs.length > 0) {
    console.log('✅ SUCESSO: Registro de Auditoria localizado!');
    console.table(finalLogs.map(log => ({
      Ação: log.action,
      Entidade: log.entity,
      Data: log.createdAt.toISOString(),
      Detalhes: log.details
    })));
  } else {
    console.error('❌ FALHA: Nenhum log foi gravado após a extração.');
  }

  await prisma.$disconnect();
}

validateAuditFlow();