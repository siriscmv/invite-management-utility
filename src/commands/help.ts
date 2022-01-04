import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { container } from '@sapphire/framework';

export class PingCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'help',
			description: 'Get a list of my commands'
		});
	}

	public async messageRun(msg: Message) {
		const commands = PingCommand;
	}
}
