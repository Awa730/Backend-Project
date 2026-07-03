import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Demo Véhicules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('demo/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un nouveau véhicule' })
  @ApiResponse({ status: 201, description: 'Le véhicule a bien été créé.' })
  @ApiResponse({
    status: 400,
    description: "Données d'entrée invalides (échec de validation).",
  })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste de tous les véhicules' })
  @ApiResponse({ status: 200, description: 'Liste récupérée avec succès.' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Obtenir les détails d'un véhicule par son ID" })
  @ApiParam({ name: 'id', description: 'ID unique du véhicule' })
  @ApiResponse({ status: 200, description: 'Véhicule trouvé.' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const vehicle = this.vehiclesService.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Le véhicule avec l'ID ${id} n'existe pas.`);
    }
    return vehicle;
  }

  @Patch(':id')
  @ApiOperation({ summary: "Modifier les informations d'un véhicule" })
  @ApiResponse({ status: 200, description: 'Véhicule mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un véhicule' })
  @ApiResponse({ status: 204, description: 'Véhicule supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    this.vehiclesService.remove(id);
  }
}
