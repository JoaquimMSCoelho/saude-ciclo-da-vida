export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'PACIENTE' | 'FAMILIAR' | 'PROFISSIONAL';
  photoUrl?: string;
}