import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ModePaiement,
  StatutReservation,
  TypeReservation,
} from '../reservation.entity';

export class CreateReservationDto {
  @ApiProperty({ enum: TypeReservation, example: TypeReservation.LOCATION })
  @IsEnum(TypeReservation)
  type: TypeReservation;

  @ApiProperty({ example: 1, description: 'ID du véhicule' })
  @IsNumber()
  vehiculeId: number;

  @ApiProperty({ example: 'Amadou Diallo' })
  @IsNotEmpty()
  @IsString()
  nomClient: string;

  @ApiProperty({ example: '+221 77 123 45 67' })
  @IsNotEmpty()
  @IsString()
  telephone: string;

  @ApiProperty({ example: 'amadou@gmail.com' })
  @IsEmail()
  email: string;

  // Location
  @ApiProperty({ example: '2025-07-01', required: false })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiProperty({ example: '2025-07-05', required: false })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  // Achat
  @ApiProperty({ example: 'Almadies, Dakar', required: false })
  @IsOptional()
  @IsString()
  adresse?: string;
}

export class UpdateStatutDto {
  @ApiProperty({ enum: StatutReservation })
  @IsEnum(StatutReservation)
  statut: StatutReservation;
}

export class ValiderPaiementDto {
  @ApiProperty({ enum: ModePaiement, example: ModePaiement.WAVE })
  @IsEnum(ModePaiement)
  modePaiement: ModePaiement;

  @ApiProperty({ example: 'MVA-TXN-LK3X2-AB12' })
  @IsNotEmpty()
  @IsString()
  numeroTransaction: string;
}
