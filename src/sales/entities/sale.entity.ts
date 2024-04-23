import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm'

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

   @Column({type: 'date'})
   date: Date;

    @Column()
    total: number;

    @ManyToOne(() => Client)
    client: Client;

    @RelationId((sale: Sale) => sale.client)
    clientId: number;
}
