// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUITETURA: MODULE LAYER
// -------------------------------------------------------------------------
// MÓDULO: AUTH MODULE
// DESCRIÇÃO: Registra as dependências necessárias para o Login.
// -------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service'; // <--- IMPORTANTE: Importar o Prisma

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'segredo_padrao_dev',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    PrismaService // <--- A CORREÇÃO: O Auth precisa conhecer o Prisma para fazer o Auto-Repair
  ],
  exports: [AuthService],
})
export class AuthModule {}