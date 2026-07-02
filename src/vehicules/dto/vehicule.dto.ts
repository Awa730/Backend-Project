import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray, IsEnum, IsNotEmpty, IsNumber,
  IsOptional, IsString, Min,
} from 'class-validator';
import { Boite, Carburant, Categorie, StatutVehicule } from '../vehicule.entity';
import { PartialType } from '@nestjs/swagger';

export class CreateVehiculeDto {
  @ApiProperty({ example: 'BMW X3' })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({ enum: Categorie, example: Categorie.SUV })
  @IsEnum(Categorie)
  categorie: Categorie;

  @ApiProperty({ enum: Carburant, example: Carburant.DIESEL })
  @IsEnum(Carburant)
  carburant: Carburant;

  @ApiProperty({ enum: Boite, example: Boite.AUTOMATIQUE })
  @IsEnum(Boite)
  boite: Boite;

  @ApiProperty({ example: 2022 })
  @IsNumber()
  annee: number;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsNumber()
  places?: number;

  @ApiProperty({ example: '2.0L TwinPower', required: false })
  @IsOptional()
  @IsString()
  moteur?: string;

  @ApiProperty({ example: '230 km/h', required: false })
  @IsOptional()
  @IsString()
  vitesseMax?: string;

  @ApiProperty({ example: '190 ch', required: false })
  @IsOptional()
  @IsString()
  puissance?: string;

  @ApiProperty({ example: '8,0 s', required: false })
  @IsOptional()
  @IsString()
  acceleration?: string;

  @ApiProperty({ example: 'Voyage, famille', required: false })
  @IsOptional()
  @IsString()
  usageIdeal?: string;

  @ApiProperty({ example: 65000, description: 'Prix location en FCFA/jour' })
  @IsNumber()
  @Min(0)
  prixLocation: number;

  @ApiProperty({ example: 22000000, description: 'Prix achat en FCFA' })
  @IsNumber()
  @Min(0)
  prixAchat: number;

  @ApiProperty({ example: '/images/BMW X3.jpeg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ enum: StatutVehicule, default: StatutVehicule.DISPONIBLE })
  @IsOptional()
  @IsEnum(StatutVehicule)
  statut?: StatutVehicule;

  @ApiProperty({ example: ['Confort premium', 'Tenue de route'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pointsForts?: string[];
}

export class UpdateVehiculeDto extends PartialType(CreateVehiculeDto) {}
