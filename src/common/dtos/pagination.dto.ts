import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        default: 10, description: 'Amount of rows wanted'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0, description: 'Amount of rows skipped'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}