import { Column, Decimal128, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Box {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'date'})
    date: Date;

    @Column()
    start: Number;

    @Column()
    totalSales: number;

    @Column({default: true})
    isActive: boolean
}
