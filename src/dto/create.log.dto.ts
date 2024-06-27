import { IsNotEmpty } from "class-validator";

export class CreateLogDto {
	@IsNotEmpty()
	telegram_id: string;

	@IsNotEmpty()
	text: string;

	@IsNotEmpty()
	time: Date;
}