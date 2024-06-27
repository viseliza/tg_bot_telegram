import * as moment from "moment";
import { IEvent, IEventDate } from "../types";

/** Модель событий
 * @param {string} id
 * @param {string} summary
 * @param {string} description
 * @param {IEventDate | string} start
 * @param {IEventDate | string} end
 */
export class Event implements IEvent {
    id?: string;
    summary: string;
    description: string;
    start?: IEventDate | string;
    end?: IEventDate | string;
    timeMin?: string;
    timeMax?: string;

    constructor(opts: IEvent) {
        this.id   = opts?.id;
        this.summary = opts.summary;
        this.description = opts.description;
        this.start = opts.start ?? opts.timeMin;
        this.end = opts.end ?? opts.timeMax;
    }

    public getFormatedDate(): string {
        return moment(typeof this.start == "string" ? this.start : this.start.dateTime).format("YYYY-MM-DD HH:mm");
    }
}

