import { RouterModule, Routes } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook.module';
import { DatabaseModule } from './database.module';
import * as dotenv from 'dotenv';
dotenv.config();

const routes: Routes = [
	{
		path: 'api',
		children: [
			{ 'path': 'webhook', module: WebhookModule }
		]
	}
]

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		DatabaseModule,
		WebhookModule,
		RouterModule.register(routes),
	]
})
export class AppModule { }
