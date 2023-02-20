import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { mainServer, boostLogs, green, red } from '../config.js';

export default async function run(oldMember: GuildMember, newMember: GuildMember) {
	if (oldMember.guild.id !== mainServer) return;

	const baseEmbed = new MessageEmbed()
		.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
		.setFooter({ text: newMember.id });

	const boostLog = newMember.client.channels.cache.get(boostLogs) as TextChannel;

	if (oldMember.premiumSinceTimestamp && !newMember.premiumSinceTimestamp) {
		//unboost
		boostLog.send({
			embeds: [
				baseEmbed
					.setColor(red)
					.setTitle('Member Unboosted')
					.setDescription(
						`・${newMember}/\n・Started boosting <t:${Math.round(oldMember.premiumSinceTimestamp / 1000)}:R>`
					)
			]
		});
	} else if (!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) {
		//boost
		boostLog.send({
			embeds: [
				baseEmbed
					.setColor(green)
					.setTitle('Member Boosted')
					.setDescription(`・${newMember}\n・Started boosting <t:${Math.round(Date.now() / 1000)}:R>`)
			]
		});
	}
}
