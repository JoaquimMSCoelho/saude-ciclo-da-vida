// -------------------------------------------------------------------------
// ARQUIVO: backend/src/auth/auth.service.ts
// OBJETIVO: Regras de negócio de Autenticação (Login + Cadastro + Recuperação + Reset)
// VERSÃO: FUSÃO FINAL (Ciclo Completo de Segurança)
// -------------------------------------------------------------------------

import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service'; // Mantido para diagnósticos
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  // ===========================================================================
  // 1. LÓGICA DE LOGIN (Mantendo seu diagnóstico robusto original)
  // ===========================================================================
  async validateUser(email: string, pass: string): Promise<any> {
    console.log('\n--- 🕵️ INÍCIO DO DIAGNÓSTICO DE LOGIN ---');
    console.log(`📥 Recebido do App: Email=[${email}] | Senha=[${pass}]`);

    // 1.1. CHECAGEM DE EXISTÊNCIA NO BANCO
    const allUsers = await this.prisma.user.findMany({ select: { email: true, name: true } });
    console.log(`📊 Total de Usuários no Banco: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('❌ O BANCO DE DADOS ESTÁ VAZIO!');
    } else {
      console.log('📋 Lista de Usuários:', allUsers.map(u => u.email).join(', '));
    }

    // 1.2. BUSCA ESPECÍFICA
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
    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  // ===========================================================================
  // 2. LÓGICA DE CADASTRO
  // ===========================================================================
  async register(data: RegisterDto) {
    try {
      console.log(`📝 Tentativa de Cadastro: ${data.email}`);

      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword
      });
      
      console.log(`✅ Usuário criado com sucesso: ${newUser.id}`);

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

  // ===========================================================================
  // 3. RECUPERAÇÃO DE SENHA (Envio de E-mail)
  // ===========================================================================
  async recoverPassword(email: string) {
    console.log(`📨 Iniciando recuperação para: ${email}`);
    
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      console.log('❌ E-mail não encontrado no banco.');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Se o e-mail existir, você receberá as instruções.' };
    }

    const payload = { email: user.email, sub: user.id, type: 'recovery' };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Link apontando para o Web Admin (Porta 3000)
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    try {
      const info = await this.mailerService.sendMail({
        to: user.email,
        subject: '🔐 Recuperação de Senha - Saúde Ciclo da Vida',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0891b2;">Saúde Ciclo da Vida</h2>
            <h3>Olá, ${user.name}</h3>
            <p>Recebemos um pedido para resetar sua senha.</p>
            <br/>
            <a href="${resetLink}" style="padding: 12px 24px; background-color: #0891b2; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">RESETAR MINHA SENHA</a>
            <br/><br/>
            <p style="font-size: 12px; color: #666;">Ou copie este link: ${resetLink}</p>
            <hr/>
            <p style="font-size: 12px; color: #999;">Se não foi você, ignore este e-mail. Sua conta continua segura.</p>
          </div>
        `,
      });

      console.log('✅ E-mail enviado via SMTP!');
      
      const previewUrl = require('nodemailer').getTestMessageUrl(info);
      console.log('🔗 LINK PARA LER O E-MAIL (CLIQUE AQUI):', previewUrl);

      return { message: 'E-mail de recuperação enviado!', previewUrl }; 

    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
      throw new BadRequestException('Erro ao enviar e-mail de recuperação.');
    }
  }

  // ===========================================================================
  // 4. DEFINIR NOVA SENHA (O Final do Ciclo)
  // ===========================================================================
  async resetPassword(token: string, newPass: string) {
    try {
      // 1. Validar e Ler o Token
      const payload = this.jwtService.verify(token); // Se expirou, dá erro aqui
      
      console.log(`🔄 Resetando senha para usuário ID: ${payload.sub}`);

      // 2. Criptografar a Nova Senha
      const hashedPassword = await bcrypt.hash(newPass, 10);

      // 3. Salvar no Banco
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });

      console.log('✅ Senha alterada com sucesso!');
      return { message: 'Senha atualizada com sucesso. Faça login novamente.' };

    } catch (error) {
      console.error('❌ Erro ao resetar senha:', error.message);
      throw new BadRequestException('Token inválido ou expirado. Solicite nova recuperação.');
    }
  }
}