/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./Reservation.entity";
import { Space } from "./Space.entity";
import { v4 as uuid } from 'uuid';

@Entity({name: 'activities'})
export class Activity {
    
    @PrimaryGeneratedColumn('uuid')
    id = uuid();

    @Column({ type: 'varchar', length: 50, nullable: false })
    title: string;

    @Column({ type: 'boolean', default: true, nullable: false})
    status: boolean;
}