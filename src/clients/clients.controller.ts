import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('🙍 Profil client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('client')
export class ClientsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Voir mon profil client' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.findById(req.user.id);
    if (dto.nom) user.nom = dto.nom;
    if (dto.email) user.email = dto.email;
    return this.usersService.save(user);
  }
}