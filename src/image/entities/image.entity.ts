import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    public_id: string;

    @Column()
    title: string;

    //@Column()
    //format: string;

    @Column({default: true})
    isActive: boolean;
}
