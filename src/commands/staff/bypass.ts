import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class VerifyBypassCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'bypass',
			description: 'Prevent a member from being kicked due to low account age'
		});
	}

	public async messageRun(msg: Message, args: Args) {
		const current = msg.client.db.get('autoKickBypass') as string[];
		const user = await args.pick('user');

		if (!user) return msg.reply('Please specify a user to bypass');

		if (current.includes(user.id)) {
			const newData = current.filter((_id) => _id !== user.id);
			msg.client.db.set('autoKickBypass', newData);

			return msg.reply(`Successfully removed \`${user.tag}\` from bypass list`);
		} else {
			current.push(user.id);
			msg.client.db.set('autoKickBypass', current);

			return msg.reply(`Successfully added \`${user.tag}\` to bypass list`);
		}
	}
}
