import { Body, Controller, Get, Post } from '@nestjs/common';
import { get } from 'http';
import { ICreateTransaction } from './transaction.interface';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transaction')
  createTransaction(@Body() input: ICreateTransaction) {
    return this.transactionService.createTransaction(input);
  }

  @Get('statistics')
  getStatistics() {
    return this.transactionService.calculateStatistics();
  }
}
