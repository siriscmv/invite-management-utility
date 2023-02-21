import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { Ticket } from '../utils/Ticket';

export class DeleteTicketCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'delete',
			description: 'Delete a ticket',
			preconditions: ['StaffOnly']
		});
	}

	public async messageRun(msg: Message) {
		const ticket: Ticket | undefined = msg.client.tickets.find((t: Ticket) => t.channel?.id === msg.channelId);

		if (msg.client.deleting) return msg.reply('The bot is currently deleting another ticket, please wait.');

		if (!ticket) return msg.reply(`This command can only be used in tickets`);
		msg.channel.send('Deleting ticket ...');
		return ticket.delete(msg.member!);
	}
}
