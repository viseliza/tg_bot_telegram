import { 
	Action, 
	Context, 
	Hears, 
	InjectBot, 
	On, 
	Wizard, 
	WizardStep
} from 'nestjs-telegraf'
import { 
	Scenes, 
	Telegraf, 
	Context as Ctx, 
	Markup 
} from 'telegraf'
import { CalendarHelper } from '../utils';

@Wizard('scheduleRange')
export class ScheduleRangeWizard {
	private calendarHelper: CalendarHelper;
	constructor(@InjectBot() private readonly bot: Telegraf<Ctx>) { }

	@WizardStep(1)
	async step1(@Context() ctx: Scenes.WizardContext) {
		await ctx.reply(
			'Здесь вы можете просматривать настоящие записи за определенный промежуток времени или все существующие записи.', {
				parse_mode: 'HTML',
				reply_markup: Markup.keyboard([['Отмена']]).resize().reply_markup
			}
		);
		this.calendarHelper = new CalendarHelper(this.bot, ctx.wizard.state['user'].role);
		
		await ctx.reply('Выберите период для просмотра событий в нем начиная с этого дня', {
			reply_markup: {
				inline_keyboard: [
					[
						{ text: 'На завтра', callback_data: `calendarRange:1` },
						{ text: 'Три дня', callback_data: `calendarRange:3` },
						{ text: 'На неделю', callback_data: `calendarRange:7` }
					], [
						{ text: 'Весь календарь', callback_data: `calendarRange:0` }
					]
				]
			}
		})
	}

	@Action(/calendarRange:+/)
	buttonSchedule(@Context() ctx: any) {
		const [, data] = ctx.callbackQuery.data.split(':')
		// save data for next step in ctx.wizard.state
		ctx.wizard.state.data = data
		ctx.wizard.next()
		ctx.wizard.steps[ctx.wizard.cursor](ctx)
	}

	@Hears('Отмена')
	async backSchedule(ctx: Scenes.WizardContext) {
		this.calendarHelper.deleteCalendars(ctx, true);
		ctx.scene.leave();
	}

	@On('callback_query')
	async okSchedule(ctx: any) {
		if (this.calendarHelper)
			this.calendarHelper.on(ctx);
	}

	@WizardStep(2)
	async step2(@Context() ctx: Scenes.WizardContext) {
		// ctx.wizard.state contains stored data
		const data = (ctx.wizard.state as any).data;
		await this.calendarHelper.setup("schedule", ctx.wizard.state['user'], Number.parseInt(data));
		await this.calendarHelper.initialize(ctx);
	}
}