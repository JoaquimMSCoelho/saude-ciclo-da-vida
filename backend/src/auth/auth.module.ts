/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Module Layer)
 * -------------------------------------------------------------------------
 * MÓDULO: AUTH MODULE
 * DESCRIÇÃO: Gerencia Login e Tokens JWT.
 * -------------------------------------------------------------------------
 */

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importando o vizinho
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule, // <--- CRÍTICO: Traz o UsersService para cá
    PassportModule,
    JwtModule.register({
      secret: 'segredo_super_secreto_dev', // Em produção usamos variáveis de ambiente (.env)
      signOptions: { expiresIn: '1d' },    // Token dura 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}