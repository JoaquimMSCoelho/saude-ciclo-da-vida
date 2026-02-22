import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetAdmin() {
  console.log('--- 🛡️ INICIANDO RESET TÉCNICO DE SENHA ---');
  
  // 1. Gerar o Hash correto para a senha padrão
  const plainPassword = '@@748596Jmsc##';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  // 2. Atualizar no banco de dados
  const updated = await prisma.user.update({
    where: { email: 'admin@saudeciclodavida.com.br' },
    data: { password: hashedPassword }
  });

  console.log(`✅ Senha do usuário ${updated.email} sincronizada com sucesso!`);
  console.log(`🔒 Novo Hash: ${hashedPassword}`);
  
  await prisma.$disconnect();
}

resetAdmin().catch(e => {
  console.error('❌ Erro no reset:', e);
  process.exit(1);
});