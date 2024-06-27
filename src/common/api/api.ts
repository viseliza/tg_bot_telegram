import { AppError } from './errors';
import { GetEventDto } from '../../dto/get.event.dto';
import { Setting, User, Event } from '../../models';
import { CreateEvent, DeleteEvent, UpdateEvent } from '../../types';


export class CalendarAPI {
    
    // static API = new URL('https://chat-ptk.viseliza.site/');
    static API = new URL('http://localhost:21003/');

    #token;
    #defaultParams;

    /**
     * 
     * @param {string} token 
     * @param {{}} defaultParams 
     */
    constructor(token: string, defaultParams = {}) {
        this.#token = token;
        this.#defaultParams = defaultParams ?? {};
    }

    async callApi(method: string, params: any = {}, call = "GET") {
        // const q = new URLSearchParams({
        //     token: this.#token,
        //     ...this.#defaultParams,
        //     ...params
        // });

        let response: Response;
        let url: string;

        if (params.name)
            url = `${CalendarAPI.API.origin}/api/${method}/${params.name}`;
        else 
            url = `${CalendarAPI.API.origin}/api/${method}`;
        
        if (params.body || call == "POST") {
            response =  await fetch(url, {
                method: call,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                  },
                body: JSON.stringify(params.body)
            });
        } else 
            response = await fetch(url)
        
        const json = await response.json();
        
        // if ('status' in json && json.status === 'ok') {
        if (json) {
            delete json.msg;
            delete json.code;
            // Возвращаем ответ
            return json;
        }

        // console.log({url, json});
        // проверяем на ошибки
        AppError.check(json);
        
        throw new AppError(json.msg, json.code);
    }


    /** Добавление записи в календарь с указанными параметрами
     * @param {string} telegram_id уникальный номер календаря в который добавиться запись
     * @param {CreateEvent} params параметры записи: заголовок, описание, дата начала и дата конца
     * @returns {Promise<any>}
     */
    async addEvent(params: CreateEvent) {
        return await this.callApi('event', { body: params }, "POST");
    }


    /** Добавление телеграм пользователя 
     * @param {CreateEvent} params параметры записи: id, username, role
     * @returns {Promise<any>}
     */
    async addUser(params: User) {
        return await this.callApi('user', { body: params }, "POST");
    }


    /** Добавление календаря с telegram id владельца
     * @param {string} telegram_id уникальный номер календаря
     * @returns {Promise<any>}
     */
    async addCalendar(telegram_id: string) {
        return await this.callApi('calendar', { name: telegram_id }, "POST");
    }


    /** Поиск календаря по его названию
     * @param {string} name название календаря
     * @returns {Promise<any>}
     */
    async getCalendars(name: string) {
        return await this.callApi('calendar', { name });
    }


    /** Поиск календаря по его названию
     * @param {string} id название календаря
     * @returns {Promise<User>}
     */
    async getUser(id: string) {
        return await this.callApi('user', { name: id });
    }


    /** Поиск календаря по его названию
     * @param {string} owner_id - username телеграм пользователя
     * @returns {Promise<Setting>}
     */
    async getSetting(owner_id: string): Promise<Setting> {
        const setting = await this.callApi('setting', { name: owner_id });
        return new Setting(setting);
    }


    /** Получение записей из календаря с указанными параметрами
     * @param {CreateEventDto} params параметры записей: id календаря, дата начала и дата конца
     * @returns {Promise<Event>}
     */
    async getEvents(params: GetEventDto): Promise<Event[]> {
        const events = await this.callApi('event/get', { body: params }, "POST");
        return events.map(event => new Event(event));
    }


    /** Обновление записи из календаря
     * @param {UpdateEvent} params параметры записи: id календаря и события
     * @returns {Promise<any>}
     */
    async updateEvent(params: UpdateEvent): Promise<any> {
        return await this.callApi('event', { body: params }, "PATCH");
    }


    /** Обновление настроек пользователя
     * @param {UpdateEvent} params параметры записи: id календаря и события
     * @returns {Promise<any>}
     */
    async updateSetting(params: Setting): Promise<any> {
        return await this.callApi('setting', { body: params }, "PATCH");
    }


    /** Удаление записи из указанного календаря по ее id
     * @param {DeleteEvent} params параметры записи: id календаря и события
     * @returns {Promise<any>}
     */
    async deleteEvent(params: DeleteEvent) {
        return await this.callApi('event', { body: params }, "DELETE");
    }
}