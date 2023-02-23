import { Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../utils/commands.js';

const command: Command = {
	name: 'purge',
	shouldRun: (msg: Message) => {
		return (msg.channel as TextChannel).permissionsFor(msg.member!)?.has(PermissionFlagsBits.ManageMessages);
	},
	run: async (msg: Message) => {
		const amount = parseInt(msg.content.split(' ')[1]);
		if (isNaN(amount)) return msg.reply('Invalid amount');

		let count = 0;

		while (count !== amount + 1) {
			const remaining = amount + 1 - count;
			const deleted = await (msg.channel as TextChannel).bulkDelete(Math.min(remaining, 100), true);
			count += deleted.size;
			if (deleted.size === 0) break;
		}

		return (msg.channel as TextChannel).send(`Deleted \`${count}\` messages`);
	}
};

export default command;
