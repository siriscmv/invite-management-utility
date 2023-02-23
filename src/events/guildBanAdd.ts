import { EmbedBuilder, TextChannel, GuildBan } from 'discord.js';
import { mainServer, red, logChannel } from '../config.js';

export default async function run(ban: GuildBan) {
	if (ban.guild.id !== mainServer) return;

	const embed = new EmbedBuilder()
		.setColor(red)
		.setTitle('User Banned')
		.setTimestamp(Date.now())
		.setAuthor({ name: ban.user.tag, iconURL: ban.user.displayAvatarURL() })
		.setFooter({ text: ban.user.id })
		.addFields([
			{ name: 'User', value: `\`${ban.user.tag}\` (${ban.user.id})`, inline: true },
			{ name: 'Reason', value: ban.reason ?? 'None', inline: true }
		]);

	(ban.client.channels.cache.get(logChannel) as TextChannel)!.send({ embeds: [embed] });
}
