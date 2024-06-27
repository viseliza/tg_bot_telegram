import { Days, ISetting } from "../types";

/** Модель настроек
 * @param {string} id
 * @param {string} interval
 * @param {string} monday
 * @param {string} tuesday
 * @param {string} wednesday
 * @param {string} thursday
 * @param {string} friday
 * @param {string} saturday
 * @param {string} sunday
 * @param {string} owner_id
 */
export class Setting implements ISetting {
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

    constructor(opts: ISetting) {
        this.id   = opts?.id;
        this.interval = opts.interval;
        this.monday = opts.monday;
        this.tuesday = opts.tuesday;
        this.wednesday = opts.wednesday;
        this.thursday = opts.thursday;
        this.friday = opts.friday;
        this.saturday = opts.saturday;
        this.sunday = opts.sunday;
        this.owner_id = opts.owner_id;
    }

    public getTimeRange(): Days {
        return {
            monday: this.monday,
            tuesday: this.tuesday,
            wednesday: this.wednesday,
            thursday: this.thursday,
            friday: this.friday,
            saturday: this.saturday,
            sunday: this.sunday
        }
    }
}

