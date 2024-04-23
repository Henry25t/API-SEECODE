import { Test, TestingModule } from '@nestjs/testing';
import { DetailSaleService } from './detail-sale.service';

describe('DetailSaleService', () => {
  let service: DetailSaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailSaleService],
    }).compile();

    service = module.get<DetailSaleService>(DetailSaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
