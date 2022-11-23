import { ApiProperty } from '@nestjs/swagger';

export class SubmitEkycOutputDto {
  @ApiProperty()
  message: string;
}
