// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger/dist/type-helpers';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
