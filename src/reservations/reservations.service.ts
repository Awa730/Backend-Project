import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Reservation,
  StatutReservation,
  TypeReservation,
} from './reservation.entity';
import { StatutVehicule } from '../vehicules/vehicule.entity';
import {
  CreateReservationDto,
  UpdateStatutDto,
  ValiderPaiementDto,
} from './dto/reservation.dto';
import { VehiculesService } from '../vehicules/vehicules.service';
import { User } from '../users/users.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private repo: Repository<Reservation>,
    private vehiculesService: VehiculesService,
  ) {}

  private genReference(): string {
    const n = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, '0');
    return `MVA-${n}`;
  }

  private calcMontant(reservation: Reservation): number {
    if (reservation.type === TypeReservation.LOCATION) {
      if (!reservation.dateDebut || !reservation.dateFin)
        return reservation.prix;
      const diff = Math.ceil(
        (new Date(reservation.dateFin).getTime() -
          new Date(reservation.dateDebut).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return reservation.prix * (diff > 0 ? diff : 1);
    }
    return reservation.prix;
  }

  async create(dto: CreateReservationDto, user?: User): Promise<Reservation> {
    const vehicule = await this.vehiculesService.findOne(dto.vehiculeId);

    if (vehicule.statut === StatutVehicule.INDISPONIBLE) {
      throw new BadRequestException('Ce véhicule est indisponible');
    }

    // Validation métier
    if (dto.type === TypeReservation.LOCATION) {
      if (!dto.dateDebut || !dto.dateFin)
        throw new BadRequestException(
          'dateDebut et dateFin sont requis pour une location',
        );
      if (new Date(dto.dateFin) <= new Date(dto.dateDebut))
        throw new BadRequestException(
          'La date de fin doit être après la date de début',
        );
    }
    if (dto.type === TypeReservation.ACHAT && !dto.adresse) {
      throw new BadRequestException(
        "L'adresse de livraison est requise pour un achat",
      );
    }

    const prix =
      dto.type === TypeReservation.LOCATION
        ? vehicule.prixLocation
        : vehicule.prixAchat;

    // Passer le véhicule en "limité" si c'est un achat
    if (dto.type === TypeReservation.ACHAT) {
      await this.vehiculesService.update(vehicule.id, {
        statut: StatutVehicule.LIMITE,
      });
    }

    const reservation = this.repo.create({
      reference: this.genReference(),
      type: dto.type,
      nomClient: dto.nomClient,
      telephone: dto.telephone,
      email: dto.email,
      dateDebut: dto.dateDebut,
      dateFin: dto.dateFin,
      adresse: dto.adresse,
      prix,
      vehicule,
      user: user ?? undefined,
    });

    return this.repo.save(reservation);
  }

  // Admin : toutes les réservations
  async findAll(
    statut?: StatutReservation,
    type?: TypeReservation,
  ): Promise<Reservation[]> {
    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.vehicule', 'v')
      .leftJoinAndSelect('r.user', 'u')
      .orderBy('r.createdAt', 'DESC');

    if (statut) qb.andWhere('r.statut = :statut', { statut });
    if (type) qb.andWhere('r.type = :type', { type });

    return qb.getMany();
  }

  // Client : ses propres réservations
  async findMine(userId: number): Promise<Reservation[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const r = await this.repo.findOne({
      where: { id },
      relations: { vehicule: true, user: true },
    });
    if (!r) throw new NotFoundException(`Réservation #${id} introuvable`);
    return r;
  }

  // Admin : changer le statut (Confirmée, En cours, Terminée, Annulée)
  async updateStatut(id: number, dto: UpdateStatutDto): Promise<Reservation> {
    const r = await this.findOne(id);
    r.statut = dto.statut;

    // Si annulée → libérer le véhicule
    if (dto.statut === StatutReservation.ANNULEE) {
      await this.vehiculesService.update(r.vehicule.id, {
        statut: StatutVehicule.DISPONIBLE,
      });
    }
    // Si terminée (location) → libérer le véhicule
    if (
      dto.statut === StatutReservation.TERMINEE &&
      r.type === TypeReservation.LOCATION
    ) {
      await this.vehiculesService.update(r.vehicule.id, {
        statut: StatutVehicule.DISPONIBLE,
      });
    }
    // Si terminée (achat) → marquer indisponible
    if (
      dto.statut === StatutReservation.TERMINEE &&
      r.type === TypeReservation.ACHAT
    ) {
      await this.vehiculesService.update(r.vehicule.id, {
        statut: StatutVehicule.INDISPONIBLE,
      });
    }

    return this.repo.save(r);
  }

  // Client : valider son paiement (Wave, Orange Money, etc.)
  async validerPaiement(
    id: number,
    dto: ValiderPaiementDto,
  ): Promise<Reservation> {
    const r = await this.findOne(id);
    r.modePaiement = dto.modePaiement;
    r.numeroTransaction = dto.numeroTransaction;
    r.paiementValide = true;
    r.dateValidation = new Date().toISOString().split('T')[0];
    return this.repo.save(r);
  }

  // Admin : marquer le WhatsApp comme envoyé
  async marquerWhatsapp(id: number): Promise<Reservation> {
    const r = await this.findOne(id);
    r.whatsappEnvoye = true;
    return this.repo.save(r);
  }

  async remove(id: number): Promise<{ message: string }> {
    const r = await this.findOne(id);
    await this.repo.remove(r);
    return { message: `Réservation #${id} supprimée` };
  }

  // Statistiques pour le dashboard admin
  async getStats() {
    const total = await this.repo.count();
    const enAttente = await this.repo.count({
      where: { statut: StatutReservation.EN_ATTENTE },
    });
    const confirmees = await this.repo.count({
      where: { statut: StatutReservation.CONFIRMEE },
    });
    const enCours = await this.repo.count({
      where: { statut: StatutReservation.EN_COURS },
    });
    const terminees = await this.repo.count({
      where: { statut: StatutReservation.TERMINEE },
    });
    const annulees = await this.repo.count({
      where: { statut: StatutReservation.ANNULEE },
    });
    const locations = await this.repo.count({
      where: { type: TypeReservation.LOCATION },
    });
    const achats = await this.repo.count({
      where: { type: TypeReservation.ACHAT },
    });

    return {
      total,
      enAttente,
      confirmees,
      enCours,
      terminees,
      annulees,
      locations,
      achats,
    };
  }
}
