/*
-------------------------------------------------------------------------
MÓDULO: AUTH CONTROLLER (A PORTARIA)
DESCRIÇÃO: Recebe os pedidos de login vindos do App e entrega o Crachá.
ROTA: POST /auth/login
-------------------------------------------------------------------------
*/
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // 1. O App manda e-mail e senha
    const user = await this.authService.validateUser(body.email, body.password);
    
    // 2. Se a senha estiver errada, bloqueia na hora
    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas (Senha errada?)');
    }

    // 3. Se estiver certa, gera o Token (Crachá Digital)
    return this.authService.login(user);
  }
}