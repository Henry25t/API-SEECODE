import { Role } from "src/roles/entities/role.entity";
import * as  bcrypt from 'bcrypt';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Address } from "src/addresses/entities/address.entity";

@Entity("user")
export class User {
    id: number

    name: string

    lastName: string

    email: string

    password: string

    @Column({ default: true })
    isActive: boolean

    @ManyToOne(() => Role)
    rol: Role

    @RelationId((user: User) => user.rol)
    rolId: number

    @ManyToOne(() => Address)
    address: Address

    @RelationId((user: User ) => user.address )
    addressId: number

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(contraseña: string): boolean {
        return bcrypt.compareSync(contraseña, this.password);
    }
}
