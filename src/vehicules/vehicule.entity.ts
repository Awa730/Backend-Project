import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

export enum StatutVehicule {
  DISPONIBLE = 'available',
  LIMITE = 'limited',
  INDISPONIBLE = 'unavailable',
}

export enum Carburant {
  ESSENCE = 'Essence',
  DIESEL = 'Diesel',
  ELECTRIQUE = 'Électrique',
  HYBRIDE = 'Hybride',
}

export enum Boite {
  MANUELLE = 'Manuelle',
  AUTOMATIQUE = 'Automatique',
}

export enum Categorie {
  SUV = 'SUV',
  BERLINE = 'Berline',
  LUXE = 'Luxe',
  SPORT = 'Sport',
  SUPERCAR = 'Supercar',
  UTILITAIRE = 'Utilitaire',
  CITADINE = 'Citadine',
}

@Entity('vehicules')
export class Vehicule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nom: string;

  @Column({ type: 'enum', enum: Categorie })
  categorie: Categorie;

  @Column({ type: 'enum', enum: Carburant })
  carburant: Carburant;

  @Column({ type: 'enum', enum: Boite })
  boite: Boite;

  @Column()
  annee: number;

  @Column({ default: 5 })
  places: number;

  // Specs techniques (comme dans VehiculesSection.tsx)
  @Column({ nullable: true, length: 50 })
  moteur: string;

  @Column({ nullable: true, length: 50 })
  vitesseMax: string;

  @Column({ nullable: true, length: 50 })
  puissance: string;

  @Column({ nullable: true, length: 50 })
  acceleration: string;

  @Column({ nullable: true, type: 'text' })
  usageIdeal: string;

  // Prix location (FCFA/jour) et achat
  @Column({ type: 'bigint', default: 0 })
  prixLocation: number;

  @Column({ type: 'bigint', default: 0 })
  prixAchat: number;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: StatutVehicule,
    default: StatutVehicule.DISPONIBLE,
  })
  statut: StatutVehicule;

  @Column({ type: 'simple-array', nullable: true })
  pointsForts: string[];

  @OneToMany(() => Reservation, (r) => r.vehicule)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
