import { Controller, Get, Query, ParseFloatPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';

@ApiTags('💱 Conversion de devises')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('rates')
  @ApiOperation({
    summary: 'Taux de change actuels (XOF → EUR, USD, GBP, MAD)',
  })
  getRates() {
    return this.exchangeService.getRates();
  }

  @Get('convert')
  @ApiOperation({
    summary: 'Convertir un montant FCFA en plusieurs devises',
    description: 'Exemple : /exchange/convert?montant=25000000 → prix d\'un véhicule en EUR/USD',
  })
  @ApiQuery({
    name: 'montant',
    type: Number,
    description: 'Montant en FCFA à convertir',
    example: 25000000,
  })
  convert(@Query('montant', ParseFloatPipe) montant: number) {
    return this.exchangeService.getConversion(montant);
  }
}
