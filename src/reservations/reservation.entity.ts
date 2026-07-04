import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Vehicule } from '../vehicules/vehicule.entity';

export enum TypeReservation {
  LOCATION = 'location',
  ACHAT = 'achat',
}

export enum StatutReservation {
  EN_ATTENTE = 'En attente',
  CONFIRMEE = 'Confirmée',
  EN_COURS = 'En cours',
  TERMINEE = 'Terminée',
  ANNULEE = 'Annulée',
}

export enum ModePaiement {
  WAVE = 'wave',
  ORANGE_MONEY = 'orange-money',
  FREE_MONEY = 'free-money',
  CARTE = 'carte',
  VIREMENT = 'virement',
  ESPECES = 'especes',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  // Référence unique type MVA-00001
  @Column({ unique: true })
  reference: string;

  @Column({ type: 'enum', enum: TypeReservation })
  type: TypeReservation;

  @Column({
    type: 'enum',
    enum: StatutReservation,
    default: StatutReservation.EN_ATTENTE,
  })
  statut: StatutReservation;

  // Infos client au moment de la réservation (nom, tel, email dupliqués pour historique)
  @Column({ length: 150 })
  nomClient: string;

  @Column({ length: 20 })
  telephone: string;

  @Column()
  email: string;

  // Location uniquement
  @Column({ type: 'date', nullable: true })
  dateDebut: string;

  @Column({ type: 'date', nullable: true })
  dateFin: string;

  // Achat uniquement
  @Column({ type: 'text', nullable: true })
  adresse: string;

  // Prix unitaire (location = prix/jour, achat = prix total véhicule)
  @Column({ type: 'bigint' })
  prix: number;

  // Paiement
  @Column({ type: 'enum', enum: ModePaiement, nullable: true })
  modePaiement: ModePaiement;

  @Column({ nullable: true })
  numeroTransaction: string;

  @Column({ default: false })
  paiementValide: boolean;

  @Column({ nullable: true })
  dateValidation: string;

  @Column({ default: false })
  whatsappEnvoye: boolean;

  @ManyToOne(() => User, (u) => u.reservations, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @ManyToOne(() => Vehicule, (v) => v.reservations, { eager: true })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
