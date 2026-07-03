import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

export enum Role {
  ADMIN = 'admin',
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

  @OneToMany(() => Reservation, (r) => r.user)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;
}
