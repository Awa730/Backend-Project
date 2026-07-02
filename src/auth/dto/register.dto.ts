import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../users/users.entity';

export class RegisterDto {
  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  motDePasse: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}