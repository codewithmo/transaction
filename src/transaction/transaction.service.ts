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
      let {
        yearDifference,
        monthDifference,
        dayDifference,
        minutesDifference,
        secondsDifference,
        millisecondsDifference,
      } = differenceObject;

      if (
        yearDifference <= 0 &&
        monthDifference <= 0 &&
        dayDifference <= 0 &&
        minutesDifference <= 1 &&
        secondsDifference <= 60
      ) {
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
  async getTimeDifference(time1, time2) {
    return {
      yearDifference: time1.getFullYear() - time2.getFullYear(),
      monthDifference: time1.getMonth() - time2.getMonth(),
      dayDifference: time1.getDay() - time2.getDay(),
      hoursDifference: time1.getHours() - time2.getHours(),
      minutesDifference: time1.getMinutes() - time2.getMinutes(),
      secondsDifference: time1.getSeconds() - time2.getSeconds(),
      millisecondsDifference: time1.getMilliseconds() - time2.getMilliseconds(),
    };
  }
}
