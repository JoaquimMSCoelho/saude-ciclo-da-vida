// -------------------------------------------------------------------------
// ARQUIVO: backend/prisma/seed.ts
// OBJETIVO: Popular o banco com dados iniciais (Admin + Dados de Teste)
// STATUS: CORRIGIDO (Compatível com Schema Enterprise)
// -------------------------------------------------------------------------

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed do Banco de Dados...');

  // 1. Limpeza (Ordem importa por causa das chaves estrangeiras)
  // Apagamos primeiro os filhos, depois os pais.
  await prisma.intakeLog.deleteMany();
  await prisma.medicationSchedule.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.panicAlert.deleteMany();
  await prisma.careRelationship.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Banco limpo com sucesso.');

  // 2. Criar Senha Hash Padrão (123456)
  const password = await bcrypt.hash('123456', 10);

  // 3. Criar Usuário ADMIN (Para o Web Admin)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@saudeciclodavida.com.br',
      name: 'Administrador Sistema',
      password: password,
      role: 'ADMIN',
      photoUrl: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
      profile: {
        create: {
          bloodType: 'O+',
          obs: 'Super Usuário',
        },
      },
    },
  });
  console.log(`👤 Admin criado: ${admin.email}`);

  // 4. Criar Usuário PACIENTE (Dona Maria - Para o App Mobile)
  const paciente = await prisma.user.create({
    data: {
      email: 'maria@teste.com',
      name: 'Maria da Silva',
      password: password,
      role: 'PACIENTE',
      photoUrl: 'https://ui-avatars.com/api/?name=Maria+Silva&background=random',
      emergencyContacts: {
        create: [
          { name: 'João (Filho)', phone: '11999999999', relationship: 'Filho', priority: 1 },
        ],
      },
    },
  });
  console.log(`👤 Paciente criado: ${paciente.email}`);

  // 5. Criar Medicamento para Dona Maria
  // CORREÇÃO TÉCNICA: 'instructions' agora fica aqui no Medication, não no Schedule
  const remedio = await prisma.medication.create({
    data: {
      userId: paciente.id,
      name: 'Losartana Potássica',
      dosage: '50mg',
      type: 'pill', 
      instructions: 'Tomar com água, preferencialmente após o café da manhã.', // <--- CAMPO CORRETO
      stockCurrent: 30,
      stockMin: 5,
      schedules: {
        create: [
          { time: '08:00', frequency: 'Diário' }, // Sem instructions aqui
          { time: '20:00', frequency: 'Diário' }
        ],
      },
    },
  });
  console.log(`💊 Medicamento criado: ${remedio.name}`);

  // 6. Criar um Alerta de Pânico (Para testar o Dashboard Web)
  await prisma.panicAlert.create({
    data: {
      userId: paciente.id,
      latitude: -23.55052,
      longitude: -46.633308,
      batteryLevel: 15,
      resolved: false,
    },
  });
  console.log('🚨 Alerta de Pânico de teste criado.');

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });