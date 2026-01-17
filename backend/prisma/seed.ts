/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: DATA LAYER (Prisma Seeding)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: GÊNESE DE DADOS (SEED)
 * DESCRIÇÃO: Popula o banco com:
 * 1. Paciente (Seu João)
 * 2. Cuidadora (Maria)
 * 3. Vínculo de Cuidado
 * 4. Remédios, Alertas e Contatos de Emergência.
 * -------------------------------------------------------------------------
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 INICIANDO A GÊNESE DE DADOS...');

  // 1. Limpar dados antigos (opcional, mas bom para testes)
  // Deletamos na ordem reversa para não quebrar relacionamentos
  await prisma.panicAlert.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.careRelationship.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Banco limpo com sucesso.');

  // 2. CRIAR A CUIDADORA (MARIA)
  const maria = await prisma.user.create({
    data: {
      email: 'maria.filha@email.com',
      password: 'hash_da_senha_123', // Em produção, usaríamos bcrypt
      name: 'Maria da Silva',
      role: 'FAMILIAR',
      photoUrl: 'https://i.pravatar.cc/150?u=maria',
    },
  });
  console.log(`👤 Cuidadora criada: ${maria.name}`);

  // 3. CRIAR O PACIENTE (SEU JOÃO)
  const joao = await prisma.user.create({
    data: {
      email: 'joao.pai@email.com',
      password: 'hash_da_senha_123',
      name: 'João da Silva',
      role: 'PACIENTE',
      photoUrl: 'https://i.pravatar.cc/150?u=joao',
      // Criar Perfil de Saúde junto
      profile: {
        create: {
          bloodType: 'O+',
          height: 175,
          weight: 80,
          chronicDiseases: 'Hipertensão, Diabetes Tipo 2',
          allergies: 'Dipirona',
          healthInsurance: 'Unimed Idoso - Plano Ouro',
        },
      },
      // Criar Contatos de Emergência
      emergencyContacts: {
        create: [
          { name: 'Maria (Filha)', phone: '11999998888', relationship: 'Filha', priority: 1 },
          { name: 'Dr. Carlos (Cardio)', phone: '11977776666', relationship: 'Médico', priority: 2 },
        ],
      },
    },
  });
  console.log(`👴 Paciente criado: ${joao.name}`);

  // 4. VINCULAR MARIA CUIDANDO DE JOÃO
  await prisma.careRelationship.create({
    data: {
      caregiverId: maria.id,
      patientId: joao.id,
      permissions: { canViewGPS: true, canEditMeds: true, canViewHistory: true },
      status: 'ACTIVE',
    },
  });
  console.log('🔗 Vínculo criado: Maria -> cuida de -> João');

  // 5. CADASTRAR UM REMÉDIO PARA O JOÃO
  await prisma.medication.create({
    data: {
      userId: joao.id,
      name: 'Losartana Potássica',
      dosage: '50mg',
      stockCurrent: 28,
      stockMin: 5,
      prescriptionExpires: new Date('2026-06-01T00:00:00Z'), // Vence em Junho
      schedules: {
        create: [
          { time: '08:00', frequency: 'Diário', instructions: 'Tomar após café' },
          { time: '20:00', frequency: 'Diário', instructions: 'Tomar antes de dormir' },
        ],
      },
    },
  });
  console.log('💊 Remédio cadastrado: Losartana');

  // 6. GERAR UM ALERTA DE PÂNICO (PARA A TORRE VER)
  await prisma.panicAlert.create({
    data: {
      userId: joao.id,
      latitude: -22.7, // Piracicaba simulada
      longitude: -47.6,
      resolved: false,
      batteryLevel: 15,
    },
  });
  console.log('🚨 Alerta de Pânico Simulado criado.');

  console.log('✅ GÊNESE CONCLUÍDA COM SUCESSO.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });