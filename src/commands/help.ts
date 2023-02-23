import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import commands, { Command } from '../utils/commands';

const command: Command = {
	name: 'help',
	aliases: ['h'],
	run: async (msg: Message) => {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: msg.client.user.tag,
				iconURL: msg.client.user.displayAvatarURL()
			})
			.setTitle('Help')
			.addFields(
				commands.map((command) => ({
					name: command.name,
					value: `*Aliases: ${command.aliases?.join(', ') ?? 'None'}*`,
					inline: true
				}))
			);

		await (msg.channel as TextChannel).send({ embeds: [embed] });
	}
};

export default command;
