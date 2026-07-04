import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Vehicule,
  Boite,
  Carburant,
  Categorie,
  StatutVehicule,
} from './vehicule.entity';
import { CreateVehiculeDto, UpdateVehiculeDto } from './dto/vehicule.dto';

@Injectable()
export class VehiculesService implements OnModuleInit {
  constructor(
    @InjectRepository(Vehicule)
    private repo: Repository<Vehicule>,
  ) {}

  // Pré-charge les véhicules du frontend React au démarrage
  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) await this.seedVehicules();
  }

  async create(dto: CreateVehiculeDto): Promise<Vehicule> {
    const v = this.repo.create(dto);
    return this.repo.save(v);
  }

  async findAll(statut?: StatutVehicule): Promise<Vehicule[]> {
    const where = statut ? { statut } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Vehicule> {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException(`Véhicule #${id} introuvable`);
    return v;
  }

  async update(id: number, dto: UpdateVehiculeDto): Promise<Vehicule> {
    const v = await this.findOne(id);
    Object.assign(v, dto);
    return this.repo.save(v);
  }

  async remove(id: number): Promise<{ message: string }> {
    const v = await this.findOne(id);
    await this.repo.remove(v);
    return { message: `Véhicule #${id} supprimé` };
  }

  // Données initiales tirées directement de VehiculesSection.tsx
  private async seedVehicules() {
    const data = [
      {
        nom: 'BMW X3',
        categorie: Categorie.SUV,
        carburant: Carburant.DIESEL,
        boite: Boite.AUTOMATIQUE,
        annee: 2022,
        places: 5,
        moteur: '2.0L TwinPower',
        vitesseMax: '230 km/h',
        puissance: '190 ch',
        acceleration: '8,0 s',
        usageIdeal: 'Voyage, famille et rendez-vous pro',
        pointsForts: ['Confort premium', 'Tenue de route', 'Grand coffre'],
        prixLocation: 65000,
        prixAchat: 22000000,
        image: '/images/BMW X3.jpeg',
        statut: StatutVehicule.DISPONIBLE,
      },
      {
        nom: 'Haval H6',
        categorie: Categorie.SUV,
        carburant: Carburant.ESSENCE,
        boite: Boite.AUTOMATIQUE,
        annee: 2023,
        places: 5,
        moteur: '1.5L Turbo',
        vitesseMax: '180 km/h',
        puissance: '150 ch',
        acceleration: '9,8 s',
        usageIdeal: 'Déplacements urbains et longs trajets',
        pointsForts: ['Très spacieux', 'Caméra 360', 'Bon rapport prix'],
        prixLocation: 40000,
        prixAchat: 15000000,
        image: '/images/Haval H6.jpeg',
        statut: StatutVehicule.DISPONIBLE,
      },
      {
        nom: 'Mercedes GLE Coupé',
        categorie: Categorie.LUXE,
        carburant: Carburant.DIESEL,
        boite: Boite.AUTOMATIQUE,
        annee: 2021,
        places: 5,
        moteur: '3.0L 6 cylindres',
        vitesseMax: '250 km/h',
        puissance: '330 ch',
        acceleration: '5,7 s',
        usageIdeal: 'Événements, business et confort haut de gamme',
        pointsForts: ['Intérieur luxe', 'Puissance', 'Silhouette coupé'],
        prixLocation: 150000,
        prixAchat: 55000000,
        image: '/images/Mercedes GLE coupé.jpeg',
        statut: StatutVehicule.DISPONIBLE,
      },
      {
        nom: 'Ferrari 488',
        categorie: Categorie.SUPERCAR,
        carburant: Carburant.ESSENCE,
        boite: Boite.AUTOMATIQUE,
        annee: 2020,
        places: 2,
        moteur: '3.9L V8 Biturbo',
        vitesseMax: '330 km/h',
        puissance: '660 ch',
        acceleration: '3,0 s',
        usageIdeal: 'Expérience de conduite extrême',
        pointsForts: ['Performances extrêmes', 'Design iconique', 'Son V8'],
        prixLocation: 350000,
        prixAchat: 120000000,
        image: '/images/Ferrari.jpg',
        statut: StatutVehicule.LIMITE,
      },
      {
        nom: 'Peugeot 3008',
        categorie: Categorie.SUV,
        carburant: Carburant.DIESEL,
        boite: Boite.AUTOMATIQUE,
        annee: 2023,
        places: 5,
        moteur: '1.5L BlueHDi',
        vitesseMax: '190 km/h',
        puissance: '130 ch',
        acceleration: '10,1 s',
        usageIdeal: 'Famille et trajets quotidiens',
        pointsForts: ['Habitacle premium', 'Faible conso', 'Technologie'],
        prixLocation: 45000,
        prixAchat: 16000000,
        image: '/images/Peugeot 3008.jpeg',
        statut: StatutVehicule.DISPONIBLE,
      },
      {
        nom: 'Hyundai Creta',
        categorie: Categorie.SUV,
        carburant: Carburant.ESSENCE,
        boite: Boite.AUTOMATIQUE,
        annee: 2022,
        places: 5,
        moteur: '1.4L MPi',
        vitesseMax: '175 km/h',
        puissance: '100 ch',
        acceleration: '12,3 s',
        usageIdeal: 'Ville et routes secondaires',
        pointsForts: ['Économique', 'Fiable', 'Garantie étendue'],
        prixLocation: 35000,
        prixAchat: 12000000,
        image: '/images/Hyundai Creta.jpeg',
        statut: StatutVehicule.DISPONIBLE,
      },
      {
        nom: 'Hyundai Santa Fe',
        categorie: Categorie.SUV,
        carburant: Carburant.DIESEL,
        boite: Boite.AUTOMATIQUE,
        annee: 2022,
        places: 7,
        moteur: '2.2L CRDi',
        vitesseMax: '195 km/h',
        puissance: '200 ch',
        acceleration: '9,0 s',
        usageIdeal: 'Grandes familles et longs voyages',
        pointsForts: ['7 places', 'Traction intégrale', 'Espace'],
        prixLocation: 50000,
        prixAchat: 20000000,
        image: '/images/Hyundai Santa Fe.jpeg',
        statut: StatutVehicule.DISPONIBLE,
      },
    ];
    await this.repo.save(data.map((d) => this.repo.create(d)));
    console.log('✅  Véhicules initiaux chargés (7 véhicules)');
  }
}
