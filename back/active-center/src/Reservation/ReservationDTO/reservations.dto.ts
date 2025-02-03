/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, Validate} from "class-validator";
import { MinTwoHoursDifference } from "../validator";

const TIME_REGEX = /^(0[7-9]|1\d|2[0-3]):[0-5]\d$/


export class CreateReservationDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "cancha de futbol"
    })
    spaceName: string;

    @IsInt()
    @ApiProperty({
        example: 100
    })
    price:number;

    @IsNotEmpty()
    @IsDateString()
    date: Date;


    @IsNotEmpty()
    @IsString()
    @Matches(TIME_REGEX)
    @ApiProperty({
        description: "son cada dos horas",
        example: "08:00"
    })
    startTime:string;


    @IsNotEmpty()
    @IsString()
    @Matches(TIME_REGEX)
    @Validate(MinTwoHoursDifference)
    @ApiProperty({
        example: "10:00"
    })
    endTime:string;
    
    @IsBoolean()
    @IsOptional()
    status: boolean;


}