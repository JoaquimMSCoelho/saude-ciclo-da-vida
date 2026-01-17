/*
-------------------------------------------------------------------------
MÓDULO: AUTH MODULE (CONFIGURAÇÃO)
DESCRIÇÃO: Agrupa as ferramentas de segurança (Passport, JWT).
-------------------------------------------------------------------------
*/
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, jwtConstants } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }, // O token expira em 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Adicionamos a Strategy aqui
})
export class AuthModule {}