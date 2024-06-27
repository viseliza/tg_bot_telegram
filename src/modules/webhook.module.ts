import {
	ConfigModule,
	ConfigService
} from '@nestjs/config';
import {
	WebhookCommandService,
	WebhookHearsService,
	WebhookService,
	DatabaseService
} from '../services';
import {
	ScheduleRangeWizard,
	EventsMainWizard,
	CreateEventWizard,
	UpdateSettingOfUserWizard
} from '../wizards';
import { PrismaService } from '../prisma/prisma.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { Module } from '@nestjs/common';
import { session } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();


@Module({
	imports: [
		ConfigModule,
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				token: configService.get('BOT_TOKEN'),
				middlewares: [session()],
				// options: {
				// 	telegram: {
				// 		agent: new https.Agent({
				// 			keepAlive: false,
				// 		}),
				// 	}
				// }
			}),
			inject: [ConfigService],
		})
	],
	providers: [
		WebhookService,
		WebhookCommandService,
		WebhookHearsService,
		DatabaseService,
		PrismaService,
		ScheduleRangeWizard,
		EventsMainWizard,
		CreateEventWizard,
		UpdateSettingOfUserWizard,
	],
})
export class WebhookModule { }