import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ExchangeService {
  private exchangeRates: { [key: string]: number } = {};

  constructor(private httpService: HttpService) {}

  @Cron('0 0 * * *')
  async updateExchangeRates(): Promise<void> {
    const response = await this.httpService
      .get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
      .toPromise();

    const rates = response.data;
    this.exchangeRates = {
      USD: parseFloat(rates.find((rate) => rate.ccy === 'USD').buy),
      EUR: parseFloat(rates.find((rate) => rate.ccy === 'EUR').buy),
      UAH: 1,
    };
  }

  getExchangeRates(): { [key: string]: number } {
    return this.exchangeRates;
  }
}
