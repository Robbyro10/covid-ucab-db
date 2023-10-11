import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) ),
        user
      });

      await this.productRepository.save(product);
  
      return product;

    } catch (error) {
      this.commonService.errorHandle(error);
    }
  };

  async findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });
  };

  async findOne(term: string) {
    let product: Product;

    if ( isUUID(term) ){
      product = await this.productRepository.findOneBy({id: term});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`title ILIKE :title or slug ILIKE :slug`, {
          title: term,
          slug: term
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if ( !product ) throw new NotFoundException(`Product with ${term} not found`)
    
    return product;
  };

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      if (images?.length) {
        await queryRunner.manager.delete(ProductImage, { product: { id }});
        product.images = images.map( 
          img => this.productImageRepository.create({url: img})
        );
      }
      // await this.productRepository.save(product);
      product.user = user;
      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonService.errorHandle(error);
    }
  }

  async remove(id: string) {

    const product = await this.findOne( id );
    
    await this.productRepository.remove( product );
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();
        
    } catch (error) {
      this.commonService.errorHandle(error)
    }
  }
}
