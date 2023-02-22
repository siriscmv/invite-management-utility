
import { EmbedBuilder, TextChannel, Message, Snowflake, GuildTextBasedChannel, Collection } from 'discord.js';
import { mainServer, red, logChannel } from '../config.js';

export default async function run(messages: Collection<Snowflake, Message>, channel: GuildTextBasedChannel) {
	if ( channel.guildId !== mainServer) return;

	const embed = new EmbedBuilder()
		.setColor(red)
		.setTitle('Messages Deleted')
		.setTimestamp(Date.now())
		.setDescription(
			`${messages.size} messages were deleted` //TODO: make this better
		)
		.addFields([
			{ name: 'Channel', value: channel.toString(), inline: true },
		]);

	(channel.client.channels.cache.get(logChannel) as TextChannel)!.send({ embeds: [embed] });
}
