/*
-------------------------------------------------------------------------
MÓDULO: AUTH CONTROLLER (A PORTARIA)
DESCRIÇÃO: Recebe os pedidos de login, cadastro e gestão de senhas.
ROTAS: 
  - POST /auth/login            (Entrada)
  - POST /auth/register         (Novos Moradores)
  - POST /auth/forgot-password  (Solicitar Link de Recuperação)
  - POST /auth/reset-password   (Definir Nova Senha)
-------------------------------------------------------------------------
*/
import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  // O AuthService é o nosso Gerente de Segurança
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

  // ===========================================================================
  // ROTA 3: FORGOT PASSWORD (Solicitar Recuperação)
  // ===========================================================================
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    // 1. Validação básica: O e-mail veio?
    if (!body.email) {
      throw new BadRequestException('O campo e-mail é obrigatório para recuperação.');
    }

    // 2. Aciona o serviço de envio de e-mail (Via Ethereal/SMTP)
    return this.authService.recoverPassword(body.email);
  }

  // ===========================================================================
  // ROTA 4: RESET PASSWORD (Efetivar Troca de Senha) -> FINAL DO CICLO
  // ===========================================================================
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPass: string }) {
    // 1. Validação de segurança dos dados recebidos
    if (!body.token || !body.newPass) {
      throw new BadRequestException('Token e Nova Senha são obrigatórios.');
    }

    // 2. Processa a troca no banco de dados
    return this.authService.resetPassword(body.token, body.newPass);
  }
}