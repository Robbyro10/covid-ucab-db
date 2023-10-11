import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { CommonService } from './common.service';

@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

}
