// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA
// ARQUIVO: user.entity.ts
// OBJETIVO: Entidade de Usuário (Corrigida e Integrada com Logs)
// -------------------------------------------------------------------------

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LocationLog } from '../../location/entities/location-log.entity';

@Entity('users')
export class User {
  // 1. Identificador Único
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 2. Dados Cadastrais
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // select: false protege a senha de ser retornada na API
  password: string;

  @Column({ default: 'IDOSO' })
  role: string;

  // 3. Auditoria
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // --- RELACIONAMENTOS (DEVEM FICAR DENTRO DA CLASSE) ---

  // Relação com Módulo 6 (Location Logs - Modo Guardião)
  @OneToMany(() => LocationLog, (log) => log.user)
  locationLogs: LocationLog[];
}