import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Créer un utilisateur
  async create(nom: string, email: string, motDePasse: string,role?:Role): Promise<User> {
    // Vérifie si l'email existe déjà
    const existant = await this.usersRepository.findOne({ where: { email } });
    if (existant) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hash le mot de passe
    const hash = await bcrypt.hash(motDePasse, 10);

    // Crée l'utilisateur
    const user = this.usersRepository.create({
      nom,
      email,
      motDePasse: hash,
    });

    return await this.usersRepository.save(user);
  }

  // Trouver par email
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // Trouver par id
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Utilisateur #${id} introuvable`);
    return user;
  }

  // Lister tous les utilisateurs (Admin)
  async findAll(): Promise<Partial<User>[]> {
  return await this.usersRepository.find({
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      createdAt: true,
    },
     });

  }  

  // Sauvegarder un utilisateur
  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }
}