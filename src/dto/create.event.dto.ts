import { IsNotEmpty } from "class-validator";

class TimeDto {
	@IsNotEmpty()
	dateTime: string;

	@IsNotEmpty()
	timeZone: string;
}

class DataDto {
	@IsNotEmpty()
	summary: string;

	@IsNotEmpty()
	description: string;
	
	@IsNotEmpty()
	start: TimeDto;

	@IsNotEmpty()
	end: TimeDto;
}

export class CreateEventDto {
	@IsNotEmpty()
	calendarId: string;

	@IsNotEmpty()
	data: DataDto;
}