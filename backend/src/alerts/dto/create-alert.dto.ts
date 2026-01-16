// ARQUIVO: backend/src/alerts/dto/create-alert.dto.ts
export class CreateAlertDto {
  latitude: number;
  longitude: number;
  userId: string; // Precisamos saber QUEM está pedindo socorro
}