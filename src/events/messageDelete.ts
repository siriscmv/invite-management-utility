import { EmbedBuilder, TextChannel, Message } from 'discord.js';
import { mainServer, red, logChannel } from '../config.js';

export default async function run(message: Message) {
	if (message.author?.bot || message.webhookId || message.guildId !== mainServer) return;

	const embed = new EmbedBuilder()
		.setColor(red)
		.setTitle('Message Deleted')
		.setTimestamp(Date.now())
		.setAuthor({ name: message.author?.tag ?? 'unknown', iconURL: message.author?.displayAvatarURL() ?? undefined })
		.setThumbnail(message.author?.displayAvatarURL() ?? undefined)
		.setFooter({ text: message.id })
		.setDescription(
			(message.content?.length > 1000 ? `${message.content.slice(0, 1000)} ...` : message.content) ??
				'No content/uncached'
		)
		.addFields([
			{ name: 'Author', value: `\`${message.author?.tag ?? 'unknown'}\` (${message.author?.id ?? ''})`, inline: true },
			{ name: 'Attachments', value: message.attachments.size.toString(), inline: true }
		]);

	(message.client.channels.cache.get(logChannel) as TextChannel)!.send({ embeds: [embed] });
}
