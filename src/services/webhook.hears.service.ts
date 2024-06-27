import { Injectable } from '@nestjs/common';
import { Command, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf, Markup, Scenes } from 'telegraf';

@Injectable()
@Update()
export class WebhookHearsService {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>
	) { }

	/**
	 * Sets a new active event, which transactions will be added to
	 * @param ctx
	 */
	@Hears('Set a new active event 🎈')
	async setActiveEvent(ctx: Scenes.SceneContext) {
		ctx.scene.enter('set-active-event');
	}

	/**
	 * Adds a transaction to the current active event
	 * @param ctx
	 */
	@Hears('Add a transaction 🍟')
	async addTransaction(ctx: Scenes.SceneContext) {
		ctx.scene.enter('add-transaction');
	}

	// @Hears('Look at my events 👀')
	// async lookAtEvents(ctx: Context) {
	//   const telegram_id = ctx.message.from.username;
	//   if (events.length == 0) {
	//     ctx.reply('You have no events!');
	//     return;
	//   }
	//   let reply = `<b>Active Events</b> 📅:\n`;
	//   for (let i = 0; i < events.length; i++) {
	//     const event = events[i];
	//     reply += `${i + 1}: <b>${event.event_name}</b>, Budget: $${
	//       event.budget
	//     }\n`;
	//   }
	//   ctx.replyWithHTML(reply);
	// }

	// /**
	//  * Looks at the last 20 transactions
	//  * @param ctx
	//  */
	// @Hears('Look at last 20 transactions 😒')
	// async lookAtSpendingHistory(ctx: Context) {
	//   const telegram_id = ctx.message.from.username;
	//   const transactions =
	//     await this.transactionService.retrieveAllTransactions(telegram_id);
	//   if (transactions.length == 0) {
	//     ctx.reply('You have not added any transactions!');
	//     return;
	//   }
	//   let reply = `<b>Last 20 transactions 💵:</b>\n`;
	//   for (let i = 0; i < transactions.length && i < 20; i++) {
	//     const transaction = transactions[i];
	//     const event = await this.eventsService.getEventWithId(
	//       transaction.event_id,
	//     );
	//     const time = moment.unix(transaction.created_at).format('DD/MM/YY HH:mm');
	//     reply += `${i + 1}: <b>${event.event_name}</b>, ${
	//       transaction.description
	//     }, $${transaction.cost} at ${time} \n`;
	//   }
	//   ctx.replyWithHTML(reply);
	// }

	// /**
	//  * Creates a new event for the user to add transactions to
	//  * @param ctx
	//  */
	// @Hears('Create a new event ✈')
	// async createEvent(ctx: Scenes.SceneContext) {
	//   await ctx.scene.enter('create-event');
	// }

	// /**
	//  * Views the transactions in the current active event
	//  * @param ctx
	//  */
	// @Hears('View current event 💵')
	// async viewCurrentEvent(ctx: Context) {
	//   const telegram_id = ctx.message.from.username;
	//   const activeId = await this.usersService.getActiveEventId(telegram_id);
	//   if (!activeId) {
	//     ctx.reply('No active event!');
	//   } else {
	//     const event = await this.eventsService.getEventWithId(activeId);
	//     let reply = `<b>Current active event: ${event.event_name}</b>\n`;
	//     reply += `Total budget: $${Math.round(event.budget)}\n`;
	//     const transactions =
	//       await this.transactionService.retrieveTransactionsEventId(event.id);
	//     reply += `Transaction log: \n`;
	//     if (transactions.length == 0) {
	//       reply += `No transactions recorded!\n`;
	//     }
	//     let totalSpent: number = 0;
	//     for (let i = 0; i < transactions.length; i++) {
	//       const date = transactions[i].created_at;
	//       // Hours part from the timestamp
	//       const time = moment.unix(date).format('DD/MM/YY HH:mm a').toString();
	//       reply += `${i + 1}: ${transactions[i].description}, $${
	//         transactions[i].cost
	//       } at ${time}\n`;
	//       // console.log(`Transaction ${i} cost: ${transactions[i].cost}`);
	//       totalSpent += +transactions[i].cost;
	//     }
	//     //   console.log(totalSpent);
	//     const remaining = event.budget - totalSpent;
	//     if (remaining < 0) {
	//       const negated = Math.abs(remaining);
	//       reply += `Remaining: You have exceeded your budget by $${negated}😒\n`;
	//     } else {
	//       reply += `Remaining: $${remaining}`;
	//     }

	//     ctx.replyWithHTML(reply);
	//   }
	// }

	@Hears('Remove an event ❌')
	async removeEvent(ctx: Scenes.SceneContext) {
		ctx.scene.enter('remove-event');
	}

	@Hears('Edit a transaction ✏')
	async editTransaction(ctx: Scenes.SceneContext) {
		ctx.scene.enter('edit-transaction');
	}
}