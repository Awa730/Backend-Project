import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Marque et modèle du véhicule',
    example: 'Tesla Model Y',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du véhicule est obligatoire.' })
  name!: string;

  @ApiProperty({ description: 'Prix de location par jour', example: 120 })
  @IsNumber()
  @Min(0, { message: 'Le prix ne peut pas être négatif.' })
  price!: number;

  @ApiProperty({
    description: 'Catégorie du véhicule',
    example: 'Électrique',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}
