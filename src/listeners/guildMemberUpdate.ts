import { Listener } from '@sapphire/framework';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { mainServer, boostLogs } from '../config.json';

export class GuildMemberUpdateListener extends Listener {
	public async run(oldMember: GuildMember, newMember: GuildMember) {
		if (oldMember.guild.id !== mainServer) return;
		const { client } = newMember;
		const log = client.channels.cache.get(boostLogs) as TextChannel;
		const baseEmbed = new MessageEmbed()
			.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
			.setFooter({ text: newMember.id });

		if (oldMember.premiumSinceTimestamp && !newMember.premiumSinceTimestamp) {
			//unboost
			log.send({
				embeds: [
					baseEmbed
						.setColor('RED')
						.setDescription(
							`${newMember} unboosted :/\nThey started boosted <t:${Math.round(
								oldMember.premiumSinceTimestamp / 1000
							)}:R>`
						)
				]
			});
		} else if (!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) {
			//boost
			log.send({
				embeds: [
					baseEmbed.setColor('GREEN').setDescription(`${newMember} just boosted <t:${Math.round(Date.now() / 1000)}:R>`)
				]
			});
		}
	}
}
