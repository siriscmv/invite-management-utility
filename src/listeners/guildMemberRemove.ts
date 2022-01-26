import { Listener } from '@sapphire/framework';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { mainServer, boostLogs, boosterRole } from '../config.js';

export class GuildMemberRemoveListener extends Listener {
	public async run(member: GuildMember) {
		if (member.guild.id !== mainServer) return;
		const { client } = member;
		const log = client.channels.cache.get(boostLogs) as TextChannel;
		const baseEmbed = new MessageEmbed()
			.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
			.setFooter({ text: member.id });

		if (member.roles.cache.has(boosterRole) || member.premiumSince) {
			log.send({
				embeds: [
					baseEmbed
						.setColor('RED')
						.setDescription(
							`${member} booster left :/\nThey started boosting <t:${Math.round(
								(member.premiumSinceTimestamp ?? 0) / 1000
							)}:R>`
						)
				]
			});
		}
	}
}
