// ARQUIVO: src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Buscar o usuário no banco pelo email
    const user = await this.usersService.findByEmail(loginDto.email);

    // 2. Se não achar o usuário, nega o acesso
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // 3. Verificar a senha (Simples por enquanto)
    // ATENÇÃO: Em breve usaremos criptografia (Bcrypt) aqui.
    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // 4. Se chegou aqui, deu tudo certo! Vamos gerar o Token.
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
}