import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '../users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register — Public
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login — Public
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/profil — Connecté seulement
  @UseGuards(JwtAuthGuard)
  @Get('profil')
  getProfil(@Request() req: any) {
    return { message: 'Profil récupéré', user: req.user };
  }

  // GET /auth/admin — Admin seulement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getAdmin(@Request() req: any) {
    return { message: 'Bienvenue Admin !', user: req.user };
  }

  // GET /auth/client — Client seulement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('client')
  getClient(@Request() req: any) {
    return { message: 'Bienvenue Client !', user: req.user };
  }

  // PATCH /auth/promouvoir/:id — Admin seulement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('promouvoir/:id')
  promouvoir(@Param('id', ParseIntPipe) id: number) {
    return this.authService.promouvoir(id);
  }
}