import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetUserDto {
	@ApiProperty({
		description: 'Телеграм id пользователя'
	})
	@IsNotEmpty()
	id: string;
}