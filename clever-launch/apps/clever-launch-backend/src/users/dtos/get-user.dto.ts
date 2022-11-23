import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress } from "class-validator";

export class GetUserDto {
    @ApiProperty()
    @IsEthereumAddress()
    ethKey: string;
}