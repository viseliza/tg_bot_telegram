import { 
    Context, 
    Hears, 
    On, 
    Wizard, 
    WizardStep 
} from 'nestjs-telegraf'
import { 
    Scenes, 
    Markup 
} from 'telegraf'
import { 
    inline_keyboard_owner, 
    inline_keyboard_user 
} from '../common/keyboards';
import { CalendarAPI } from '../common/api/api';
import * as moment from 'moment-timezone';
import type { Event } from '../models/Event';
import type { Role } from '../types';

@Wizard('createEvent')
export class CreateEventWizard {
    private summary: string;
    private description: string;
    private dateStart: string;
    private dateEnd: string;

    private role: Role;
    private state: number = 0;

	@WizardStep(1)
	async step1(@Context() ctx: any) {
        this.state = 0;
        const state = ctx.wizard.state;
        this.role = state['user'].role;
        
        if (this.role == "OWNER" && !state['prevEvent']) {
            await ctx.reply('Введите username пользователя, с которым проведете встречу:', 
                Markup.keyboard([
                    ['Отмена']
                ]).resize()
            );
        }
        else {
            ctx.wizard.next();
            ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
	}


	@WizardStep(2)
	async step2(@Context() ctx: Scenes.WizardContext) {
        this.state = 1;
        const commands = ['Отмена'];
        
        if (ctx.wizard.state['prevEvent'])
            commands.push('Оставить') 

        await ctx.reply('Введите тему записи. Максимальная длина темы — 100 символов:',
			Markup.keyboard([
				commands
			]).resize()
        );
	}


	@Hears('Отмена')
	async backSchedule(ctx: Scenes.WizardContext) {
		ctx.scene.leave();
	}


    @On('text')
    async onMessage(ctx) {
        console.log(ctx)
        const state = ctx.wizard.state; 
        switch (this.state) {
            case 0:
                this.summary = ctx.update.message.text;

                ctx.wizard.next();
                ctx.wizard.steps[ctx.wizard.cursor](ctx);
                break;
            case 1:
                if (state['prevEvent'] && ctx.update.message.text == "Оставить")
                    this.description = state['prevEvent'].description;
                else
                    this.description = ctx.update.message.text;
                
                if (this.description.length <= 100) {
                    const event: Event = state.event;
                    const prevEvent: Event | undefined = state.prevEvent;

                    this.summary = this.role == "OWNER" ? this.summary : event.summary;
                    this.dateStart = event.start as string;
                    this.dateEnd = event.end as string;

                    if (prevEvent) {
                        this.summary = prevEvent.summary;
                        await this.updateEvent(prevEvent.id);
                    }
                    else {
                        await this.createEvent();
                    }
                    
                    ctx.wizard.next();
                    ctx.wizard.steps[ctx.wizard.cursor](ctx);
                } else 
                    await ctx.reply('Неверный ввод. Длина темы не может превышать 100 символов! Попробуйте еще раз.');

                break;
        }
    }

	@WizardStep(3)
	async step3(@Context() ctx: Scenes.WizardContext) {
        let text = `Запись успешно <b>${ctx.wizard.state['prevEvent'] ? 'обновлена' : 'создана'}</b>:\n\n` +
        `<b>Владелец</b>: @Alexeev_Dauwalter\n` +
        `<b>Пользователь</b>: @${this.summary}\n` +
        `<b>Описание</b>: ${this.description}\n` +
        `<b>Начало</b>: ${moment(this.dateStart).tz("Europe/Moscow").format("DD.MM.YYYY, HH:mm")}\n` +
        `<b>Конец</b>: ${moment(this.dateEnd).tz("Europe/Moscow").format("DD.MM.YYYY, HH:mm")}`;

        await ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: Markup.keyboard(
                ctx.wizard.state['user'].role == "OWNER" 
                ? inline_keyboard_owner
                : inline_keyboard_user
            ).resize().reply_markup
        });
        return ctx.scene.leave();
	}


    private async createEvent () {
        const calendaApi = new CalendarAPI("");

        await calendaApi.addEvent({
            calendarId: "Alexeev_Dauwalter",
            data: {
                summary: this.summary,
                description: this.description,
                start: {
                    dateTime: this.dateStart as string,
                    timeZone:'Europe/Moscow'
                },
                end: {
                    dateTime: this.dateEnd as string,
                    timeZone:'Europe/Moscow'
                }
            }
        });
    }

    
    private async updateEvent(id: string) {
        const calendaApi = new CalendarAPI("");

        await calendaApi.updateEvent({
            calendarId: "Alexeev_Dauwalter",
            eventId: id,
            requestBody: {
                summary: this.summary,
                description: this.description,
                start: {
                    dateTime: this.dateStart as string,
                    timeZone: 'Europe/Moscow'
                },
                end: {
                    dateTime: this.dateEnd as string,
                    timeZone: 'Europe/Moscow'
                }
            }
        });
    }
}
