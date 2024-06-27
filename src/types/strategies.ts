import type { Event } from "../models/Event";
import type { Context } from "telegraf";

export interface CommandStrategy {
    run(...agrs: ParamsCommadStrategy): Promise<ReturnParams>;
}

export type Command = "create" | "update" | "delete";


export interface ICommandRunner {
    use(name: string, strategy: CommandStrategy): void;
    run(name: string, ...args: ParamsCommadStrategy): Promise<ReturnParams>
}


export type ParamsCommadStrategy = [Context, string, Event?];


export type ReturnParams = {
    command: Command,
    event?: Event
}