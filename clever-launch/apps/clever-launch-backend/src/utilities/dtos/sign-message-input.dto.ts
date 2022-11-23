import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignMessageInputDto {
    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsString()
    privateKey: string;
}