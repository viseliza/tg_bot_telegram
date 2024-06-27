import { 
	Action, 
	Command, 
	Hears, 
	InjectBot, 
	Start, 
	Update 
} from 'nestjs-telegraf';
import { 
	Context, 
	Telegraf, 
	Markup, 
	Scenes 
} from 'telegraf';
import { 
	inline_keyboard_owner, 
	inline_keyboard_user, 
	keyboard_owner, 
	keyboard_user
} from 'src/common/keyboards';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from './';
import { Role } from '../types';
import { CalendarAPI } from 'src/common/api/api';
import { User } from 'src/models';

@Injectable()
@Update()
export class WebhookService {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
        private readonly databaseService: DatabaseService
	) { }


	@Start()
	async startCommand(ctx: Context) {
		const calendarAPI = new CalendarAPI("");
		const telegram_id = ctx.message.from.username;

		// const user = await this.databaseService.findTgUser({ id: telegram_id });
		const [ user ] = await calendarAPI.getUser(telegram_id);
		
		let role = telegram_id != "Alexeev_Dauwalter" ? 'USER' : "OWNER";

		await this.bot.telegram.setMyCommands(
			role == "USER" 
			? keyboard_user 
			: keyboard_owner		
		);

		if (!user) {
			await calendarAPI.addUser(new User({
				id: telegram_id,
				name: ctx.message.from.first_name,
				role: role.toString(),
			}));
		}

		let text = '👋 Добро пожаловать в бота ассистента с интеграцией в Google Calendar и OpenAI ChatGPT и DALL-E для управления расписанием и общения!\n';
		
		text += role == "USER"
		? '\n👤 Ваша роль <b>пользователь</b>.\n\n🗓 <b>Записаться</b> или <code>/book</code> — Вы можете записываться в свободное время к владельцу\n💬 <b>Чат</b> или <code>/chat</code> — Вы можете общаться с настроенным ChatGPT'
		: '\n⭐ Ваша роль <b>владелец</b>.\n\n🗓 <b>Расписание</b> или <code>/schedule</code> — Отображение текущих записей в календаре\n📌 <b>События</b> или <code>/events</code> — Добавление, редактирование и удаление записей\n🕓 <b>Свободное время</b>  или <code>/set_availability</code> — Редактирование свободного времени для встреч\n❔ <b>Вопрос</b> или <code>/ask</code> — Получение ответа на вопрос от ChatGPT\n🖼 <b>Сгенерировать</b> или <code>/generate</code> — Получение ответа за запрос от DALL-E'; 
		
		text += '\n\n⚙️ Вы можете использовать функционал с помощью inline кнопок или команд.';


		const message = await ctx.replyWithPhoto('https://fotomir.co/files/img/pics/odinochestvo-kartinki-na-avu/odinochestvo-kartinki-na-avu-36.webp', {
				caption: text,
				parse_mode: 'HTML',
				reply_markup: Markup.keyboard(
					role == "USER" 
					? inline_keyboard_user
					: inline_keyboard_owner
				).resize().reply_markup
			}
		);

		const fullChatInfo = await ctx.getChat();
		if (!fullChatInfo.pinned_message)
			await ctx.pinChatMessage(message.message_id);
	}

	@Command('schedule')
	@Hears('schedule')
	@Hears('Расписание 🗓')
	async scheduleCommand(ctx: Scenes.SceneContext) {
		const calendarAPI = new CalendarAPI("");
		const [ user ] = await calendarAPI.getUser(ctx.message.from.username);

		ctx.scene.enter(
			"scheduleRange", { 
				user 
			}
		);
	}


	@Command('book')
	@Hears('book')
	@Hears('Записаться 🗓')
	async book(ctx: Scenes.SceneContext) {
		const calendarAPI = new CalendarAPI("");
		const [ user ] = await calendarAPI.getUser(ctx.message.from.username);

		await ctx.scene.enter("eventsMain", {
			bot: this.bot,
			skip: true, 
			user
		});
	}


	@Command('events')
	@Hears('events')
	@Hears('События 📌')
	async events(ctx: Scenes.SceneContext) {
		const calendarAPI = new CalendarAPI("");
		const [ user ] = await calendarAPI.getUser(ctx.message.from.username);

		await ctx.scene.enter("eventsMain", {
			bot: this.bot,
			skip: false,
			user 
		});
	}


	@Command('set_availability')
	@Hears('set_availability')
	@Hears('Свободное время 🕓')
	async updateSettings(ctx: Scenes.SceneContext) {
		const calendarAPI = new CalendarAPI("");
		const [ user ] = await calendarAPI.getUser(ctx.message.from.username);
		
		await ctx.scene.enter("setSettings", {
			user: user
		});
	}
	

	@Command('ask')
	@Command('generate')
	@Command('chat')
	@Hears('chat')
	@Hears('Чат 💬')
	@Hears('Вопрос ❔')
	@Hears('Сгенерировать 🖼')
	async chat(ctx: Context) {
		await ctx.reply('В разработке...');
	}
}