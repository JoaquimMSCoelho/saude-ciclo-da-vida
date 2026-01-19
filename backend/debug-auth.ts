// ARQUIVO: backend/debug-auth.ts
// EXECUÇÃO: npx ts-node debug-auth.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function diagnostico() {
  console.log('🕵️ INICIANDO DIAGNÓSTICO FORENSE DE LOGIN...\n');

  const targetEmail = 'joao.pai@email.com';
  const targetPass = '123456';

  // 1. VERIFICAR SE O USUÁRIO EXISTE
  console.log(`1. Buscando usuário: [${targetEmail}]`);
  const user = await prisma.user.findUnique({
    where: { email: targetEmail }
  });

  if (!user) {
    console.log('❌ FALHA FATAL: Usuário não encontrado no banco de dados.');
    console.log('   -> Solução: Rode "npx prisma db seed" novamente.');
    return;
  }
  console.log(`✅ Usuário encontrado: ${user.name} (ID: ${user.id})`);

  // 2. ANALISAR O HASH DA SENHA
  console.log(`\n2. Analisando Hash armazenado:`);
  console.log(`   -> Hash: ${user.password}`);
  
  if (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$')) {
    console.log('⚠️ ALERTA: O formato do hash parece estranho. Deveria começar com $2b$ ou $2a$.');
  }

  // 3. TESTAR COMPARAÇÃO REAL (BCRYPT)
  console.log(`\n3. Testando Bcrypt com a senha "${targetPass}":`);
  const isMatch = await bcrypt.compare(targetPass, user.password);

  if (isMatch) {
    console.log('✅ SUCESSO: A senha está correta e o hash é válido.');
    console.log('   -> CONCLUSÃO: O problema NÃO é o banco. O problema está na API ou no Controller.');
  } else {
    console.log('❌ FALHA: A senha não bate com o hash.');
    console.log('   -> CONCLUSÃO: O hash no banco está incorreto.');
    
    // 4. TENTATIVA DE CORREÇÃO AUTOMÁTICA
    console.log('\n🛠️ TENTANDO CORREÇÃO AUTOMÁTICA...');
    const newHash = await bcrypt.hash(targetPass, 10);
    await prisma.user.update({
      where: { email: targetEmail },
      data: { password: newHash }
    });
    console.log('✅ Senha resetada para "123456" com novo hash.');
    console.log('   -> Tente logar no App agora.');
  }
}

diagnostico()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());