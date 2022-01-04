import { Argument, ArgumentContext, Command, CommandStore, PieceContext } from '@sapphire/framework';
const { container } = require('@sapphire/framework');
export class CommandArgument extends Argument<Command> {
	public constructor(context: PieceContext) {
		super(context, { name: 'command', aliases: ['cmd'] });
	}

	public run(parameter: string, context: ArgumentContext<Command>): Argument.Result<Command> {
		const command: CommandStore = container.stores.get('commands');
		if (command.has(parameter)) return this.ok(command.get(parameter)!);
		if (command.some((c) => c.aliases.includes(parameter))) return this.ok(command.get(parameter)!);
		return this.error({
			parameter,
			message: 'Unable to find a command',
			context
		});
	}
}

declare module '@sapphire/framework' {
	export interface ArgType {
		command: Command;
		cmd: Command;
	}
}
