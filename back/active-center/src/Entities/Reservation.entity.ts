/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { Activity } from "./Activity.entity";

@Entity({name: 'reservations'})
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column({type: 'date', nullable: false, default: new Date()})
    date: Date; 

    @Column({type: 'boolean', default: true})
    status: boolean;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false})
    price: number;

    @ManyToOne(() => User, (user) => user.reservations)
    user: User;

    @OneToMany(() => Activity, (activity) => activity.reservation)
    activities: Activity[];
}

