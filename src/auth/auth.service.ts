import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../users/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Crée le super admin au démarrage
  async onModuleInit() {
    const adminExiste = await this.usersService.findByEmail('movia@automobile.com');
    if (!adminExiste) {
      await this.usersService.create(
        'Super Admin',
        'movia@automobile.com',
        'admin123',
        Role.ADMIN,
      );
      console.log('✅ Super Admin créé : movia@automobile.com / admin123');
    }
  }

  // Inscription
  async register(dto: RegisterDto) {
    const user = await this.usersService.create(
      dto.nom,
      dto.email,
      dto.motDePasse,
      dto.role,
    );

    const token = this.genererToken(user.id, user.email, user.role);

    return {
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Connexion
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const motDePasseValide = await bcrypt.compare(
      dto.password,
      user.motDePasse,
    );
    if (!motDePasseValide)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const token = this.genererToken(user.id, user.email, user.role);

    return {
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Promouvoir un client en admin
  async promouvoir(id: number) {
    const user = await this.usersService.findById(id);
    user.role = Role.ADMIN;
    await this.usersService.save(user);
    return {
      message: `${user.nom} est maintenant Admin`,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  }

  private genererToken(id: number, email: string, role: string) {
    return this.jwtService.sign({ id, email, role: String(role) });
  }
}
