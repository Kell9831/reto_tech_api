import { User } from "src/users/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title: string

    @Column()
    content: string

    @ManyToOne(()=> User, user => user.posts)
    author : User
}