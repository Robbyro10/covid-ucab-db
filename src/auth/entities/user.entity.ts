import { Product } from "../../products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
@Entity({ name: 'users' })
export class User {

    @ApiProperty({
        example: 'd8daec1c-698f-4376-88fb-bdb555215c82',
        description: 'User ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'johndoe@gmail.com',
        description: 'User Email Address',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'User Name'
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: '$2b$10$jJ21bZ7jdSNsdVUJaQMnNu4PS3I9csa0G0mPemELHXmKXkMb8LgjW',
        description: 'User Password'
    })
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty()
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    products: Product;

    @BeforeInsert()
    checkfieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkfieldsBeforeUpdate() {
        this.checkfieldsBeforeInsert;
    }
}
