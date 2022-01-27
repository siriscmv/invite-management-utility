import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { emotes } from '../../utils/emotes.js';

export class TrainCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'train',
			aliases: ['learn', 'teach'],
			description: "Extend the bot's knowledge base",
			quotes: [['"', '"']],
			preconditions: ['OwnerOnly'],
			options: ['q', 'a']
		});
	}

	public async messageRun(message: Message, args: Args) {
		const question = args.getOption('q');
		if (!question) return message.reply('Please provide a question to train the bot with.');
		const answer = args.getOption('a');
		if (!answer) return message.reply('Please provide an answer to the question.');

		message.client.knowledgeBase.set(question, answer);
		return message.react(emotes.yes);
	}
}
