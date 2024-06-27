import { 
    Context, 
    Telegraf, 
    Markup 
} from 'telegraf';
import type { 
    Command, 
    Days, 
    IDates, 
    IEvents, 
    Role 
} from '../types';
import { 
    inline_keyboard_owner, 
    inline_keyboard_user 
} from '../common/keyboards';
import { 
    CommandRunner, 
    CreateCommadStrategy, 
    UpdateCommadStrategy, 
    DeleteCommadStrategy
} from './';
import * as moment from 'moment';
import { CalendarAPI } from '../common/api/api';
import { GetEventDto } from '../dto/get.event.dto';
import * as Calendar from 'telegram-inline-calendar';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Event, Setting, User } from '../models/';


export class CalendarHelper {
    private bot: Telegraf<Context<Update>>;
    private calendaApi: CalendarAPI;
	private calendar: Calendar;
    private role: Role;
    private month: string;
    private year: string = new Date().getFullYear().toString();
	private events: IEvents = {};
    private text: string;
    private command: string;
    private interval: number = 30;
    private lockDateTimeArray: IDates = {};
    private params: GetEventDto = {
        calendarId: "Alexeev_Dauwalter" /* telegram id of owner */,
        timeMin: "",
        timeMax: "",
        singleEvents: true,
        orderBy: 'startTime',
    }
	private timeRange: Days;
    

    constructor(bot: Telegraf<Context<Update>>, role: Role) { 
        this.calendaApi = new CalendarAPI("");
        this.bot = bot;
        this.role = role;
    }


    public async setup(command: Command | string, user: User, rangeDays?: number) {
        this.command = command; 
        const setting = await this.calendaApi.getSetting(user.id);
        this.timeRange = setting.getTimeRange();
        this.interval = setting.interval;

        switch (command) {
            case 'create': 
                this.text = 'Выберите дату и время для <b>проведения</b> встречи. Чтобы отменить выбор нажмите кнопку <b>Отмена</b>';
                break;
            case 'update' :
                this.text = 'Выберите дату и время встречи которую хотите <b>изменить</b>. Чтобы отменить выбор нажмите кнопку <b>Отмена</b>';
                break;
            case 'delete':
                this.text = 'Выберите дату и время встречи которую хотите <b>удалить</b>. Чтобы отменить выбор нажмите кнопку <b>Отмена</b>';
                break;
            case 'schedule':
                this.text = 'Выберите дату и время встречи которую хотите <b>посмотреть</b>. Чтобы вернуться назад нажмите кнопку <b>Отмена</b>';
                break;
        }

        const stopDate = rangeDays ? moment().add(rangeDays, 'days').format("YYYY-MM-DD") : undefined;

		this.calendar = new Calendar(this.bot, {
			date_format: 'MMM D, YYYY h:mm A',
			language: 'en',
			start_week_day: 1,
			bot_api: "telegraf",
			time_step: `${this.interval}m`,
			time_selector_mod: true,
			lock_date: true,
			lock_datetime: true,
            start_date: moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm'),
            stop_date: stopDate
		});
        this.lockDateTimeArray = {};
    }

    
    public async initialize(ctx: Context) {
		this.month = this.convertingDigitToNumber(new Date().getMonth() + 1);
		this.params.timeMin = moment(this.year).startOf('year').toISOString();
		this.params.timeMax = moment(this.year).endOf('year').toISOString();
        this.calendar.lock_datetime_array = [];

        await this.updateEvents();

		await ctx.replyWithHTML(
			this.text, 
			Markup.keyboard([
				['Отмена']
			]).resize()
		);

		this.calendar.startNavCalendar(ctx);
    }


    public async on(ctx: any) {
        if (ctx.callbackQuery.message.message_id == this.calendar.chats.get(ctx.callbackQuery.message.chat.id) && ctx.callbackQuery.data.trim()) {
            this.calendar.options.close_calendar = this.command == "schedule" ? false : true;
            const selected = ctx.callbackQuery.data;
			const date = selected.split('_')[1];
			this.year = date.split('-')[0];
			this.month = date.split('-')[1];

			const day_of_weak = moment(date.split(' ')[0]).format('dddd').toLowerCase();

			switch (selected.split('_')[2].trim()) {
				case "+":
				case "-":
					this.month = this.convertingDigitToNumber(this.month, selected.split('_')[2].trim());
                    // Добавить удаление заполненных дней в месяце
					break;
				case "++":
				case "--":
					this.year = this.convertingDigitToNumber(this.year, selected.split('_')[2].trim());
					this.params.timeMin = moment(this.year).startOf('year').toISOString();
					this.params.timeMax = moment(this.year).endOf('year').toISOString();
					
                    await this.updateEvents();
					break;
				case "0":
					this.calendar.options.time_range = this.timeRange[day_of_weak];
                    this.calendar.lock_datetime_array = this.getDateTimesInRange(
                        date, 
                        this.timeRange[day_of_weak], 
                        this.events[this.year].activeEvent
                    );
					break;
				default:
					break;
			}

			const result = this.calendar.clickButtonCalendar(ctx.callbackQuery);
            
			if (result !== -1 && this.command !== 'schedule'  && new Date(result).getFullYear() == Number.parseInt(this.year)) {
                const runner = new CommandRunner();
                const event = this.events[this.year].events.filter(event => event.start == new Date(result).toISOString());
            
                runner.use("create", new CreateCommadStrategy());
                runner.use("update", new UpdateCommadStrategy());
                runner.use("delete", new DeleteCommadStrategy());

                try {
                    return runner.run(this.command, ctx, result, event[0]);
                } catch (e) {
                    console.error(e.message)
                    return;
                }
			}
		}
        await ctx.answerCbQuery();
    }


    /**
     * Deleting active calendars
     * @param ctx - context 
     * @param isDeleteSelf - delete last sended message
     */
    public deleteCalendars(ctx: Context, isDeletePrev = false) {
        ctx.reply('Действие отменено', Markup.keyboard(
            this.role.valueOf() == "USER" ? inline_keyboard_user: inline_keyboard_owner
        ).resize());

		let chat_id;
        
        if (this.calendar && this.calendar.chats) {
            this.calendar.chats.forEach((key: number, value) => {
                chat_id = value
                let messageIds = [key - 1, key];
                if (isDeletePrev)
                    messageIds.push(key - 2);
                ctx.deleteMessages(messageIds);
            });
            this.calendar.chats.delete(chat_id);
        } else {
            ctx.deleteMessage(ctx.message.message_id - 1);
        }
    }


    /**
     * Get all days for year
     * @param year 
     * @returns array dates
     */
    private getDatesInRange(year: string, lockDates: string[]) {
        const start = new Date(moment(year).startOf('year').toISOString());
        const end = new Date(moment(year).endOf('year').toISOString());
        const dates: string[] = [];
        lockDates = lockDates.map(date => moment(date).format("YYYY-MM-DD"))

        while (start < end) {
            const exist = lockDates.indexOf(moment(start).format("YYYY-MM-DD"));
            if (exist == -1 && this.command != "create")
                dates.push(moment(new Date(start)).format("YYYY-MM-DD"));
            // else if (exist != -1 && this.command == "create")
            //     dates.push(moment(new Date(start)).format("YYYY-MM-DD"));

            start.setDate(start.getDate() + 1);
        }
        return dates;
    }


    /**
     * Get date times of select day with time range
     * @param day 
     * @param timeRange 
     * @param lockDates 
     * @returns 
     */
    private getDateTimesInRange(date: string, timeRange: string, lockDates: string[]): string[] {
        const timeRangeStart = {
            hours: timeRange.split('-')[0].split(':')[0],
            minutes: timeRange.split('-')[0].split(':')[1]
        };
        const timeRangeEnd = {
            hours: timeRange.split('-')[1].split(':')[0],
            minutes: timeRange.split('-')[1].split(':')[1]
        };

        const start = new Date(moment(date).startOf('day').toISOString());
        const end = new Date(moment(date).endOf('day').toISOString());
        let index = 0;

        start.setHours(Number.parseInt(timeRangeStart.hours), Number.parseInt(timeRangeStart.minutes), 0);
        end.setHours(Number.parseInt(timeRangeEnd.hours), Number.parseInt(timeRangeEnd.minutes), 0);

        const dates: string[] = [];

        while (start < end) {
            const exist = lockDates.indexOf(moment(start).format("YYYY-MM-DD HH:mm"));
            if (exist == -1 && this.command !== "create") {
                dates.push(moment(new Date(start)).format("YYYY-MM-DD HH:mm"));
            }  else if (exist != 1 && this.command !== "create") {
                if (!index) {
                    this.calendar.options.time_range = moment(new Date(start)).format("HH:mm") + "-" + moment(new Date(end)).format('HH:mm');
                    index++;
                }
            }
            if (exist != -1 && this.command == "create")
                dates.push(moment(new Date(start)).format("YYYY-MM-DD HH:mm"));
            start.setMinutes(start.getMinutes() + 30);
        }

        return dates;
    }


    /**
     * Конвертирует цирфу в число и прибавляет или убавляет одно значение (минимум 2 символа)
     * @param {string} str — исходная цифра
     * @param {string} sign — арифметический знак
     * @returns {string} — форматированное число
     */
	private convertingDigitToNumber(str: string | number, sign?: string): string {
		let num = Number(str);
        if (sign)
		    num += sign[0] == "+" ? 1 : -1;
		return (num < 10) ? '0' + num.toString() : num.toString();
	}


    /**
     * Updating the list of events and the list of blocked dates and times
     */
    private async updateEvents(): Promise<void> {
        if (!Object.keys(this.events).includes(this.year)) {
			const eventsForYear = await this.calendaApi.getEvents(this.params);
			this.events[this.year] = { 
				events: eventsForYear, 
				activeEvent: eventsForYear.map((event: Event) => event.getFormatedDate())  
			};
		}

        if (!Object.keys(this.lockDateTimeArray).includes(this.year)) {
            const dates = this.getDatesInRange(this.year, this.events[this.year].activeEvent);
            this.calendar.lock_date_array = dates;
            this.lockDateTimeArray[this.year] = { 
                dates
			};
        }
        
        this.calendar.lock_date_array = [
            ...this.calendar.lock_date_array, 
            ...this.getDatesInRange(this.year, this.events[this.year].activeEvent)
        ];
    }
}