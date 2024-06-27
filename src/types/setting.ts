export interface ISetting {
    id?: number;
    interval?: number;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    owner_id: string;

    getTimeRange: () => Days;
}


export type Days = {
    'monday': 	string,
    'tuesday': 	string,
    'wednesday':string,
    'thursday': string,
    'friday': 	string,
    'saturday': string,
    'sunday': 	string
}