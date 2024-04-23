import { Test, TestingModule } from '@nestjs/testing';
import { DetailSaleController } from './detail-sale.controller';
import { DetailSaleService } from './detail-sale.service';

describe('DetailSaleController', () => {
  let controller: DetailSaleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailSaleController],
      providers: [DetailSaleService],
    }).compile();

    controller = module.get<DetailSaleController>(DetailSaleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
