import {
  HttpException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ICreateTransaction } from './transaction.interface';

@Injectable()
export class TransactionService {
  mockData = [];

  async createTransaction(input: ICreateTransaction) {
    try {
      if (new Date().getTime() < new Date(input.timestamp).getTime())
        throw new HttpException(
          {
            statusCode: 422,
            message: 'Invalid timestamp',
            error: 'Not Acceptable',
          },
          422,
        );
      let currentTime = new Date();
      let inputTime = new Date(input.timestamp);
      let differenceObject = await this.getTimeDifference(
        currentTime,
        inputTime,
      );

      if (this.isTransactionOlderThan60Sec(differenceObject)) {
        this.mockData.push(input);
        return input;
      } else
        throw new HttpException(
          {
            status: 'NO_CONTENT',
            statusCode: 204,
            message: 'Transaction is older than 60 seconds',
            error: 'Not Acceptable',
          },
          204,
        );
    } catch (err) {
      return err;
    }
  }

  async calculateStatistics() {
    let currentTime = new Date();
    let amountStats = [];
    this.mockData.forEach((transaction) => {
      let inputTime = new Date(transaction.timestamp);
      let differenceObject = this.getTimeDifference(currentTime, inputTime);
      if (this.isTransactionOlderThan60Sec(differenceObject)) {
        amountStats.push(transaction.amount);
      }
    });
    console.log('amountStats---> ', amountStats);
    let resultStats = {
      sum: amountStats.reduce((a, b) => a + b, 0),
      avg: amountStats.reduce((a, b) => a + b, 0) / amountStats.length || 0,
      max:
        amountStats.reduce(
          (a, b) => Math.max(a, b),
          Number.NEGATIVE_INFINITY,
        ) || 0,
      min: Math.min(...amountStats) || 0,
      count: amountStats.length,
    };
    return resultStats;
  }

  //helper functions
  async getTimeDifference(currentTime, inputTime) {
    return {
      yearDifference: currentTime.getFullYear() - inputTime.getFullYear(),
      monthDifference: currentTime.getMonth() - inputTime.getMonth(),
      dayDifference: currentTime.getDay() - inputTime.getDay(),
      hoursDifference: currentTime.getHours() - inputTime.getHours(),
      minutesDifference: currentTime.getMinutes() - inputTime.getMinutes(),
      secondsDifference: currentTime.getSeconds() - inputTime.getSeconds(),
      millisecondsDifference:
        currentTime.getMilliseconds() - inputTime.getMilliseconds(),
    };
  }
  isTransactionOlderThan60Sec(differenceObject) {
    let {
      yearDifference,
      monthDifference,
      dayDifference,
      minutesDifference,
      secondsDifference,
    } = differenceObject;
    if (
      yearDifference + monthDifference + dayDifference === 0 &&
      minutesDifference <= 1 &&
      minutesDifference >= 0 &&
      secondsDifference <= 60 &&
      secondsDifference >= 0
    )
      return true;
  }
}
