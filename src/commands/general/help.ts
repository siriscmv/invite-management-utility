import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class HelpCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'help',
			description: "Get a list of the bot's commands"
		});
	}

	public async messageRun(msg: Message, args: Args) {
		const command = args.pick('command');

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			msg.createdTimestamp - msg.createdTimestamp
		}${command}`;

		return msg.edit(content);
	}
}
