/*
-------------------------------------------------------------------------
MÓDULO: AUTH SERVICE
DESCRIÇÃO: Lógica de login e geração de Token JWT.
-------------------------------------------------------------------------
*/
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Função simples para testar (Login Fake)
  // Futuramente ligaremos ao Banco de Dados
  async validateUser(email: string, pass: string): Promise<any> {
    // SIMULAÇÃO: Se a senha for "123456", deixa passar.
    if (pass === '123456') {
      return { id: 'user-id-1', email: email, name: 'João da Silva' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), // Gera o código criptografado
      user: user
    };
  }
}