import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users")
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    email : string;

    @Column()
    name : string;

    @Column()
    password : string;
}
