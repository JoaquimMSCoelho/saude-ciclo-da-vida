/*
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
MÓDULO: JWT STRATEGY
DESCRIÇÃO: Valida o Token (Crachá) do usuário.
-------------------------------------------------------------------------
*/
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export const jwtConstants = {
  secret: 'CHAVE_ULTRA_SECRETA_DO_JOAO', // Em produção, use .env
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}