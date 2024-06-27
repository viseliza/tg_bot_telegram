import { 
    CommandStrategy, 
    ParamsCommadStrategy, 
    ReturnParams 
} from "../types";
import { Markup } from "telegraf";
import * as moment from 'moment';
import { inline_keyboard_owner } from "../common/keyboards";

export class UpdateCommadStrategy implements CommandStrategy {
    public async run(...agrs: ParamsCommadStrategy): Promise<ReturnParams> {
        const [ ctx, result, event ] = agrs;        
        const date = moment(new Date(result));

        await ctx.reply(
            `Вы выбрали запись на изменение к @Alexeev_Dauwalter <b>${date.tz("Europe/Moscow").format("DD.MM.YYYY, HH:mm")}</b>`, {
                parse_mode: 'HTML',
                reply_markup: Markup.keyboard(inline_keyboard_owner).resize().reply_markup
            }
        );

        await ctx.deleteMessage(ctx.callbackQuery.message.message_id - 1);

        return {
            command: 'update',
            event
        };
    }
}

