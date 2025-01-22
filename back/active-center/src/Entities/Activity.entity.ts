/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./Reservation.entity";
import { Space } from "./Space.entity";

@Entity({name: 'activities'})
export class Activity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false})
    price: number;

    @Column({ type: 'boolean', default: true, nullable: false})
    status: boolean;

    @ManyToOne(() => Reservation, (reservation) => reservation.activities)
    reservation: Reservation;

    @OneToMany(() => Space, (space) => space.activity)
    spaces: Space[]
}