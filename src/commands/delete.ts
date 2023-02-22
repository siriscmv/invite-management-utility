import { Message, TextChannel } from 'discord.js';
import { staffRoles } from 'src/config';
import Ticket, { tickets, isDeleting } from 'src/utils/Ticket';
import { Command } from '../utils/commands';

const command: Command = {
	name: 'delete',
	aliases: ['close'],
	shouldRun: (msg: Message) => {
		const ticket: Ticket | undefined = tickets.find((t: Ticket) => t.channel?.id === msg.channelId);
		if (!ticket) return 'This command can only be used in tickets';

		if (isDeleting()) return 'The bot is currently deleting another ticket, please wait.';
		if (msg.member!.roles.cache.some((r) => staffRoles.includes(r.id))) return true;
		if (ticket.user.id === msg.author.id) return true;

		return false;
	},
	run: (msg: Message) => {
		const ticket: Ticket = tickets.find((t: Ticket) => t.channel?.id === msg.channelId)!;
		const channel = msg.channel as TextChannel;
		channel.send('Deleting ticket ...');
		return ticket.delete(msg.member!);
	}
};

export default command;
