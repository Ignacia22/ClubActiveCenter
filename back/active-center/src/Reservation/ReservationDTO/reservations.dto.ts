/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, isUUID, IsUUID, Matches } from "class-validator";

export class CreateReservationDto {
    
    @IsUUID()
    @IsString()
    spaceId: string;
    
    @IsUUID()
    @IsString()
    userId:string;


    @IsInt()
    @ApiProperty({
        example: 100
    })
    price:number;


    @IsDateString()
    date: Date;

    @IsInt()
    @Matches(/^(0[7-9]|1[0-9]|2[0-3]):([0-5]\d)$/ , {message:"startTime must be between 07:00 and 23:00 "})
    @ApiProperty({
        description: "son cada dos horas",
        example: 9
    })
    startTime:string;
    
    @IsInt()
    @Matches(/^(0[7-9]|1[0-9]|2[0-3]):([0-5]\d)$/ , {message: "endTime must be between 07:00 and 23:00"})
    @ApiProperty({
        example: 11
    })
    endTime:string;
    
    @IsBoolean()
    @IsOptional()
    status: boolean;


}