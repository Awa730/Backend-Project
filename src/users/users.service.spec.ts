import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(nom: string, email: string, motDePasse: string, role?: Role): Promise<User> {
    const existant = await this.usersRepository.findOne({ where: { email } });
    if (existant) throw new ConflictException('Cet email est déjà utilisé');

    const hash = await bcrypt.hash(motDePasse, 10);
    const user = this.usersRepository.create({
      nom,
      email,
      motDePasse: hash,
      role: role || Role.CLIENT,
    });
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Utilisateur #${id} introuvable`);
    return user;
  }

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

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }
}