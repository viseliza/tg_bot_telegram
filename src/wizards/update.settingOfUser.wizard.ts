import { 
	Context, 
	Hears, 
	On, 
	Wizard, 
	WizardStep
} from 'nestjs-telegraf'
import { CalendarAPI } from 'src/common/api/api';
import { inline_keyboard_owner, inline_keyboard_user } from 'src/common/keyboards';
import { Setting, User } from 'src/models';
import { 
	Scenes, 
	Context as Ctx, 
	Markup 
} from 'telegraf'
import * as moment from 'moment';

@Wizard('setSettings')
export class UpdateSettingOfUserWizard {
	private state: number = 0;
    private settings: Setting;
    private calendarApi: CalendarAPI

    @WizardStep(1)
    async step1(ctx) {
        this.state = 0;
    }

	@WizardStep(2)
	async step2(@Context() ctx: any) {
        this.calendarApi = new CalendarAPI("");
        this.state = 1;
        const user: User = ctx.wizard.state['user'];
        this.settings = await this.calendarApi.getSetting(user.id);
  
        await ctx.reply(
            `Текущие настройки:\n\n` +
            `<b>Интервал</b>: ${this.settings.interval}\n\n` +
            `<b>График встреч</b>\n` +
            `Понедельник: ${this.settings.monday}\n` +
            `Вторник: ${this.settings.tuesday}\n` +
            `Среда: ${this.settings.wednesday}\n` +
            `Четверг: ${this.settings.thursday}\n` +
            `Пятница: ${this.settings.friday}\n` +
            `Суббота: ${this.settings.saturday}\n` +
            `Воскресенье: ${this.settings.sunday}\n`, {
            parse_mode: 'HTML',
            reply_markup: Markup.keyboard([['Отмена', 'Оставить']]).resize().reply_markup
        });

        await this.step(ctx, 'интервал');
    }


	@WizardStep(3)
	async step3(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на понедельник');
	}


	@WizardStep(4)
	async step4(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на вторник');
	}
    

	@WizardStep(5)
	async step5(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на среду');
	}


	@WizardStep(6)
	async step6(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на четверг');
	}
    

	@WizardStep(7)
	async step7(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на пятницу');
	}    
    

	@WizardStep(8)
	async step8(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на субботу');
	}


	@WizardStep(9)
	async step9(@Context() ctx: Scenes.WizardContext) {
        await this.step(ctx, 'график на воскресенье');
	}

    
	@Hears('Отмена')
	async backSchedule(ctx: Scenes.WizardContext) {
        await ctx.reply('Действие отменено',  Markup.keyboard(
            ctx.wizard.state['user'].role == "OWNER" 
            ? inline_keyboard_owner
            : inline_keyboard_user
        ).resize());
		ctx.scene.leave();
	}

    
    @On('text')
    async onMessage(ctx) {
        let pass: boolean;
        const entered = ctx.update.message.text;

        if (this.settings) {
            if (this.state == 1 && entered != 'Оставить') {
                pass = isNaN(Number.parseInt(entered));
            } else if (this.state > 1 && entered != 'Оставить') {
                pass = !this.isTime(entered);
            }

            this.settings[Object.keys(this.settings)[this.state]] = entered == 'Оставить' 
            ? this.settings[Object.keys(this.settings)[this.state]]
            : entered;
        }        

        if (!pass) {
            ctx.wizard.next();
            this.state++;
        }
        else
            ctx.reply('Неравильный формат введенной строки!');

        ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }


    private async step(ctx: Ctx, param: string) {
        await ctx.reply(`Введите ${param}:`,
			Markup.keyboard([
				['Отмена', 'Оставить']
			]).resize()
        );
    }

	@WizardStep(10)
	async step10(@Context() ctx: Scenes.WizardContext) {
        await this.calendarApi.updateSetting(this.settings);

        await ctx.reply(
            `Текущие настройки:\n\n` +
            `<b>Интервал</b>: ${this.settings.interval}\n\n` +
            `<b>График встреч</b>\n` +
            `<b>Понедельник</b>: ${this.settings.monday}\n` +
            `<b>Вторник</b>: ${this.settings.tuesday}\n` +
            `<b>Среда</b>: ${this.settings.wednesday}\n` +
            `<b>Четверг</b>: ${this.settings.thursday}\n` +
            `<b>Пятница</b>: ${this.settings.friday}\n` +
            `<b>Суббота</b>: ${this.settings.saturday}\n` +
            `<b>Воскресенье</b>: ${this.settings.sunday}\n`, {
            parse_mode: 'HTML',
            reply_markup: Markup.keyboard(
                ctx.wizard.state['user'].role == "OWNER" 
                ? inline_keyboard_owner
                : inline_keyboard_user
            ).resize().reply_markup
        });

        return ctx.scene.leave();
	}
    
    private isTime(value: string): boolean {
        try { 
            const start = value.split('-')[0];
            const end = value.split('-')[1];
            const minutesStart = start.split(':')[0];
            const secondsStart = start.split(':')[1];
            const minutesEnd = end.split(':')[0];
            const secondsEnd = end.split(':')[1];
            
            const isValidStart = moment(`20111031${minutesStart}${secondsStart}`, "YYYYMMDDHHmm").isValid();
            const isValidEnd = moment(`20111031${minutesEnd}${secondsEnd}`, "YYYYMMDDHHmm").isValid();
            
            return isValidStart && isValidEnd && !isNaN(Number.parseInt(minutesStart)) && !isNaN(Number.parseInt(minutesEnd)) && !isNaN(Number.parseInt(secondsStart)) && !isNaN(Number.parseInt(secondsEnd));
        } catch {
            return false;
        }
    }
}