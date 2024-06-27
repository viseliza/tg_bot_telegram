import { 
	Action, 
	Context, 
	Hears, 
	On, 
	Wizard, 
	WizardStep 
} from 'nestjs-telegraf'
import { Markup, Scenes } from 'telegraf'
import { ReturnParams } from '../types';
import { CalendarHelper } from '../utils';

@Wizard('eventsMain')
export class EventsMainWizard {
	private calendarHelper: CalendarHelper;

	@WizardStep(1)
	async step1(@Context() ctx: any) {
		const state = ctx.wizard.state;
		this.calendarHelper = new CalendarHelper(state['bot'], state['user'].role);

		if (!state['skip']) {
			await ctx.reply(
				'Здесь вы можете менять настоящие записи.\n\n' +
				'1) <b>Создание</b>. Необходимо выбрать дату и время проведения встречи из свободных мест. После ввести username пользователя, с которым хотите провести встречу и тему встречи.\n' + 
				'2) <b>Обновление</b>. Необходимо выбрать дату и время существующей встречи и новое время для встречи. При необходимости можно поменять тему встречи\n' + 
				'3) <b>Удаление</b>. Необходимо выбрать дату и время существующей встречи, после чего она удалится.', {
					parse_mode: 'HTML',
					reply_markup: Markup.keyboard([['Отмена']]).resize().reply_markup
				}
			);

			await ctx.reply('Выберите действие над событием для продолжения или "Отмена" для возвращение назад', {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: 'Добавить', callback_data: `eventController:create` },
							{ text: 'Обновить', callback_data: `eventController:update` },
							{ text: 'Удалить', callback_data: `eventController:delete` }
						]
					]
				}
			})
		} else {
			ctx.wizard.state.data = "create";
			ctx.wizard.next();
			ctx.wizard.steps[ctx.wizard.cursor](ctx);
		}
	}


	@Action(/eventController:+/)
	buttonSchedule(@Context() ctx: any) {
		const [, data] = ctx.callbackQuery.data.split(':')
		// save data for next step in ctx.wizard.state
		ctx.answerCbQuery();
		ctx.wizard.state.data = data
		ctx.wizard.next()
		ctx.wizard.steps[ctx.wizard.cursor](ctx)
	}

	@Hears('Отмена')
	async backSchedule(ctx: Scenes.WizardContext) {
		this.calendarHelper.deleteCalendars(ctx, ctx.wizard.state['skip'] ? false : true);
		ctx.scene.leave();
	}


	@On('callback_query')
	async okSchedule(ctx: any) {
        let result: ReturnParams;

        if (this.calendarHelper)
		    result = await this.calendarHelper.on(ctx);

        if (result) {
			switch (result.command) {
				case 'update': {
					ctx.wizard.state['skip'] = true;
					ctx.wizard.state['prevEvent'] = result.event;

					await ctx.wizard.back();
					ctx.wizard.steps[ctx.wizard.cursor](ctx);
					break;
				}
				case 'create': {
					await ctx.scene.leave();
					await ctx.scene.enter('createEvent', {
						user: ctx.wizard.state['user'],
						event: result.event,
						prevEvent: ctx.wizard.state['prevEvent']
					});
					break;	
				}
				default:
					await ctx.scene.leave();
					break;
			}
		}
	}


	@WizardStep(2)
	async step2(@Context() ctx: Scenes.WizardContext) {
		// ctx.wizard.state contains stored data
		const data = (ctx.wizard.state as any).data;
		
		await this.calendarHelper.setup(data, ctx.wizard.state['user']);
		await this.calendarHelper.initialize(ctx);

		if (ctx.wizard.state['user'].role == "OWNER")
			ctx.deleteMessage('command' in ctx ? ctx.message.message_id : ctx.callbackQuery.message.message_id);
	}
}
