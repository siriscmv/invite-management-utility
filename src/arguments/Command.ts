import { Argument, ArgumentContext, Command, PieceContext } from '@sapphire/framework';

export class CommandArgument extends Argument<Command> {
	public constructor(context: PieceContext) {
		super(context, { name: 'commands', aliases: ['cmd'] });
	}

	public run(parameter: string, context: ArgumentContext<Command>): Argument.Result<Command> {
		//const command = container.stores.get('commands');
		return this.error({
			parameter,
			message: 'Unable to find a command',
			context
		});
	}
}

declare module '@sapphire/framework' {
	export interface ArgType {
		commands: Command;
		cmd: Command;
	}
}
