import { Category } from 'src/category/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm'

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    stock: number;

    @Column()
    price: number;

    @ManyToOne(() => Category)
    category: Category;

    @RelationId((product: Product) => product.category)
    categoryId: number;

    @Column({default: true})
    isActive: boolean;
}
