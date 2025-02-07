import { Max } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'subscriptions'})
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "varchar", length: 60, nullable: false, unique: true})
    name: string;

    @Column({type: 'integer', nullable: false})
    @Max(100, {message: 'El maxímo posible es del 100%'})
    percentage: number;

    @Column({type: "array"})
    benefits: string[];

}