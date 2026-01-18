/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: DATA LAYER (Prisma Seeding)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: GÊNESE DE DADOS (SEED)
 * DESCRIÇÃO: Popula o banco com dados reais e senhas criptografadas (Bcrypt)
 * 1. Paciente (Seu João)
 * 2. Cuidadora (Maria)
 * 3. Vínculo de Cuidado
 * 4. Remédios, Alertas e Contatos de Emergência.
 * -------------------------------------------------------------------------
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 INICIANDO A GÊNESE DE DADOS...');

  // 1. Limpar dados antigos (Ordem reversa para integridade referencial)
  await prisma.panicAlert.deleteMany();
  await prisma.intakeLog.deleteMany();
  await prisma.medicationSchedule.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.careRelationship.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Banco limpo com sucesso.');

  // 2. GERAR HASH DE SENHA (PADRÃO 123456)
  // Essencial para que o AuthService consiga validar o login
  const saltRounds = 10;
  const commonPasswordHash = await bcrypt.hash('123456', saltRounds);

  // 3. CRIAR A CUIDADORA (MARIA)
  const maria = await prisma.user.create({
    data: {
      email: 'maria.filha@email.com',
      password: commonPasswordHash, // Senha real criptografada
      name: 'Maria da Silva',
      role: 'FAMILIAR',
      photoUrl: 'https://i.pravatar.cc/150?u=maria',
    },
  });
  console.log(`👤 Cuidadora criada: ${maria.name}`);

  // 4. CRIAR O PACIENTE (SEU JOÃO)
  const joao = await prisma.user.create({
    data: {
      email: 'joao.pai@email.com',
      password: commonPasswordHash, // Senha real criptografada
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

  // 5. VINCULAR MARIA CUIDANDO DE JOÃO
  await prisma.careRelationship.create({
    data: {
      caregiverId: maria.id,
      patientId: joao.id,
      permissions: { canViewGPS: true, canEditMeds: true, canViewHistory: true },
      status: 'ACTIVE',
    },
  });
  console.log('🔗 Vínculo criado: Maria -> cuida de -> João');

  // 6. CADASTRAR UM REMÉDIO PARA O JOÃO
  await prisma.medication.create({
    data: {
      userId: joao.id,
      name: 'Losartana Potássica',
      dosage: '50mg',
      stockCurrent: 28,
      stockMin: 5,
      prescriptionExpires: new Date('2026-06-01T00:00:00Z'),
      schedules: {
        create: [
          { time: '08:00', frequency: 'Diário', instructions: 'Tomar após café' },
          { time: '20:00', frequency: 'Diário', instructions: 'Tomar antes de dormir' },
        ],
      },
    },
  });
  console.log('💊 Remédio cadastrado: Losartana');

  // 7. GERAR UM ALERTA DE PÂNICO (PARA A TORRE VER)
  await prisma.panicAlert.create({
    data: {
      userId: joao.id,
      latitude: -22.7, 
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