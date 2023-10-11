import { Transform } from 'class-transformer';
import { User } from '../../auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '09edb4ae-4583-4e49-ab80-d4b511e8557c',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Chill Pullover Hoodie',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Introducing the Tesla Chill Collection. The Chill Pullover...',
        description: 'Product Description',
    })
    @Column('text', {
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'chill_pullover_hoodie',
        description: 'Product SLUG - For SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 0,
        description: 'Product Stock',
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['XS', 'S', 'M', 'L'],
        description: 'Product Sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product Gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['hoodie', 'winter'],
        description: 'Product Tags',
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];
    
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    @Transform(({ value }) => {
        return value.map((image: ProductImage) => image.url);
    })
    images?: ProductImage[];

    @ApiProperty()
    @ManyToOne(
        () => User,
        (user) => user.products,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) this.slug = this.title;

        this.slug = this.slug.toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (!this.slug) this.slug = this.title;

        this.slug = this.slug.toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }

}
