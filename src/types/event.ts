import type { Event } from "../models/Event";

export type IEvent = {
    id?: string;
    summary: string;
    description: string;
    start?: IEventDate | string;
    end?: IEventDate | string;
    timeMin?: string;
    timeMax?: string;
}

export type IEventDate = {
    dateTime: string;
    timeZone: string;
}


export type IEvents = {
    [key: string]: IEventsValue;
}


export type IEventsValue = {
    events: Event[];
    activeEvent: string[];
}


export type CreateEvent = {
	calendarId: string;
	data: EventDate;
}


export type UpdateEvent = {
	calendarId: string;
    eventId: string;
	requestBody: EventDate;
}


export type DeleteEvent = {
	calendarId: string;
    eventId: string;    
}


type EventDate = {
	summary?: string;
	description?: string;
	start?: EventTime;
	end?: EventTime;
}

type EventTime = {
	dateTime: string;
	timeZone: string;
}
