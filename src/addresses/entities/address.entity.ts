import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  department: string

  @Column()
  municipality: string

  @Column()
  complement: string
  user: any;

  @Column({ default: true })
  isActive: boolean
}
