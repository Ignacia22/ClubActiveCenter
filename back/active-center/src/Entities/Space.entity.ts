/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./Activity.entity";
import { v4 as uuid } from 'uuid';


@Entity({name: 'spaces'})
export class Space {
    @PrimaryGeneratedColumn('uuid')
    id = uuid();
    
    @Column({type: 'varchar', length: 80, nullable: false})
    name: string;

    @Column({type: 'text', nullable: false})
    description: string;

    @Column({type: 'text', default: "iwmfiwmfiwfmwfw", nullable: false})
    img: string;

    @Column({type: 'boolean' })
    status: boolean;

    @ManyToOne(() => Activity, (activity) => activity.spaces)
    activity: Activity[];
}

