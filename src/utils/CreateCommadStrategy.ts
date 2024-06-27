import { 
    CommandStrategy, 
    ParamsCommadStrategy,
    ReturnParams 
} from "../types";
import { Event } from '../models/Event';
import * as moment from 'moment';


export class CreateCommadStrategy implements CommandStrategy {
    public async run(...agrs: ParamsCommadStrategy): Promise<ReturnParams> {
        const [ ctx, result ] = agrs;        
        const date = moment(new Date(result));

        const event = new Event({
            summary: 'command' in ctx ? ctx.message.from.username : ctx.callbackQuery.from.username,
            description: '',
            start: date.toISOString(),
            end: date.add(45, 'minute').toISOString()
        });

        await ctx.deleteMessage(ctx.callbackQuery.message.message_id - 1);

        return {
            command: 'create',
            event
        };
    }
}