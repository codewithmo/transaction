import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

jest.useFakeTimers();
describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //test-case:1 - Transaction is older than 60 seconds
  it('Test 01: Transaction is older than 60 seconds', async () => {
    let result = await controller.createTransaction({
      amount: '10',
      timestamp: '2022-10-05T09:19:31.995Z',
    });
    expect(controller).toBeDefined();
    expect(JSON.parse(JSON.stringify(result))).toStrictEqual({
      response: {
        status: 'NO_CONTENT',
        statusCode: 204,
        message: 'Transaction is older than 60 seconds',
        error: 'Not Acceptable',
      },
      status: 204,
      message: 'Transaction is older than 60 seconds',
      name: 'HttpException',
    });
  });

  //test-case:2 - time lesser than 60 sec and get expected result
  it('Test 02: PASS: Time lesser than 60 sec and get expected result', async () => {
    let date = new Date();
    let input = {
      amount: '10',
      timestamp: date.toISOString(),
    };
    let result = await controller.createTransaction(input);
    expect(controller).toBeDefined();
    expect(result).toStrictEqual({
      amount: '10',
      timestamp: date.toISOString(),
    });
  });

  //test-case:3 - Future Transaction
  it('Test 03: FAIL: Future Transaction', async () => {
    let result = await controller.createTransaction({
      amount: '10',
      timestamp: '2028-10-05T09:19:31.995Z',
    });
    expect(controller).toBeDefined();
    expect(JSON.parse(JSON.stringify(result))).toStrictEqual({
      response: {
        statusCode: 422,
        message: 'Invalid timestamp',
        error: 'Not Acceptable',
      },
      status: 422,
      message: 'Invalid timestamp',
      name: 'HttpException',
    });
  });
});
