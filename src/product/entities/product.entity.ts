import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


export class Product {
    PrimaryGeneratedColumn
    id: number

    Column
    name: string;

    Column
    code: string;

    Column
    stock: number;

    Column
    price: number;

    Column({default: true})
    isActive: boolean;
}
