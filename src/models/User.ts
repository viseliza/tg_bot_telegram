import { Setting } from "./";

/** Модель пользователя
 * @param {string} id
 * @param {string} name
 * @param {string} role
 * @param {Setting} setting
 */
export class User /* implements IEvent */ {
    id?: string;
    name: string;
    role: string;
    setting?: Setting;

    constructor(opts /* : IEvent */ ) {
        this.id   = opts?.id;
        this.name = opts.name;
        this.role = opts.role;
    }
}

