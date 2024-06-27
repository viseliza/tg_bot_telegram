import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

enum Role {
    USER = "USER",
    OWNER = "OWNER"
}

export class CreateUserDto {
	@ApiProperty({
		description: 'The age of a cat',
		default: 1,
	})
	@IsNotEmpty()
	id: string;


	@ApiProperty({
		description: 'The age of a cat',
		default: 1,
	})
	@IsNotEmpty()
	name: string;


	@ApiProperty({
		description: 'The age of a cat',
		type: [Role]
	})
	@IsNotEmpty()
	@IsEnum(Role)
	role: Role;
}