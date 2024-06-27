import { IsNotEmpty } from "class-validator";

export class GetEventDto {
    @IsNotEmpty()
    calendarId: string;

    @IsNotEmpty()
    timeMin: string;

    @IsNotEmpty()
    timeMax: string;

    @IsNotEmpty()
    singleEvents: boolean;

    @IsNotEmpty()
    orderBy: string;
}