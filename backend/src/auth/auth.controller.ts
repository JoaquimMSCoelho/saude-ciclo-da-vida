/*
-------------------------------------------------------------------------
MÓDULO: AUTH CONTROLLER (A PORTARIA)
DESCRIÇÃO: Recebe os pedidos de login e cadastro vindos do App.
ROTAS: 
  - POST /auth/login    (Entrada)
  - POST /auth/register (Novos Moradores)
-------------------------------------------------------------------------
*/
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto'; // Importação essencial para validar os dados

@Controller('auth')
export class AuthController {
  // Nota: Não precisamos injetar UsersService aqui, pois o AuthService já cuida disso.
  constructor(private authService: AuthService) {}

  // ===========================================================================
  // ROTA 1: LOGIN (Entrada de Usuários Existentes)
  // ===========================================================================
  @Post('login')
  async login(@Body() body: any) {
    // 1. O App manda e-mail e senha para validação
    const user = await this.authService.validateUser(body.email, body.password);
    
    // 2. Se a senha estiver errada, a porta não abre
    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas (E-mail ou senha incorretos)');
    }

    // 3. Se estiver certa, entrega o Token (Crachá Digital)
    return this.authService.login(user);
  }

  // ===========================================================================
  // ROTA 2: REGISTER (Cadastro de Novos Usuários)
  // ===========================================================================
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // 1. Recebe Nome, Email e Senha do App
    // 2. Repassa para o AuthService criar a conta e gerar o token inicial
    return this.authService.register(registerDto);
  }
}