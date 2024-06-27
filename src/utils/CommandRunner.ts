import { NotFoundException } from "@nestjs/common";
import type { 
    Command, 
    CommandStrategy, 
    ICommandRunner, 
    ParamsCommadStrategy, 
    ReturnParams 
} from "../types";


export class CommandRunner implements ICommandRunner {
    private strategies: Record<string, CommandStrategy> = {};

    
    public use(name: Command, strategy: CommandStrategy): void {
        this.strategies[name] = strategy;
    }

    
    public async run(name: string, ...args: ParamsCommadStrategy): Promise<ReturnParams> {
        if (!this.strategies[name])
            throw new NotFoundException();

        return await this.strategies[name].run.apply(null, args);
    }
}