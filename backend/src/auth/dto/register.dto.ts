// -------------------------------------------------------------------------
// ARQUIVO: backend/src/auth/dto/register.dto.ts
// OBJETIVO: Validar os dados que chegam do App para Cadastro
// -------------------------------------------------------------------------
export class RegisterDto {
  name: string;
  email: string;
  password: string;
}