import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Files {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string;

    @Column()
    path: string;
}
