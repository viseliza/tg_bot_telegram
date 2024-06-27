import { Injectable } from '@nestjs/common';
import { Command, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf, Markup, Scenes } from 'telegraf';

@Injectable()
@Update()
export class WebhookCommandService {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>
	) { }
	@Command('add_event')
	async add_event(ctx: Context) {
		console.log("YEAA")
		await ctx.reply('add_event');
	}

	@Command('edit_event')
	async edit_event(ctx: Context) {
		console.log("YEAA")
		await ctx.reply('edit_event');
	}

	@Command('delete_event')
	async delete_event(ctx: Context) {
		console.log("YEAA")
		await ctx.reply('delete_event');
	}
}