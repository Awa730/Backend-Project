import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ExchangeService {
  // API gratuite - pas besoin de clé !
  private readonly API_URL = 'https://open.exchangerate-api.com/v6/latest/XOF';

  async getConversion(montantFCFA: number) {
    try {
      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new HttpException(
          'Impossible de récupérer les taux de change',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = await response.json();
      const rates = data.rates;

      return {
        montantFCFA,
        conversions: {
          EUR: parseFloat((montantFCFA * rates.EUR).toFixed(2)),
          USD: parseFloat((montantFCFA * rates.USD).toFixed(2)),
          GBP: parseFloat((montantFCFA * rates.GBP).toFixed(2)),
          MAD: parseFloat((montantFCFA * rates.MAD).toFixed(2)), // Dirham marocain
          XOF: montantFCFA, // FCFA (base)
        },
        lastUpdate: data.time_last_update_utc,
        source: 'ExchangeRate-API (open.exchangerate-api.com)',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Erreur lors de la conversion de devises',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRates() {
    try {
      const response = await fetch(this.API_URL);
      const data = await response.json();

      return {
        base: 'XOF (Franc CFA)',
        rates: {
          EUR: data.rates.EUR,
          USD: data.rates.USD,
          GBP: data.rates.GBP,
          MAD: data.rates.MAD,
        },
        lastUpdate: data.time_last_update_utc,
      };
    } catch {
      throw new HttpException(
        'Impossible de récupérer les taux',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
