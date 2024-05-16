import { Box } from 'src/box/entities/box.entity';
import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm'

export class Sale {
    PrimaryGeneratedColumn()
    id: string;

    Column({type: 'date'})
   date: Date;

    Column()
    total: string;

    ManyToOne(() => Client)
    client: Client;

    RelationId((sale: Sale) => sale.client)
    clientId: number;

    ManyToOne(() => Box)
    box: Box;

    RelationId((sale: Sale) => sale.box)
    boxId: number
}
