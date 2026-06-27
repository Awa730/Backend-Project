import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum Role {
  ADMIN  = 'admin',
  CLIENT = 'client',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  motDePasse: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}