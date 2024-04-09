import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("rol")
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: true })
    isActive: boolean
}
