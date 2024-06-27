// import { Injectable } from '@nestjs/common';
// import { Action, Command, Hears, InjectBot, On, Update, Context as Ctx } from 'nestjs-telegraf';
// import { CalendarAPI } from '../common/api/api';
// import { CreateEventDto } from '../dto/create.event.dto';
// import { Context, Telegraf, Markup, Scenes } from 'telegraf';
// import * as Calendar from 'telegram-inline-calendar';
// // import * as moment from 'moment';
// import * as moment from 'moment-timezone';
// import { CalendarHelper } from '../utils';
// import { GetEventDto } from '../dto/get.event.dto';
// import { Event } from '../models/Event';
// import { IEvents, Role } from '../types';
// import { CommandRunner } from 'src/utils/CommandRunner';
// import { CreateCommadStrategy } from 'src/utils/CreateCommadStrategy';

// @Injectable()
// @Update()
// export class WebhookActionService {

// 	@Action('chat')
// 	@Hears('chat')
// 	@Hears('Чат 💬')
// 	async chat(ctx: Context) {
// 	}


// 	@Command('schedule')
// 	@Hears('schedule')
// 	@Hears('Расписание 🗓')
// 	async scheduleCommand(ctx: Scenes.SceneContext) {
// 		ctx.scene.enter("scheduleRange");
// 	}


// 	@Command('book')
// 	@Hears('book')
// 	@Hears('Записаться 🗓')
// 	async book(ctx: Scenes.SceneContext) {
// 		await ctx.scene.enter("book");
// 	}


// 	@Command('events')
// 	@Hears('events')
// 	@Hears('События 📌')
// 	async events(ctx: Scenes.SceneContext) {
// 		await ctx.scene.enter("eventsMain");
// 	}
// }