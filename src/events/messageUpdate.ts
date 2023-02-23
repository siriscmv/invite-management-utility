import { EmbedBuilder, TextChannel, Message } from 'discord.js';
import { mainServer, red, logChannel } from '../config.js';

export default async function run(oldMessage: Message, newMessage: Message) {
	if (newMessage.author?.bot || newMessage.webhookId || newMessage.guildId !== mainServer) return;

	const embed = new EmbedBuilder()
		.setColor(red)
		.setTitle('Message Updated')
		.setTimestamp(Date.now())
		.setAuthor({
			name: newMessage.author?.tag ?? 'unknown',
			iconURL: newMessage.author?.displayAvatarURL() ?? undefined
		})
		.setFooter({ text: newMessage.id })
		.addFields([
			{
				name: 'Original',
				value:
					(oldMessage.content?.length > 1000 ? `${oldMessage.content.slice(0, 1000)} ...` : oldMessage.content) ??
					'No content/uncached',
				inline: false
			},
			{
				name: 'Updated',
				value:
					(newMessage.content?.length > 1000 ? `${newMessage.content.slice(0, 1000)} ...` : newMessage.content) ??
					'No content/uncached',
				inline: false
			},
			{
				name: 'Author',
				value: `\`${newMessage.author?.tag ?? 'unknown'}\` (${newMessage.author?.id ?? ''})`,
				inline: true
			}
		]);

	(newMessage.client.channels.cache.get(logChannel) as TextChannel)!.send({ embeds: [embed] });
}
