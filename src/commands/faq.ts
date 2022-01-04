import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'faq',
			aliases: ['setup'],
			description: 'Learn to setup the bot'
		});
	}

	public async messageRun(msg: Message) {
		return msg.reply('<https://siris.gitbook.io/invite-management/faq>');
	}
}
