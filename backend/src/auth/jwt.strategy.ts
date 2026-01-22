/*
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
MÓDULO: JWT STRATEGY (O Porteiro)
DESCRIÇÃO: Valida o Token usando a chave fixa 'SEGREDOSUPREMO'.
STATUS: SINCRONIZADO (Correção Nuclear para erro 401)
-------------------------------------------------------------------------
*/
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Onde buscar o crachá? No cabeçalho "Authorization: Bearer ..."
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Aceita token vencido? Não.
      ignoreExpiration: false,
      
      // 3. A CHAVE MESTRA (SOLUÇÃO NUCLEAR)
      // Deve ser EXATAMENTE IGUAL à usada no AuthModule.
      secretOrKey: 'SEGREDOSUPREMO', 
    });
  }

  async validate(payload: any) {
    // Se a assinatura bater, o NestJS injeta isso em "req.user" nas rotas
    return { userId: payload.sub, email: payload.email };
  }
}