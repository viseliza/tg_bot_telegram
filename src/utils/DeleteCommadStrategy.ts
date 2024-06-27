import { 
    CommandStrategy, 
    ParamsCommadStrategy, 
    ReturnParams 
} from "../types";
import { Markup } from "telegraf";
import { inline_keyboard_owner } from "../common/keyboards";
import * as moment from 'moment';
import { CalendarAPI } from "../common/api/api";

export class DeleteCommadStrategy implements CommandStrategy {
    public async run(...agrs: ParamsCommadStrategy): Promise<ReturnParams> {
        const calendaApi = new CalendarAPI("");
        const [ ctx, result, event ] = agrs;        
        const date = moment(new Date(result));
        
        await ctx.reply(
            `Вы удалили запись к @Alexeev_Dauwalter\n<b>${date.tz("Europe/Moscow").format("DD.MM.YYYY, HH:mm")}</b>`, {
                parse_mode: 'HTML',
                reply_markup: Markup.keyboard(inline_keyboard_owner).resize().reply_markup
            }
        );

        await ctx.deleteMessage(ctx.callbackQuery.message.message_id - 1);

        await calendaApi.deleteEvent({
            calendarId: "Alexeev_Dauwalter",
            eventId: event.id
        });

        return {
            command: 'delete'
        };
    }
}

