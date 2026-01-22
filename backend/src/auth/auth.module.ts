// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUITETURA: MODULE LAYER
// -------------------------------------------------------------------------
// MÓDULO: AUTH MODULE
// DESCRIÇÃO: Registra login, tokens e dependências de banco.
// STATUS: CORRIGIDO (Chave 'Hardcoded' para eliminar erro 401)
// -------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // AQUI ESTÁ A SOLUÇÃO NUCLEAR:
    // Definimos a chave diretamente como string. 
    // Isso obriga o sistema a usar 'SEGREDOSUPREMO' para criar o token.
    JwtModule.register({
      secret: 'SEGREDOSUPREMO', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    PrismaService // Mantido para garantir acesso ao banco
  ],
  exports: [AuthService],
})
export class AuthModule {}