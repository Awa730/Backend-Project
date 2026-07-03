import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { VehiculesService } from './vehicules.service';
import { CreateVehiculeDto, UpdateVehiculeDto } from './dto/vehicule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/users.entity';
import { StatutVehicule } from './vehicule.entity';

@ApiTags('🚗 Véhicules')
@Controller('vehicules')
export class VehiculesController {
  constructor(private readonly vehiculesService: VehiculesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Ajouter un véhicule (Admin)' })
  create(@Body() dto: CreateVehiculeDto) {
    return this.vehiculesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les véhicules — public, filtre statut optionnel',
  })
  @ApiQuery({ name: 'statut', enum: StatutVehicule, required: false })
  findAll(@Query('statut') statut?: StatutVehicule) {
    return this.vehiculesService.findAll(statut);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'un véhicule — public" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculesService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un véhicule (Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehiculeDto,
  ) {
    return this.vehiculesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un véhicule (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculesService.remove(id);
  }
}
