import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateStatutDto,
  ValiderPaiementDto,
} from './dto/reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entity';
import { StatutReservation, TypeReservation } from './reservation.entity';

@ApiTags('📋 Réservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // ── CLIENT : Créer une réservation ─────────────────────────────────────────
  @Post()
  @ApiOperation({
    summary:
      'Créer une réservation location ou achat (client connecté ou public)',
  })
  create(@Body() dto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(dto, req.user);
  }

  // ── CLIENT : Mes réservations ──────────────────────────────────────────────
  @Get('mes-reservations')
  @ApiOperation({ summary: 'Mes réservations (client connecté)' })
  findMine(@Request() req) {
    return this.reservationsService.findMine(req.user.id);
  }

  // ── CLIENT : Valider paiement ──────────────────────────────────────────────
  @Patch(':id/paiement')
  @ApiOperation({
    summary: 'Soumettre un paiement Wave / OM / Free Money / Carte (client)',
  })
  validerPaiement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ValiderPaiementDto,
  ) {
    return this.reservationsService.validerPaiement(id, dto);
  }

  // ── ADMIN : Toutes les réservations ───────────────────────────────────────
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Toutes les réservations avec filtres (Admin)' })
  @ApiQuery({ name: 'statut', enum: StatutReservation, required: false })
  @ApiQuery({ name: 'type', enum: TypeReservation, required: false })
  findAll(
    @Query('statut') statut?: StatutReservation,
    @Query('type') type?: TypeReservation,
  ) {
    return this.reservationsService.findAll(statut, type);
  }

  // ── ADMIN : Stats dashboard ────────────────────────────────────────────────
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Statistiques des réservations (Admin)' })
  getStats() {
    return this.reservationsService.getStats();
  }

  // ── ADMIN/CLIENT : Voir une réservation ───────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: "Détail d'une réservation" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  // ── ADMIN : Changer le statut ─────────────────────────────────────────────
  @Patch(':id/statut')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Changer statut réservation (Admin) → Confirmée, En cours, Terminée, Annulée',
  })
  updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatutDto,
  ) {
    return this.reservationsService.updateStatut(id, dto);
  }

  // ── ADMIN : Marquer WhatsApp envoyé ──────────────────────────────────────
  @Patch(':id/whatsapp')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Marquer le message WhatsApp comme envoyé (Admin)' })
  marquerWhatsapp(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.marquerWhatsapp(id);
  }

  // ── ADMIN : Supprimer ─────────────────────────────────────────────────────
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer une réservation (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.remove(id);
  }
}
