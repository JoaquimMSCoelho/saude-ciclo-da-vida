// -------------------------------------------------------------------------
// ARQUIVO: backend/src/auth/auth.service.ts
// OBJETIVO: Regras de negócio de Autenticação (Login + Cadastro)
// VERSÃO: FUSÃO (Diagnóstico Avançado + Cadastro Novo)
// -------------------------------------------------------------------------

import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service'; // Mantido para seus logs de diagnóstico
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // ===========================================================================
  // 1. LÓGICA DE LOGIN (Mantendo seu diagnóstico robusto)
  // ===========================================================================
  async validateUser(email: string, pass: string): Promise<any> {
    console.log('\n--- 🕵️ INÍCIO DO DIAGNÓSTICO DE LOGIN ---');
    console.log(`📥 Recebido do App: Email=[${email}] | Senha=[${pass}]`);

    // 1.1. CHECAGEM DE EXISTÊNCIA NO BANCO (Seu código original)
    const allUsers = await this.prisma.user.findMany({ select: { email: true, name: true } });
    console.log(`📊 Total de Usuários no Banco: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('❌ O BANCO DE DADOS ESTÁ VAZIO!');
    } else {
      console.log('📋 Lista de Usuários:', allUsers.map(u => u.email).join(', '));
    }

    // 1.2. BUSCA ESPECÍFICA (Usando o método correto findByEmail)
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log(`❌ Usuário [${email}] NÃO ENCONTRADO.`);
      console.log('--- FIM DO DIAGNÓSTICO ---\n');
      return null;
    }

    console.log(`✅ Usuário encontrado: ${user.name} (ID: ${user.id})`);

    // 1.3. REGRA DA "CHAVE MESTRA" (Login Garantido)
    if (String(pass) === '123456') {
      console.log('🔓 CHAVE MESTRA ACIONADA: Login Liberado.');
      
      // Auto-correção de hash para facilitar testes futuros
      if (!user.password.startsWith('$2b$')) {
        console.log('🛠️ Atualizando senha antiga para Hash Bcrypt...');
        const newHash = await bcrypt.hash('123456', 10);
        await this.prisma.user.update({ where: { id: user.id }, data: { password: newHash } });
      }

      const { password, ...result } = user;
      return result;
    }

    // 1.4. COMPARAÇÃO SEGURA (Bcrypt)
    const isMatch = await bcrypt.compare(String(pass), user.password);
    console.log(`⚖️ Comparação de Senha: ${isMatch ? 'SUCESSO' : 'FALHA'}`);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    // Mantendo seu payload rico (com nome e role)
    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  // ===========================================================================
  // 2. LÓGICA DE CADASTRO (A Peça que Faltava)
  // ===========================================================================
  async register(data: RegisterDto) {
    try {
      console.log(`📝 Tentativa de Cadastro: ${data.email}`);

      // IMPORTANTE: Hash da senha antes de salvar
      // Isso garante que o login funcione com bcrypt depois
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Cria o usuário usando o service (passando a senha já hasheada)
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword
      });
      
      console.log(`✅ Usuário criado com sucesso: ${newUser.id}`);

      // Gera token para login automático
      const payload = { email: newUser.email, sub: newUser.id, name: newUser.name };
      
      return {
        message: 'Cadastro realizado com sucesso',
        user: newUser,
        access_token: this.jwtService.sign(payload)
      };

    } catch (error) {
      console.error(`❌ Erro no Cadastro: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}