import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    lastName: string

    @Column( {default: true} )
    isActive: boolean

    @ManyToOne(() => Role)
    rol: Role

    @RelationId((user: User) => user.rol)
    rolId: number

}
