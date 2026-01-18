/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: SECURITY LAYER (NestJS + Passport + JWT)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: AUTH SERVICE
 * DESCRIÇÃO: Gerencia a validação de credenciais e emissão de tokens JWT.
 * Realiza a comparação de hashes via Bcrypt para segurança de dados.
 * -------------------------------------------------------------------------
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida se o usuário existe e se a senha é compatível com o hash do banco.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // 1. Busca o usuário no Banco de Dados via Prisma (UsersService)
    const user = await this.usersService.findByEmail(email);
    
    // 2. Se o usuário não existir, retornamos null (o Passport cuidará do 401)
    if (!user) {
      return null;
    }

    // 3. Comparação de Hash: Bcrypt.compare(Senha_Plana, Senha_Criptografada)
    // Importante: O seed deve ter usado bcrypt.hash('123456', 10)
    const isMatch = await bcrypt.compare(pass, user.password);
    
    if (isMatch) {
      // 4. Segurança: Removemos o campo 'password' do objeto antes de prosseguir
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  /**
   * Gera o token de acesso (JWT) após a validação bem-sucedida.
   */
  async login(user: any) {
    // Definimos o que vai dentro do "payload" do token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl
      }
    };
  }
}